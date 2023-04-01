const L_PER_GAL = 4.54609;
const HR_PER_DAY = 24;
const DAYS_PER_YR = 365;

class Panel {
	constructor(Pmp, Voc, Vmp, Isc, Imp, price) {
		this.Pmp = Pmp;
		this.Voc = Voc;
		this.Vmp = Vmp;
		this.Isc = Isc;
		this.Imp = Imp;
		this.price = price;
	}

	getPmp() {
		return this.Pmp;
	}

	getVoc() {
		return this.Voc;
	}

	getVmp() {
		return this.Vmp;
	}

	getIsc() {
		return this.Isc;
	}

	getImp() {
		return this.Imp;
	}

	getPrice() {
		return this.price;
	}

	getEnergy(dcArrayOutputkWhPerkWp) {
		return dcArrayOutputkWhPerkWp*this.Pmp;
	}
}

class String {
	constructor(panels) {
		this.panels = panels;
		// TODO: check all panels equal
		
		this.Pmp = 0;
		this.Voc = 0;
		this.Vmp = 0;
		this.price = 0;
		this.panels.forEach(panel => {
			this.Pmp+= panel.getPmp();
			this.Voc+= panel.getVoc();
			this.Vmp+= panel.getVmp();
			this.price+= panel.getPrice();
		});

		// NOTE: if you allow different panels in one string, this breaks.
		this.Isc = this.panels[0].Isc;
		this.Imp = this.panels[0].Imp;
	}

	getPanels() {
		return this.panels;
	}

	getPmp() {
		return this.Pmp;
	}

	getVoc() {
		return this.Voc;
	}

	getVmp() {
		return this.Vmp;
	}

	getIsc() {
		return this.Isc;
	}

	getImp() {
		return this.Imp;
	}

	getPrice() {
		return this.price;
	}

	getEnergy(dcArrayOutputkWhPerkWp) {
		var energy = 0;
		this.panels.forEach(panel => {
			energy+= panel.getEnergy(dcArrayOutputkWhPerkWp);
		});
		return energy;
	}
}

class Subarray {
	constructor(strings, arrayLosses) {
		this.strings = strings;
		// TODO: confirm all strings same
		this.arrayLosses = arrayLosses;

		// NOTE: this breaks if strings have different voltages
		this.Voc = this.strings[0].getVoc();
		this.Vmp = this.strings[0].getVmp();

		this.Pmp = 0;
		this.Isc = 0;
		this.Imp = 0;
		this.price = 0;
		this.strings.forEach(string => {
			this.Pmp+= string.getPmp();
			this.Isc+= string.getIsc();
			this.Imp+= string.getImp();
			this.price+= string.getPrice();
		});
	}

	getStrings() {
		return this.strings;
	}

	getVoc() {
		return this.Voc;
	}

	getVmp() {
		return this.Vmp;
	}

	getPmp() {
		return this.Pmp;
	}

	getIsc() {
		return this.Isc;
	}

	getImp() {
		return this.Imp;
	}

	getPrice() {
		return this.price;
	}

	getEnergy(dcArrayOutputkWhPerkWp) {
		var energy = 0;
		this.strings.forEach(string => {
			energy+= string.getEnergy(dcArrayOutputkWhPerkWp);
		});
		return energy*(1-this.arrayLosses);
	}
}

class PVInput {
	constructor(Voc_min, Voc_max, Vmp_min, Vmp_max, Isc_max, Imp_max, PVPowerMax) {
		this.Voc_min = Voc_min;
		this.Voc_max = Voc_max;
		this.Vmp_min = Vmp_min;
		this.Vmp_max = Vmp_max;
		this.Isc_max = Isc_max;
		this.Imp_max = Imp_max;
		this.PVPowerMax = PVPowerMax;
		this.price = 0;
	}

