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
        var table = {10: 0, 20:1, 30:2, 40:3, 60:4, 75:5, 100:6, 125:7, 135:8, 150:9,
             175:10, 200:11, 230:12, 250:13, 300:14,350:15,400:16,500:17,600:18, 750:21, 1000:22, 1250:23,
             1500:24, 1750:25, 2000:26, 2250:27}
        this.index = table[size]
    }
} 

class PV {
    constructor(solarPanelCount, losses) {
        this.size = solarPanelCount * (540/1000); //540W?
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
