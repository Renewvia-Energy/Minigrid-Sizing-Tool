//const {Battery, Generator, PV, Inverter, Mics} = require('../system/System')

var battery = new Battery(300.3, 36.04, 168.6, 0.975)
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


var total_available_solar_from_array = 0;
var total_wasted_solar = 0;
var demand;
var total_yearly_demand = 159454
var total_energy_sold;
var total_load_unmet;
var wasted_PV;
var DC_after_all_loses;
var capacity_factor;
var available_PV_sold;
var renewable_penetration;


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
    return generator_load
}
//generator_load()
//console.log(generator_load)

function f_load_shedding() {
    load_shedding = (load_remain_after_battery - generator_load) * (1 - mics.distribution_losses)
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
//wasted_solar()
//console.log(wasted_solar)

function f_generator_loading() {
    try {
        generator_loading = 100 * generator_load
    }
    catch {
        generator_loading = 0
    }
    return generator_loading / 100
}
//generator_loading()
//console.log(generator_loading)

function f_generator_fuel_consumption() {
    return
}

function simulation(solar_irradiation, load) {
    solar_irradiation = solar_irradiation
    load = load
    f_available_solar_from_array(solar_irradiation)
    f_available_solar_from_inverters()
    f_load_with_distribution_losses(load)
    f_total_solar_to_load()
    f_load_remaining_after_solar()
    f_solar_remaining()
    f_solar_into_battery()
    f_battery_available_to_load()
    f_battery_to_load()
    f_load_remain_after_battery()
    f_generator_load()
    f_load_shedding()
    f_wasted_solar()
    f_generator_loading()
}

for (let i = 0; i < powerProduction.length  ; i++) {
    //console.log(powerProduction[i])
    //console.log(load[i % 24])
    simulation(powerProduction[i], load[i % 24])
    if (isNaN(total_available_solar_from_array)) {
        console.log(`${i}, ${powerProduction[i]}, ${load[i % 24]}, ${total_available_solar_from_array}`);
        break;
    }
    
}

console.log(total_available_solar_from_array)

