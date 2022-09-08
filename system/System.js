class Battery {
    constructor(capacity, min_SOC, SOC, efficiency) {
        this.capacity = capacity;
        this.min_SOC = min_SOC;
        this.SOC = SOC
        this.efficiency = efficiency
    }
    //function implementation here
    //this should includes any calculation related to battery like current charging percentage
    current_charge() {
        return this.SOC;
    }
} 

class Generator {
    constructor(size) {
        this.size = size;
    }
} 

class PV {
    constructor(size, losses) {
        this.size = size;
        this.losses = losses;
    }
} 

class Inverter {
    constructor() {
        this.efficiency = 0.95;
        this.inverter_size = 168.2
        this.solar_to_load_limit = 60
        this.solar_to_battery_limit = 168.2
    }
}

class Mics {
    constructor() {
        this.distribution_losses = 0.10
    }
}

module.exports = { Battery, Generator, PV, Inverter, Mics}