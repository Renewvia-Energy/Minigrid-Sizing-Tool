//const {Battery, Generator, PV, Inverter, Mics} = require('../system/System')

var battery = new Battery(300.3, 36.04, 300.3, 0.975)
var generator = new Generator(100)
var PVArray = new PV(120, 0.11)
var inverter = new Inverter()
var mics = new Mics()


var solar_irradiation;
var load;
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
var generator_fuel_consumption;




var generator_running_hour = 0
var total_available_solar_from_array = 0
var total_wasted_solar = 0
var total_yearly_demand = 159454
var total_load_shedding = 0
var total_generator_load = 0
var total_fuel = 0



// number of parameter needed so far that are assoicated with time: solar_irradiation, load
function f_available_solar_from_array(solar_irradiation) {
    available_solar_from_array =  (1 - PVArray.losses) * PVArray.size * solar_irradiation / 1000
    total_available_solar_from_array = total_available_solar_from_array + available_solar_from_array
    return available_solar_from_array
}
//available_solar_from_array(solar_irradiation)
//console.log(available_solar_from_array)
//console.log(load)

function f_available_solar_from_inverters() { // this should have some paramater associated with time so that solar_irradiation() has the correct parameter
    available_solar_from_inverters = Math.min(available_solar_from_array * inverter.efficiency, inverter.inverter_size)
    return available_solar_from_inverters
}
//available_solar_from_inverters()
//console.log(available_solar_from_inverters)

function f_load_with_distribution_losses(load) {
    load_with_distribution_losses = load/(1-mics.distribution_losses)
    return load_with_distribution_losses
}
//load_with_distribution_losses(load)
//console.log(load_with_distribution_losses)
//console.log(battery.SOC)
//console.log(battery.SOC/300.3)

function f_total_solar_to_load() {
    total_solar_to_load = Math.min(available_solar_from_inverters, load_with_distribution_losses, inverter.solar_to_load_limit)
    return total_solar_to_load
}
//total_solar_to_load()
//console.log(total_solar_to_load)

function f_load_remaining_after_solar() {
    load_remaining_after_solar = load_with_distribution_losses - total_solar_to_load
}
//load_remaining_after_solar()
//console.log(load_remaining_after_solar)

function f_solar_remaining() {
    solar_remaining = available_solar_from_inverters - total_solar_to_load
    return solar_remaining
}
//solar_remaining()
//console.log(solar_remaining)

function f_solar_into_battery() {
    solar_into_battery =  Math.min(solar_remaining * inverter.efficiency * battery.efficiency, inverter.solar_to_battery_limit,
        battery.capacity - battery.SOC)
    
    battery.SOC = Math.min(battery.SOC + solar_into_battery, battery.capacity)
    return solar_into_battery
}
//solar_into_battery()
//console.log(solar_into_battery)
//console.log(battery.SOC)

function f_battery_available_to_load() {
    battery_available_to_load = (battery.SOC - battery.min_SOC) * inverter.efficiency * battery.efficiency
    return battery_available_to_load
}
//battery_available_to_load()
//console.log(battery_available_to_load)

function f_battery_to_load() {
    battery_to_load = Math.min(battery_available_to_load,load_remaining_after_solar)
    battery.SOC = battery.SOC - (battery_to_load/(inverter.efficiency * battery.efficiency))
    return battery_to_load
}
//battery_to_load()
//console.log(battery_to_load)
//console.log(battery.SOC)

function f_load_remain_after_battery() {
    load_remain_after_battery = load_remaining_after_solar - battery_to_load
    return load_remain_after_battery
}
//load_remain_after_battery()
//console.log(load_remain_after_battery)

function f_generator_load() {
    generator_load = Math.min(load_remain_after_battery, generator.size)
    if (generator_load > 0) {
        generator_running_hour += 1
    }
    total_generator_load += generator_load
    return generator_load
}
//generator_load()
//console.log(generator_load)

function f_load_shedding() {
    load_shedding = (load_remain_after_battery - generator_load) * (1 - mics.distribution_losses)
    total_load_shedding = total_load_shedding + load_shedding
    return load_shedding
}
//load_shedding()
//console.log(load_shedding)

function f_wasted_solar() {
    wasted_solar = available_solar_from_array - (total_solar_to_load/ inverter.efficiency)
        - (solar_into_battery/(inverter.efficiency * battery.efficiency))
    total_wasted_solar = total_wasted_solar + wasted_solar
    return wasted_solar
}


function f_generator_fuel_consumption(values, x1,y1,x2,y2,x,y) {
    let q11 = (((x2 - x) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x1][y1]
    let q21 = (((x - x1) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x2][y1]
    let q12 = (((x2 - x) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x1][y2]
    let q22 = (((x - x1) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x2][y2]
    generator_fuel_consumption = q11 + q21 + q12 + q22
    total_fuel += generator_fuel_consumption
    //console.log('y' + generator_load)
    //console.log(generator_fuel_consumption)
    return generator_fuel_consumption
}

function simulation(solar_irradiation, load) {
    solar_irradiation = solar_irradiation
    load = load
    f_available_solar_from_array(solar_irradiation)
    //console.log(available_solar_from_array)
    //console.log(load)
    f_available_solar_from_inverters()
    //console.log(available_solar_from_inverters)
    f_load_with_distribution_losses(load)
    //console.log(load_with_distribution_losses)
    //console.log(battery.SOC)
    f_total_solar_to_load()
    //console.log(total_solar_to_load)
    f_load_remaining_after_solar()
    //console.log(load_remaining_after_solar)
    f_solar_remaining()
    //console.log(solar_remaining)
    f_solar_into_battery()
    //console.log(solar_into_battery)
    //console.log(battery.SOC)
    f_battery_available_to_load()
    //console.log(battery_available_to_load)
    f_battery_to_load()
    //console.log(battery_to_load)
    //console.log(battery.SOC)
    f_load_remain_after_battery()
    //console.log(load_remain_after_battery)
    f_generator_load()
    //console.log(generator_load)
    f_load_shedding()
    //console.log(load_shedding)
    f_wasted_solar()
    //console.log(wasted_solar)
    //f_generator_loading()
    f_generator_fuel_consumption(generator_table, 5,0,6,1,6, generator_load/25)
}


for (let i = 0; i < powerProduction.length  ; i++) {
    //console.log(powerProduction[i])
    //console.log(load[i % 24])
    simulation(powerProduction[i], load[i % 24])
}

console.log('total_available_solar_from_array')
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
console.log('Generator Results')
console.log(total_generator_load)
console.log('Generator kWh/Total kWh')
console.log((total_generator_load/(total_generator_load+total_available_solar_from_array)) * 100)
console.log('Generator Running Hours')
console.log(generator_running_hour)
console.log('Generator Average Loading')
console.log(((0.01 * total_generator_load)/generator_running_hour) * 100)
console.log('Total Fuel Consumption')
console.log(total_fuel * 3.785)