	connectSubarray(subarray) {
		this.subarray = subarray;

		if (this.subarray.getVoc()<this.Voc_min || this.subarray.getVoc()>this.Voc_max) {
			throw new Error(`Subarray Voc ${this.subarray.getVoc()} is outside the bounds [${this.Voc_min},${this.Voc_max}]`);
		}
		if (this.subarray.getVmp()<this.Vmp_min || this.subarray.getVmp()>this.Vmp_max) {
			throw new Error(`Subarray Vmp ${this.subarray.getVmp()} is outside the bounds [${this.Vmp_min},${this.Vmp_max}]`);
		}
		if (this.subarray.getIsc()>this.Isc_max) {
			throw new Error(`Subarray Isc ${this.subarray.getIsc()} is greater than the charge controller Isc_max ${this.Isc_max}`);
		}
		if (this.subarray.getImp()>this.Imp_max) {
			throw new Error(`Subarray Imp ${this.subarray.getImp()} is greater than the charge controller Imp_max ${this.Imp_max}`);
		}
		if (this.subarray.getPmp()>this.PVPowerMax) {
			throw new Error(`Subarray Pmp ${this.subarray.getPVPowerMax()} is greater than the charge controller PVPowerMax ${this.PVPowerMax}`);
		}

		this.price = this.subarray.getPrice();
	}

	getPrice() {
		return this.price;
	}

	getEnergy(dcArrayOutputkWhPerkWp) {
		return this.subarray.getEnergy(dcArrayOutputkWhPerkWp);
	}
}

class PVInverterCC {
	constructor(PVInputs, price) {
		this.PVInputs = PVInputs;
		this.price = price;

		this.subarrayPrice = 0;
		this.PVInputs.forEach(pvinput => {
			this.subarrayPrice+= pvinput.getPrice();
		});
	}

	getPVInputs() {
		return this.PVInputs;
	}

	getPrice() {
		return this.price;
	}

	getTotalPrice() {
		return this.subarrayPrice + this.price;
	}

	getUnlimitedEnergy(dcArrayOutputkWhPerkWp) {
		var energy = 0;
		this.PVInputs.forEach(pvinput => {
			energy+= pvinput.getEnergy(dcArrayOutputkWhPerkWp);
		});
		return energy;
	}
}

class ChargeController extends PVInverterCC {
	constructor(batteryChargeCurrent, PVInputs, price) {
		this.batteryChargeCurrent = batteryChargeCurrent;
		super(PVInputs, price);
	}

	getBatteryChargeCurrent() {
		return this.batteryChargeCurrent;
	}

	getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt) {
		return Math.min(super.getUnlimitedEnergy(dcArrayOutputkWhPerkWp), outputVoltage*this.batteryChargeCurrent*dt);
	}
}

class PVInverter extends PVInverterCC {
	constructor(ratedPower, PVInputs, price) {
		this.ratedPower = ratedPower;
		super(PVInputs, price);
	}

	getRatedPower() {
		return this.ratedPower;
	}

	getEnergy(dcArrayOutputkWhPerkWp, dt) {
		return Math.min(super.getUnlimitedEnergy(dcArrayOutputkWhPerkWp), this.ratedPower*dt);
	}
}

class ACDCCoupledEquipmentGroup {
	constructor (equipmentGroup) {
		this.equipmentGroup = equipmentGroup;
	}

	getPrice() {
		var price = 0;
		this.equipmentGroup.forEach(equipment => {
			price+= equipment.getTotalPrice()
		});
		return price;
	}
}

class DCCoupledPVGenerationEquipment extends ACDCCoupledEquipmentGroup {
	constructor(chargeControllers) {
		super(chargeControllers);
	}

	getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt) {
		var energy = 0;
		this.equipmentGroup.forEach(cc => {
			energy+= cc.getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt);
		});
		return energy;
	}
}

class ACCoupledGenerationEquipment extends ACDCCoupledEquipmentGroup {
	constructor(pvInverters) {
		super(pvInverters);
	}

	getEnergy(dcArrayOutputkWhPerkWp, dt) {
		var energy = 0;
		this.equipmentGroup.forEach(inverter => {
			energy+= inverter.getEnergy(dcArrayOutputkWhPerkWp, dt);
		});
		return energy;
	}
}

class Battery {
	constructor(capacity, minSOC, cRate, dRate, price) {
		this.capacity = capacity;
		this.minSOC = minSOC;
		this.cRate = cRate;
		this.dRate = dRate;
		this.price = price;
	}

