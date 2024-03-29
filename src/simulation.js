// asume that project going to last for 20 years, C0 = cost tracking tools(original, same very years), 30 Shillance per kWh,
// total kWH for one year, assume that only cost that happen every year is disel, assume that the cost of dieasal 100 per litter. make all of the money for every year at the end of the year,
// pay for the disels at the end of the year -> calculate IRR assume NPV = 0

/**
 * instantiate system variables. These are fixed variables
 */

// size of diseal general 

var generator_table = [[0.0, 0.3, 0.5, 0.7], [0.0, 0.6,0.9,1.3,1.6], [0.0,1.3,1.8,2.4,2.9], [0.0 ,1.6,2.3, 3.2,4.0],
            [0.0,1.8,2.9,3.8,4.8], [0.0,2.4,3.4,4.6,6.1],[0.0,2.6,4.1,5.8,7.4],[0.0,3.1,5.0,7.1,9.1], [0.0,3.3,5.4,7.6,9.8],
            [0.0,3.6,5.9,8.4,10.9],[0.0,4.1,6.8,9.7,12.7],[0.0,4.7,7.7,11.0,14.4],[0.0,5.3,8.8,12.5,16.6],[0.0,5.7,9.5,13.6,18.0],
            [0.0,6.8,11.3,16.1,21.5],[0.0,7.9,13.1,18.7,25.1],[0.0,8.9,14.9,21.3,28.6],[0.0,11.0,18.5,26.4,35.7],[0.0,13.2,22.0,31.5,42.8],
            [0.0,16.3,27.4,39.3,53.4],[0.0,21.6,36.4,52.1,71.1],[0.0,26.9,45.3,65.0,88.8],[0.0,32.2,54.3,77.8,106.5],[0.0,37.5,63.2,90.7,124.2],
            [0.0,42.8,72.2,103.5,141.9],[0.0,48.1,81.1,116.4,159.6]
]



/**
 * Helper function that calculates the index of value in sorted arr array. This function helps with finding x1,x2,y1,y2 in generator_fuel_consumption() function
 * @param {Array} arr : a sorted array that we want to find the index from
 * @param {Double} value: the value that we want to find the index
 * @param {Integer} lo: always 0
 * @param {Integer} hi: the length of arr
 * @returns: return the index that the value should be inserted to the sorted array
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
 * @returns: available_solar_from_array: available solar from array directly from PV
 *           wasted_solar: wasted solar after account for load and battery
 *           generator_load: the load that generator has to help
 *           load_shedding: if we unable to satisfy the demand
 *           generator_fuel: the amount of fuel needs from generator
 */

function calculation(solar_irradiation, load, battery, generator, PVArray, inverter, mics) {
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
    battery_to_load = Math.min(battery_available_to_load,load_remaining_after_solar, inverter.battery_to_load_limit)
    
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
    var row = bisectLeft(generator_sizes, generator.size, 0, 26)
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
 * This function runs the simulation to calculate results and print out to console
 * @param {Integer} solarPanelCount: number of solar panel in system
 * @param {Integer} batteryCount: number of battery in system
 * @param {Integer} chargeControllerCount: number of charge controller in system
 */
function simulation(solarPanelCount, batteryCount, chargeControllerCount) {
    // engineering input goes here
    var battery = new Battery(batteryCount, batteryEfficiency)
    var generator = new Generator(generatorSize)
    var PVArray = new PV(solarPanelCount, PVlosses/100)
    var inverter = new Inverter(chargeControllerCount)
    var mics = new Mics(distributionLoss)
    var inverterCount = Inverter.count
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
            = calculation(powerProduction[i], load[i % 24], battery, generator, PVArray, inverter, mics)
        total_fuel += Math.round(generator_fuel*10)/10
        if (generator_load > 0) {
            generator_running_hour += 1
        }
        total_generator_load += generator_load
        total_available_solar_from_array = total_available_solar_from_array + available_solar_from_array
        total_wasted_solar = total_wasted_solar + wasted_solar
        total_load_shedding = total_load_shedding + load_shedding
    }

    return [totalYearlyDemand - total_load_shedding, total_fuel * 3.785,total_available_solar_from_array - total_wasted_solar,totalYearlyDemand/(1-mics.distribution_losses),totalYearlyDemand,totalYearlyDemand - total_load_shedding,total_load_shedding/totalYearlyDemand,(total_wasted_solar/total_available_solar_from_array) * 100,(totalYearlyDemand - total_load_shedding)/120.4,((totalYearlyDemand - total_load_shedding)/(120.4*8760))*100,((totalYearlyDemand - total_load_shedding)/(total_available_solar_from_array)) * 100,(total_available_solar_from_array/( total_available_solar_from_array + total_generator_load))*100,total_generator_load,(total_generator_load/(total_generator_load+total_available_solar_from_array)) * 100, generator_running_hour,((0.01 * total_generator_load)/generator_running_hour) * 100]
}
// using Sbutton for simulation function
var Sbutton = document.getElementById('simulate');

/**
 * parse PV Count, Battery Count,CC count, run simulation and display output in web
 */
Sbutton.onclick = () => {
    var pvCount = parseInt(document.getElementById('num-pv').value)
    var batteryCount = parseInt(document.getElementById('num-batteries').value)
    var ccCount = parseInt(document.getElementById('num-cc').value)
    var res = simulation(pvCount, batteryCount, ccCount)
    console.log(res)
    //display output in web
    document.getElementById('total-energy-from-PV').innerHTML = res[2];
    document.getElementById('demand').innerHTML = res[3];
    document.getElementById('total-yearly-demand').innerHTML = res[4];
    document.getElementById('energy-sold-to-customer').innerHTML = res[0];
    document.getElementById('load-unmet').innerHTML = res[5];
    document.getElementById('wastedPV').innerHTML = res[6];
    document.getElementById('kWh/kW-DC').innerHTML = res[7];
    document.getElementById('capacity-factor').innerHTML = res[8];
    document.getElementById('available-PV-kWh-sold').innerHTML = res[9];
    document.getElementById('PV-kWh/Total-kWh').innerHTML = res[10];
    document.getElementById('generator-energy-production').innerHTML = res[11];
    document.getElementById('generator-running-hours').innerHTML = res[12];
    document.getElementById('generator-average-loading').innerHTML = res[13];
    document.getElementById('total-fuel-consumption').innerHTML = res[1];
}