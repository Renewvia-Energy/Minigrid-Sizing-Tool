const {Battery, Generator, PV, Inverter, Mics} = require('../system/System')

var battery = new Battery(300.3, 36.04, 300.3, 0.975)
var generator = new Generator(100)
var PVArray = new PV(120.4, 0.11)
var inverter = new Inverter()
var mics = new Mics()

// number of parameter needed so far that are assoicated with time: solar_irradiation, load
function available_solar_from_array(solar_irradiation) {
    return (1 - PVArray.losses) * PVArray.size * solar_irradiation / 1000
}

function available_solar_from_inverters(solar_irradiation) { // this should have some paramater associated with time so that solar_irradiation() has the correct parameter
    return Math.min(available_solar_from_array(solar_irradiation) * inverter.efficiency, inverter.inverter_size)
}

function load_with_distribution_losses(load) {
    return load/(1-mics.distribution_losses)
}

function total_solar_to_load(solar_irradiation, load) {
    return Math.min(available_solar_from_inverters(solar_irradiation), load_with_distribution_losses(load), inverter.solar_to_load_limit)
}

function load_remaining_after_solar(solar_irradiation, load) {
    return load_with_distribution_losses(load) - total_solar_to_load(solar_irradiation, load)
}

function solar_remaining(solar_irradiation, load) {
    return available_solar_from_inverters(solar_irradiation) - total_solar_to_load(solar_irradiation, load)
}

function solar_into_battery(solar_irradiation, load) {
    let solar_into_battery =  Math.min(solar_remaining(solar_irradiation, load) * inverter.efficiency * battery.efficiency, inverter.solar_to_battery_limit,
        battery.capacity - battery.SOC)
    
    battery.SOC = Math.min(battery.SOC + solar_into_battery, battery.capacity)
    return solar_into_battery
}

function battery_available_to_load() {
    return (battery.SOC - battery.min_SOC) * inverter.efficiency * battery.efficiency
}

function battery_to_load(solar_irradiation, load) {
    let battery_to_load = Math.min(battery_available_to_load(),load_remaining_after_solar(solar_irradiation, load))
    battery.SOC = (battery.SOC - battery_to_load)/(inverter.efficiency * battery.efficiency)
    return battery_to_load
}

function load_remain_after_battery(solar_irradiation, load) {
    return load_remaining_after_solar(solar_irradiation, load) - battery_to_load(solar_irradiation, load)
}

function generator_load(solar_irradiation, load) {
    return Math.min(load_remain_after_battery(solar_irradiation, load), generator.size)
}

function load_shedding(solar_irradiation, load) {
    return (load_remain_after_battery(solar_irradiation, load) - generator_load(solar_irradiation, load)) * (1 - mics.distribution_losses)
}

function wasted_solar(solar_irradiation, load) {
    return available_solar_from_array(solar_irradiation) - (total_solar_to_load(solar_irradiation, load)/ inverter.efficiency)
        - (solar_into_battery(solar_irradiation, load)/(inverter.efficiency * battery.efficiency))
}

function generator_loading(solar_irradiation, load) {
    try {
        return 100 * generator_load(solar_irradiation, load)
    }
    catch {
        return 0
    }
}

function generator_fuel_consumption() {
    return
}






battery.SOC = 168.8
console.log(solar_into_battery(88, 13.6))
console.log(battery.SOC)
console.log(battery_available_to_load())
console.log(battery_to_load(88, 13.6))
console.log(generator_loading(88, 13.6))
