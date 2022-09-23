/**
 * instantiate system variables. These are fixed variables
 */
var battery = new Battery(300.3, 36.04, 300.3, 0.975)
var generator = new Generator(100)
var PVArray = new PV(120.4, 0.11)
var inverter = new Inverter()
var mics = new Mics()

/**
 * Helper function that calculates generator fuel consumption for each time interval using 2D interpolation
 * @param {Array} values: generator look-up table
 * @param {Double} x1
 * @param {Double} y1
 * @param {Double} x2
 * @param {Double} y2
 * @param {Double} x
 * @param {Double} y 
 * @param {Double} generator_load 
 * @returns 
 */
function generator_fuel_consumption(values, x1,y1,x2,y2,x,y, generator_load) {
    // this is the case when we can simply look up the value in generator_table table
    if (x1 == x2 && y1 == y2){
        return generator_table[x1][y1]
    // linear interpolation
    } else if (x1 == x2) {
      let portion = (generator_table[x2][y2] - generator_table[x2][y1])/(loading_percentage[y2] - loading_percentage[y1])
      return generator_table[x2][y1] + portion * (generator_load - loading_percentage[y1])
    }
    else if (y1 == y2) {
      let portion = (generator_table[x2][y1] - generator_table[x1][y1])/(generator_sizes[x2] - generator_sizes[x1])
      return generator_table[x1][y1] + portion * (generator.size - generator_sizes[x1])
    // Bilinear interpolation
    } else {
      let q11 = (((x2 - x) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x1][y1]
      let q21 = (((x - x1) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x2][y1]
      let q12 = (((x2 - x) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x1][y2]
      let q22 = (((x - x1) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x2][y2]
      return  q11 + q21 + q12 + q22
    }
}


/**
 * Helper function that calculates the index of value in sorted arr array. This function helps with finding x1,x2,y1,y2 in generator_fuel_consumption() function
 * @param {Array} arr 
 * @param {Double} value 
 * @param {Integer} lo 
 * @param {Integer} hi 
 * @returns 
 */
function bisectLeft(arr, value, lo, hi) {
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < value) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
}

/**
 * This function contains all of the calculation in stimulation sheet
 * @param {Double} solar_irradiation DC Power Production for particular time interval
 * @param {Double} load amount of load needed for particular time interval
 * @returns 
 */
function calculation(solar_irradiation, load) {
    // instantiate static variables for each time interval
    var available_solar_from_array;
    var available_solar_from_inverters;
    var load_with_distribution_losses;
    var total_solar_to_load;
    var load_remaining_after_solar;
    var solar_remaining;
    var solar_into_battery;
    var battery_available_to_load;
    var battery_to_load;
    var load_remain_after_battery;
    var generator_load;
    var load_shedding;
    var wasted_solar;
    var generator_loading;
    var generator_fuel

    //amount of solar directly from PV minus the array losses
    available_solar_from_array =  (1 - PVArray.losses) * PVArray.size * solar_irradiation / 1000
    
    // amount of solar available after invertion
    available_solar_from_inverters = Math.min(available_solar_from_array * inverter.efficiency, inverter.inverter_size)
    
    // load for particular time inverval after considering distribution losses
    load_with_distribution_losses = load/(1-mics.distribution_losses)
    
    // amount of solar to load
    total_solar_to_load = Math.min(available_solar_from_inverters, load_with_distribution_losses, inverter.solar_to_load_limit)
    
    // there might not be enough solar to satisfy load at certain time, so we need to keep track of amount of load needed after using all the solar from array
    load_remaining_after_solar = load_with_distribution_losses - total_solar_to_load
    
    // if there are more solar from array than load at certain time, the remaining amount would go into battery
    solar_remaining = available_solar_from_inverters - total_solar_to_load
    solar_into_battery =  Math.min(solar_remaining * inverter.efficiency * battery.efficiency, inverter.solar_to_battery_limit,
        battery.capacity - battery.SOC)
    
    // update the state of charge of battery
    battery.SOC = Math.min(battery.SOC + solar_into_battery, battery.capacity)

    //amount of energy available from battery at this time interval
    battery_available_to_load = (battery.SOC - battery.min_SOC) * inverter.efficiency * battery.efficiency
    
    // if solar cannot satisfy current needed load, energy from battery will be use
    battery_to_load = Math.min(battery_available_to_load,load_remaining_after_solar)
    
    // updayte battery state of charge since we might use it if there is not enough solar from array
    battery.SOC = battery.SOC - (battery_to_load/(inverter.efficiency * battery.efficiency))
    
    // if all of power from solar and battery cannot satisfy needed load, we will start using the generator
    load_remain_after_battery = load_remaining_after_solar - battery_to_load
    generator_load = Math.min(load_remain_after_battery, generator.size)
    load_shedding = (load_remain_after_battery - generator_load) * (1 - mics.distribution_losses)
    
    // if the power from solar can satisfy the needed load without the help of battery and generator, and the battery is full, we need to keep track of amount of wasted load
    wasted_solar = available_solar_from_array - (total_solar_to_load/ inverter.efficiency)
        - (solar_into_battery/(inverter.efficiency * battery.efficiency))
    
    /**
     * Section below calculates the generator_fuel required if the generator is needed for certain time interval
     */
    var row1, row2, col1, col2, x, y;
    // find the area that generator size belongs in in generator_table
    var row = bisectLeft(generator_sizes,generator.size, 0, 26)
    if (generator_sizes[row] == generator.size) {
        row1 = row2 = row
        x = row
    } else {
        row1 = row - 1
        row2 = row
        x = row1 + (generator.size - generator_sizes[row1])/(generator_sizes[row2] - generator_sizes[row1])
    }

    // find the area that generator load belongs in in generator_table
    var col = bisectLeft(loading_percentage, generator_load, 0, 5)
    if (loading_percentage[col] == generator_load) {
        col1 = col2 = col
        y = col
    } else {
        col1 = col - 1
        col2 = col
        y = col1 + (generator_load - loading_percentage[col1])/(loading_percentage[col2] - loading_percentage[col1])
    }

    // calculate fuel needed using helper function
    generator_fuel = generator_fuel_consumption(generator_table, row1, col1, row2, col2, x, y, generator_load)

    return [available_solar_from_array, wasted_solar, generator_load, load_shedding, generator_fuel]
}



/**
 * This function runs the simulation to calculate results
 */
function simulation() {
    // instantiate results that we're interested in
    var generator_running_hour = 0
    var total_available_solar_from_array = 0
    var total_wasted_solar = 0
    var total_yearly_demand = 159454
    var total_load_shedding = 0
    var total_generator_load = 0
    var total_fuel = 0
    var generator_load = 0

    //iterate through each time interval
    for (let i = 0; i < powerProduction.length ; i++) {
        [available_solar_from_array, wasted_solar, generator_load, load_shedding, generator_fuel] 
            = calculation(powerProduction[i], load[i % 24])
        total_fuel += Math.round(generator_fuel*10)/10
        if (generator_load > 0) {
            generator_running_hour += 1
        }
        total_generator_load += generator_load
        total_available_solar_from_array = total_available_solar_from_array + available_solar_from_array
        total_wasted_solar = total_wasted_solar + wasted_solar
        total_load_shedding = total_load_shedding + load_shedding
    }

    //print the results to console
    console.log('Total Energy Produced from PV')
    console.log(total_available_solar_from_array - total_wasted_solar)
    console.log('Demand(corrected for losses')
    console.log(159454/(1-mics.distribution_losses))
    console.log('Total Yearly Demand')
    console.log(159454)
    console.log('Energy Sold to Customer')
    console.log(159454 - total_load_shedding)
    console.log('% of load kWh unmet')
    console.log(total_load_shedding/159454)
    console.log('wasted PV')
    console.log((total_wasted_solar/total_available_solar_from_array) * 100)
    console.log('kWh/kW DC (After All Losses)')
    console.log((159454 - total_load_shedding)/120.4)
    console.log('Capacity Factor (After All Losses)')
    console.log(((159454 - total_load_shedding)/(120.4*8760))*100)
    console.log('% of available PV kWh sold')
    console.log(((159454 - total_load_shedding)/(total_available_solar_from_array)) * 100)
    console.log('PV kWh/Total kWh (Renewable Penetration)')
    console.log((total_available_solar_from_array/( total_available_solar_from_array + total_generator_load))*100)
    console.log('Generator Energy Production')
    console.log(total_generator_load)
    console.log('Generator kWh/Total kWh')
    console.log((total_generator_load/(total_generator_load+total_available_solar_from_array)) * 100)
    console.log('Generator Running Hours')
    console.log(generator_running_hour)
    console.log('Generator Average Loading')
    console.log(((0.01 * total_generator_load)/generator_running_hour) * 100)
    console.log('Total Fuel Consumption')
    console.log(total_fuel * 3.785)
}

simulation()