	getCapacity() {
		return this.capacity;
	}

	getMinSOC() {
		return this.minSOC;
	}

	getCRate() {
		return this.cRate;
	}

	getDRate() {
		return this.dRate;
	}

	getPrice() {
		return this.price;
	}
}

class BatteryBank {
	constructor(batteries, outputVoltage) {
		this.batteries = batteries;
		this.outputVoltage = outputVoltage;
		// TODO: confirm batteries are equivalent

		// NOTE: if batteries not equivalent, this breaks
		this.minSOC = batteries[0].getMinSOC();
		this.cRate = batteries[0].getCRate();
		this.dRate = batteries[0].getDRate();
		
		this.price = 0;
		this.capacity = 0;
		this.batteries.forEach(battery => {
			this.capacity+= battery.getCapacity();
			this.price+= battery.getPrice();
		});
		
		this.energy = this.capacity;
		this.cumE = 0;
	}

	getBatteries() {
		 return this.batteries;
	}

	getOutputVoltage() {
		return this.outputVoltage;
	}

	getMinSOC() {
		return this.minSOC;
	}

	getPrice() {
		return this.price;
	}

	getCapacity() {
		return this.capacity;
	}

	getEnergy() {
		return this.energy;
	}

	getEffectiveEnergy() {
		return this.energy - this.minSOC*this.capacity;
	}

	// TODO: add limits for charging and discharging rates
	getEnergyAvailable(dt) {
		return this.getEffectiveEnergy();
	}

	getSOC() {
		return this.getEnergy()/this.getCapacity();
	}

	canDischarge(energy) {
		return (this.getEnergy()-energy)/this.getCapacity() > this.minSOC;
	}

	canCharge(energy) {
		return (this.getEnergy()+energy) <= this.getCapacity();
	}

	/**
	 * Requests energy from the batteries. Updates SOC and cycles.
	 *
	 * @param {number} energy - The amount of energy requested from the batteries [kWh].
	 * @returns {number} - The amount of energy actually supplied by the batteries, limited by the min SOC
	 */
	requestDischarge(energy) {
		var energySupplied = Math.min(this.getEffectiveEnergy(), energy);

		this.energy-= energySupplied;
		this.cumE+= energySupplied;

		return energySupplied;
	}

	/**
	 * Requests the batteries charge using incoming energy. Updates SOC and cycles.
	 *
	 * @param {number} energy - The amount of energy requested to the batteries [kWh].
	 * @returns {number} - The amount of energy actually used to charge the batteries, limited by the capacity
	 */
	requestCharge(energy) {
		var energySupplied = Math.min(this.getCapacity()-this.getEnergy(), energy);

		this.energy+= energySupplied;
		this.cumE+= energySupplied;

		return energySupplied;
	}
}

class BatteryInverter {
	constructor(ratedPower, inverterEfficiency, chargerEfficiency, price) {
		this.ratedPower = ratedPower;
		this.inverterEfficiency = inverterEfficiency;
		this.chargerEfficiency = chargerEfficiency;
		this.price = price;

		this.batteryBank = null;
	}

	getRatedPower() {
		return this.ratedPower;
	}

	getInverterEfficiency() {
		return this.inverterEfficiency;
	}

	getChargerEfficiency() {
		return this.chargerEfficiency;
	}

	getPrice() {
		return this.price;
	}

	/**
	 * Requests energy from the batteries inverted into AC. Updates SOC and cycles.
	 *
	 * @param {number} ac - The amount of energy requested to the AC bus [kWh].
	 * @param {number} dt - The amount of time to provide the energy [hr]
	 * @returns {number} - The amount of AC actually produced, limited by the power rating and the batteries [kWh]
	 */
	requestAC(ac, dt) {
		if (this.batteryBank === null) {
			throw new Error('Battery inverter needs battery bank to invert.')
		}
		
		// Limit AC ouptut by rated power
		ac = Math.min(ac, this.ratedPower*dt);

		// Amount of DC needed to fulfill the load [kWh]
		var dcNeeded = ac/this.inverterEfficiency;

		// Amount of DC drawn from the batteries [kWh]
		var dcProduced = this.batteryBank.requestDischarge(dcNeeded);

		// Amount of AC actually provided
		return dcProduced*this.inverterEfficiency;
	}

