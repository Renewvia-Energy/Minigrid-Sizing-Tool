class Battery {
    constructor(batteryCount, efficiency) {
        this.capacity = batteryCount * 14.3; //14.3kWh number of battery
        this.min_SOC = this.capacity * .12;
        this.SOC = batteryCount * 14.3
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
        this.size = solarPanelCount * .54; //fix this. 540 is W, solarPanelCount is kWh
        this.losses = losses;
    }
} 

class Inverter {
    constructor(chargeControllerCount) {
        this.efficiency = 0.95;
        this.count = 4 //(max load * 2)/15
        this.inverter_size = chargeControllerCount * 4.7 //inverterCount
        this.solar_to_load_limit = chargeControllerCount * 4.7
        this.solar_to_battery_limit = chargeControllerCount * 4.7 //CC 4726W
        this.battery_to_load_limit = this.count * 15
    }
}

class Mics {
    constructor(distributionLoss) {
        this.distribution_losses = distributionLoss
    }
}
