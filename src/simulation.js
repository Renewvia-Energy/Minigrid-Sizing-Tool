var battery = new Battery(300.3, 36.04, 300.3, 0.975)
var generator = new Generator(100)
var PVArray = new PV(120.4, 0.11)
var inverter = new Inverter()
var mics = new Mics()

function functions(solar_irradiation, load) {
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

    available_solar_from_array =  (1 - PVArray.losses) * PVArray.size * solar_irradiation / 1000
    available_solar_from_inverters = Math.min(available_solar_from_array * inverter.efficiency, inverter.inverter_size)
    load_with_distribution_losses = load/(1-mics.distribution_losses)
    total_solar_to_load = Math.min(available_solar_from_inverters, load_with_distribution_losses, inverter.solar_to_load_limit)
    load_remaining_after_solar = load_with_distribution_losses - total_solar_to_load
    solar_remaining = available_solar_from_inverters - total_solar_to_load
    solar_into_battery =  Math.min(solar_remaining * inverter.efficiency * battery.efficiency, inverter.solar_to_battery_limit,
        battery.capacity - battery.SOC)
    
    battery.SOC = Math.min(battery.SOC + solar_into_battery, battery.capacity)
    battery_available_to_load = (battery.SOC - battery.min_SOC) * inverter.efficiency * battery.efficiency
    battery_to_load = Math.min(battery_available_to_load,load_remaining_after_solar)
    battery.SOC = battery.SOC - (battery_to_load/(inverter.efficiency * battery.efficiency))
    load_remain_after_battery = load_remaining_after_solar - battery_to_load
    generator_load = Math.min(load_remain_after_battery, generator.size)

    //if (generator_load > 0) {
    //    generator_running_hour += 1
    //}

    load_shedding = (load_remain_after_battery - generator_load) * (1 - mics.distribution_losses)
    wasted_solar = available_solar_from_array - (total_solar_to_load/ inverter.efficiency)
        - (solar_into_battery/(inverter.efficiency * battery.efficiency))
    
    return [available_solar_from_array, wasted_solar, generator_load, load_shedding]
}

function generator_fuel_consumption(values, x1,y1,x2,y2,x,y) {
    let q11 = (((x2 - x) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x1][y1]
    let q21 = (((x - x1) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x2][y1]
    let q12 = (((x2 - x) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x1][y2]
    let q22 = (((x - x1) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x2][y2]
    return  q11 + q21 + q12 + q22
}

function simulation() {
    var generator_running_hour = 0
    var total_available_solar_from_array = 0
    var total_wasted_solar = 0
    var total_yearly_demand = 159454
    var total_load_shedding = 0
    var total_generator_load = 0
    var total_fuel = 0
    var generator_load = 0

    for (let i = 0; i < powerProduction.length  ; i++) {
        [available_solar_from_array, wasted_solar, generator_load, load_shedding] 
            = functions(powerProduction[i], load[i % 24])
        total_fuel += generator_fuel_consumption(generator_table, 5,0,6,1,6, generator_load/25)
        if (generator_load > 0) {
            generator_running_hour += 1
        }
        total_generator_load += generator_load
        total_available_solar_from_array = total_available_solar_from_array + available_solar_from_array
        total_wasted_solar = total_wasted_solar + wasted_solar
        total_load_shedding = total_load_shedding + load_shedding
    }
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