	/**
	 * Requests excess energy to be used to charge the batteries. Updates SOC and cycles.
	 *
	 * @param {number} ac - The amount of AC energy to send to the batteries [kWh].
	 * @param {number} dt - The amount of time to send the energy [hr]
	 * @returns {number} - The amount of DC energy actually stored in the batteries, limited by the power rating and the batteries [kWh]
	 */
	requestChargeBatteries(ac, dt) {
		if (this.batteryBank === null) {
			throw new Error('Battery inverter needs a battery bank to charge.')
		}

		// Limit DC output by rated power
		ac = Math.min(ac, this.ratedPower*dt);

		// Rectify AC into DC
		var dcProduced = ac*this.chargerEfficiency;

		// Charge batteries with DC
		return this.batteryBank.requestCharge(dcProduced);
	}

	connectBatteryBank(batteryBank) {
		this.batteryBank = batteryBank;
	}

	canSupply(energy, time) {
		return energy/time<=this.ratedPower;
	}
}

class DieselGenerator {
	constructor(ratedPower, price) {
		this.ratedPower = ratedPower;
		this.price = price;

		this.runHours = 0;
		this.dieselConsumed = 0;
		this.turnedOn = false;
		this.currentOutput = 0;

		if (this.ratedPower < Math.min(DieselGenerator.genSizeHeaders) || this.ratedPower>Math.max(DieselGenerator.genSizeHeaders)) {
			throw new Error(`Diesel genset power ${this.ratedPower} is outside the range [${Math.min(DieselGenerator.genSizeHeaders),Math.max(DieselGenerator.getSizeHeaders)}].`);
		}
		this.generatorRow = [];
		for (let p=0; p<DieselGenerator.genSizeHeaders.length; p++) {
			if (this.ratedPower === DieselGenerator.genSizeHeaders[p]) {
				this.generatorRow = DieselGenerator.generatorTable[p];
				break;
			} else if (this.ratedPower < DieselGenerator.genSizeHeaders[p+1]) {
				var p_frac = (this.ratedPower-DieselGenerator.genSizeHeaders[p])/(DieselGenerator.genSizeHeaders[p+1]-DieselGenerator.genSizeHeaders[p]);
				for (let l=0; l<DieselGenerator.loadingFracHeaders.length; l++) {
					this.generatorRow.push(DieselGenerator.generatorTable[p,l] + p_frac*(DieselGenerator.generatorTable[p+1,l]-DieselGenerator.generatorTable[p,l]));
				}
				break;
			}
		}
	}

	getRatedPower() {
		return this.ratedPower;
	}

	getPrice() {
		return this.price;
	}

	getRunHours() {
		return this.runHours;
	}

	getDieselConsumed() {
		return this.dieselConsumed;
	}

	getCurrentOutput() {
		return this.currentOutput;
	}

	static get generatorTable() {
		return [
			[0.0,  0.3,  0.5,   0.7,   0.8],
			[0.0,  0.6,  0.9,   1.3,   1.6],
			[0.0,  1.3,  1.8,   2.4,   2.9],
			[0.0,  1.6,  2.3,   3.2,   4.0],
			[0.0,  1.8,  2.9,   3.8,   4.8],
			[0.0,  2.4,  3.4,   4.6,   6.1],
			[0.0,  2.6,  4.1,   5.8,   7.4],
			[0.0,  3.1,  5.0,   7.1,   9.1],
			[0.0,  3.3,  5.4,   7.6,   9.8],
			[0.0,  3.6,  5.9,   8.4,  10.9],
			[0.0,  4.1,  6.8,   9.7,  12.7],
			[0.0,  4.7,  7.7,  11.0,  14.4],
			[0.0,  5.3,  8.8,  12.5,  16.6],
			[0.0,  5.7,  9.5,  13.6,  18.0],
			[0.0,  6.8, 11.3,  16.1,  21.5],
			[0.0,  7.9, 13.1,  18.7,  25.1],
			[0.0,  8.9, 14.9,  21.3,  28.6],
			[0.0, 11.0, 18.5,  26.4,  35.7],
			[0.0, 13.2, 22.0,  31.5,  42.8],
			[0.0, 16.3, 27.4,  39.3,  53.4],
			[0.0, 21.6, 36.4,  52.1,  71.1],
			[0.0, 26.9, 45.3,  65.0,  88.8],
			[0.0, 32.2, 54.3,  77.8, 106.5],
			[0.0, 37.5, 63.2,  90.7, 124.2],
			[0.0, 42.8, 72.2, 103.5, 141.9],
			[0.0, 48.1, 81.1, 116.4, 159.6]
		];
	}

	static get loadingFracHeaders() {
		return [0, 0.25, 0.5, 0.75, 1.0];
	}

	static get genSizeHeaders() {
		return [10, 20, 30, 40, 60, 75, 100, 125, 135, 150, 175, 200, 230, 250, 300, 350, 400, 500, 600, 750, 1000, 125, 1500, 1750, 2000, 2250];
	}

	canSupply(energy, time) {
		return energy/time<=this.ratedPower;
	}

	isOn() {
		return this.turnedOn;
	}
	turnOn() {
		this.turnedOn = true;
	}
	turnOff() {
		this.turnedOn = false;
	}

	/**
	 * Request generator supply power. Updates diesel consumption, run hours, and current output.
	 *
	 * @param {number} power - Amount of power requested from the generator.
	 * @param {number} dt - Amount of time to run.
	 * @returns {number} - Amount of energy supplied during the time frame.
	 */
	supply(power, dt) {
		var loadingFrac = power/this.ratedPower;
		if (loadingFrac > Math.max(DieselGenerator.loadingFracHeaders)) {
			console.warn(`Generator asked to supply ${power}, but can only supply ${this.ratedPower}`);
			power = this.ratedPower;
			loadingFrac = 1.0;
		}

		var galPerHr = undefined;
		for (let l=0; l<DieselGenerator.loadingFracHeaders.length; l++) {
			if (loadingFrac === DieselGenerator.loadingFracHeaders[l]) {
				galPerHr = this.generatorRow[l];
			} else if (loadingFrac < DieselGenerator.loadingFracHeaders[l+1]) {
				var l_frac = (loadingFrac - DieselGenerator.loadingFracHeaders[l]) / (DieselGenerator.loadingFracHeaders[l+1] - DieselGenerator.loadingFracHeaders[l]);
				galPerHr = this.generatorRow[l] + l_frac*(this.generatorRow[l+1] - this.generatorRow[l]);
			}
		}
		var lPerHr = galPerHr*L_PER_GAL;

		this.dieselConsumed+= lPerHr*dt;
		this.runHours+= dt;
		this.currentOutput = power;
		return power*dt;
	}
}

class Customer {
	constructor(loadProfile, tariff, qty) {
		// TODO: check length of loadProfile and tariff
		this.loadProfile = loadProfile;
		if (loadProfile.length === 24) {
			for (let d=1; d<DAYS_PER_YEAR; d++) {
				this.loadProfile = this.loadProfile.concat(loadProfile)
			}
		}

		this.tariff = tariff;
		if (!Array.isArray(this.tariff)) {
			this.tariff = Array(HR_PER_DAY).fill(this.tariff);
		}

		this.qty = qty;
	}

	getYearLoadProfile() {
		return this.loadProfile;
	}

	getYearTotalLoadProfile() {
		return this.loadProfile.map(load => load*this.qty);
	}

	getTariff(t) {
		return this.tariff[t % HR_PER_DAY];
	}

	getQty() {
		return qty;
	}

	getLoad(t) {
		return this.loadProfile[t];
	}

	getTotalLoad(t) {
		return this.loadProfile*this.qty;
	}
}

class GenerationSite {
	/**
	 * All of the equipment at a generation site.
	 *
	 * @param {BatteryInverter} batteryInverter - The total battery inverter.
	 * @param {BatteryBank} batteryBank - The battery bank.
	 * @param {ACCoupledGenerationEquipment} pvInverters - All of the PV inverters and their connected solar panels.
	 * @param {DCCoupledPVGenerationEquipment} chargeControllers - All of the charge controllers and their connected solar panels
	 * @param {Generator} generator - The diesel generator
	 * @param {function(soc: number, t: Date) => boolean} shouldTurnOnGenerator - A function to decide when to turn the generator on given battery SOC and the current time
	 * @param {function(soc: number, t: Date) => boolean} shouldTurnOffGenerator - A function to decide when to turn the generator off given battery SOC and the current time
	 * @constructor
	 */
	constructor(batteryInverter, batteryBank, pvInverters, chargeControllers, generator, shouldTurnGeneratorOn, shouldTurnGeneratorOff) {
		this.batteryInverter = batteryInverter;
		this.batteryBank = batteryBank;
		this.pvInverters = pvInverters;
		this.chargeControllers = chargeControllers;
		this.generator = generator;
		this.shouldTurnGeneratorOn = shouldTurnGeneratorOn;
		this.shouldTurnGeneratorOff = shouldTurnGeneratorOff;
	
		this.batteryInverter.connectBatteryBank(this.batteryBank);
		this.acBus = 0;
	}

	getBatteryInverter() {
		return this.batteryInverter;
	}

	getBatteryBank() {
		return this.batteryBank;
	}

	getPVInverters() {
		return this.PVInverters;
	}

	getChargeControllers() {
		return this.chargeControllers;
	}

	getGenerator() {
		return this.generator;
	}

	/**
	 * Runs the generation site for one unit of time
	 *
	 * @param {Date} t - Current date
	 * @param {number} dt - The amount of time that passes [hr].
	 * @param {number} dcArrayOutputkWhPerkWp - From irradiance data [kWh].
	 * @param {number} load - Total load, including distribution losses [kWh].
	 */
	operate(t, dt, dcArrayOutputkWhPerkWp, load) {
		var wastedSolar = 0;
		var energySentToLoad = 0;

		// Charge the batteries from the charge controllers
		var availableDCFromCCs = this.chargeControllers.getEnergy(dcArrayOutputkWhPerkWp, this.batteryBank.getOutputVoltage(), dt);
		wastedSolar+= availableDCFromCCs - this.batteryBank.requestCharge(availableDCFromCCs);

		// If the generator is on but should be off, turn it off.
		if (this.generator.isOn() && this.shouldTurnGeneratorOff(this.batteryBank.getSOC(), t)) {
			this.generator.turnOff();
		}
		// If the generator is off but should be on, turn it on.
		if (this.generator.isOff() && this.shouldTurnGeneratorOn(this.batteryBank.getSOC(), t)) {
			this.generator.turnOn();
		}
		// If the generator is still on, use it to charge the batteries.
		// Note: this commands the generator to charge the batteries at 100% generator loading fraction.
		if (this.generator.isOn()) {
			this.batteryBank.requestChargeBatteries(this.generator.supply(this.generator.getRatedPower(), dt), dt);
		}

		var availableACFromPVInverters = this.pvInverters.getEnergy(dcArrayOutputkWhPerkWp, dt);
		
		// If the PV inverters can supply the load
		if (load <= availableACFromPVInverters) {
			// Fulfill entire load
			energySentToLoad+= load;

			// Send the excess to the batteries
			var extraACFromPVInverters = load - availableACFromPVInverters;
			var energyStored = this.batteryInverter.requestChargeBatteries(extraACFromPVInverters, dt) + this.batteryBank.requestCharge(availableDCFromCCs);
			wastedSolar+= extraACFromPVInverters - energyStored;	// Note: this counts energy lost due to battery inverter inefficiency as wasted solar. As of now, I don't count losses due to inverting battery DC as wasted energy.

		// If the PV inverters can't supply the load, request the remainder from the batteries
		} else {
			energySentToLoad+= availableACFromPVInverters;
			energySentToLoad+= this.batteryInverter.requestAC(load-energySentToLoad, dt);
		}

		return {
			wastedSolar: wastedSolar,
			energySentToLoad: energySentToLoad
		};
	}
}