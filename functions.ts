const L_PER_GAL: number = 4.54609;
const HR_PER_DAY: number = 24;
const DAYS_PER_YR: number = 365;
const LV_VOLTAGE: number = 240;

class Panel {
	#Pmp: number;
	#Voc: number;
	#Vmp: number;
	#Isc: number;
	#Imp: number;
	#price: number;
	
	constructor(Pmp: number, Voc: number, Vmp: number, Isc: number, Imp: number, price: number) {
		this.#Pmp = Pmp;
		this.#Voc = Voc;
		this.#Vmp = Vmp;
		this.#Isc = Isc;
		this.#Imp = Imp;
		this.#price = price;
	}

	copy(): Panel {
		return new Panel(this.#Pmp, this.#Voc, this.#Vmp, this.#Isc, this.#Imp, this.#price);
	}

	get Pmp() { return this.#Pmp; }
	get Voc() { return this.#Voc; }
	get Vmp() { return this.#Vmp; }
	get Isc() { return this.#Isc; }
	get Imp() { return this.#Imp; }
	get price() { return this.#price; }

	getEnergy(dcArrayOutputkWhPerkWp: number): number {
		return dcArrayOutputkWhPerkWp*this.#Pmp;
	}
}

class PVString {
	#panels: Panel[];
	#Pmp: number;
	#Voc: number;
	#Vmp: number;
	#Isc: number;
	#Imp: number;
	#price: number;

	constructor(panels: Panel[]) {
		this.#panels = panels;
		// TODO: check all panels equal
		
		this.#Pmp = 0;
		this.#Voc = 0;
		this.#Vmp = 0;
		this.#price = 0;
		this.#panels.forEach(panel => {
			this.#Pmp+= panel.Pmp;
			this.#Voc+= panel.Voc;
			this.#Vmp+= panel.Vmp;
			this.#price+= panel.price;
		});

		// NOTE: if you allow different panels in one string, this breaks.
		this.#Isc = this.#panels[0].Isc;
		this.#Imp = this.#panels[0].Imp;
	}

	copy(): PVString {
		var copiedPanels: Panel[] = this.#panels.map(panel => panel.copy());
		return new PVString(copiedPanels);
	}

	get panels() { return this.#panels; }
	get Pmp() { return this.#Pmp; }
	get Voc() { return this.#Voc; }
	get Vmp() { return this.#Vmp; }
	get Isc() { return this.#Isc; }
	get Imp() { return this.#Imp; }
	get price() { return this.#price; }
	
	getEnergy(dcArrayOutputkWhPerkWp: number): number {
		var energy: number = 0;
		this.panels.forEach(panel => {
			energy+= panel.getEnergy(dcArrayOutputkWhPerkWp);
		});
		return energy;
	}
}

class Subarray {
	#pvStrings: PVString[];
	#arrayLosses: number;
	#Voc: number;
	#Vmp: number;
	#Pmp: number;
	#Isc: number;
	#Imp: number;
	#price: number;

	constructor(pvStrings: PVString[], arrayLosses: number) {
		this.#pvStrings = pvStrings;
		// TODO: confirm all strings same
		this.#arrayLosses = arrayLosses;

		// NOTE: this breaks if strings have different voltages
		this.#Voc = this.#pvStrings[0].Voc;
		this.#Vmp = this.#pvStrings[0].Vmp;

		this.#Pmp = 0;
		this.#Isc = 0;
		this.#Imp = 0;
		this.#price = 0;
		this.#pvStrings.forEach(pvString => {
			this.#Pmp+= pvString.Pmp;
			this.#Isc+= pvString.Isc;
			this.#Imp+= pvString.Imp;
			this.#price+= pvString.price;
		});
	}

	copy(): Subarray {
		var copiedPVStrings: PVString[] = this.#pvStrings.map(pvString => pvString.copy());
		return new Subarray(copiedPVStrings, this.#arrayLosses);
	}

	get PVStrings() { return this.#pvStrings; }
	get Voc() { return this.#Voc; }
	get Vmp() { return this.#Vmp; }
	get Pmp() { return this.#Pmp; }
	get Isc() { return this.#Isc; }
	get Imp() { return this.#Imp; }
	get price() { return this.#price; }
	
	getEnergy(dcArrayOutputkWhPerkWp: number): number {
		var energy: number = 0;
		this.#pvStrings.forEach(pvString => {
			energy+= pvString.getEnergy(dcArrayOutputkWhPerkWp);
		});
		return energy*(1-this.#arrayLosses);
	}
}

class PVInput {
	#Voc_min: number;
	#Voc_max: number;
	#Vmp_min: number;
	#Vmp_max: number;
	#Isc_max: number;
	#Imp_max: number;
	#PVPowerMax: number;
	#price: number;
	#subarray: Subarray;

	constructor(Voc_min: number, Voc_max: number, Vmp_min: number, Vmp_max: number, Isc_max: number, Imp_max: number, PVPowerMax: number) {
		this.#Voc_min = Voc_min;
		this.#Voc_max = Voc_max;
		this.#Vmp_min = Vmp_min;
		this.#Vmp_max = Vmp_max;
		this.#Isc_max = Isc_max;
		this.#Imp_max = Imp_max;
		this.#PVPowerMax = PVPowerMax;
		this.#price = 0;
	}

	connectSubarray(subarray: Subarray): void {
		this.#subarray = subarray;

		if (this.#subarray.Voc<this.#Voc_min || this.#subarray.Voc>this.#Voc_max) {
			throw new Error(`Subarray Voc ${this.#subarray.Voc} is outside the bounds [${this.#Voc_min},${this.#Voc_max}]`);
		}
		if (this.#subarray.Vmp<this.#Vmp_min || this.#subarray.Vmp>this.#Vmp_max) {
			throw new Error(`Subarray Vmp ${this.#subarray.Vmp} is outside the bounds [${this.#Vmp_min},${this.#Vmp_max}]`);
		}
		if (this.#subarray.Isc>this.#Isc_max) {
			throw new Error(`Subarray Isc ${this.#subarray.Isc} is greater than the charge controller Isc_max ${this.#Isc_max}`);
		}
		if (this.#subarray.Imp>this.#Imp_max) {
			throw new Error(`Subarray Imp ${this.#subarray.Imp} is greater than the charge controller Imp_max ${this.#Imp_max}`);
		}
		if (this.#subarray.Pmp>this.#PVPowerMax) {
			throw new Error(`Subarray Pmp ${this.#subarray.Pmp} is greater than the charge controller PVPowerMax ${this.#PVPowerMax}`);
		}

		this.#price = this.#subarray.price;
	}

	copy(): PVInput {
		var copiedSubarray: Subarray = this.#subarray.copy();
		var copiedPVInput: PVInput = new PVInput(this.#Voc_min, this.#Voc_max, this.#Vmp_min, this.#Vmp_max, this.#Isc_max, this.#Imp_max, this.#PVPowerMax);
		copiedPVInput.connectSubarray(copiedSubarray);
		return copiedPVInput;
	}

	get price() { return this.#price; }

	getEnergy(dcArrayOutputkWhPerkWp: number): number {
		return this.#subarray.getEnergy(dcArrayOutputkWhPerkWp);
	}
}

abstract class PVInverterCC {
	#pvInputs: PVInput[];
	#price: number;
	#subarrayPrice: number;

	/**
	 * A customer archetype and quantity.
	 *
	 * @param {Array<PVInput>} pvInputs - Array of PVInputs of device.
	 * @param {number} price - Price of device.
	 * @constructor
	 */
	constructor(pvInputs: PVInput[], price: number) {
		this.#pvInputs = pvInputs;
		this.#price = price;

		this.#subarrayPrice = 0;
		this.#pvInputs.forEach(pvinput => {
			this.#subarrayPrice+= pvinput.price;
		});
	}

	copy(): PVInverterCC {
		throw new Error('Must implement');
	}

	get PVInputs() { return this.#pvInputs; }
	get price() { return this.#price; }
	get totalPrice() { return this.#subarrayPrice + this.#price; }

	getUnlimitedEnergy(dcArrayOutputkWhPerkWp: number): number {
		var energy: number = 0;
		this.#pvInputs.forEach(pvinput => {
			energy+= pvinput.getEnergy(dcArrayOutputkWhPerkWp);
		});
		return energy;
	}

	getEnergy(dcArrayOutputkWhPerkWp: number, outputVoltage: number, dt: number): number {
		throw new Error('Need to implement.');
	}
}

class ChargeController extends PVInverterCC {
	#batteryChargeCurrent: number;

	constructor(batteryChargeCurrent: number, pvInputs: PVInput[], price: number) {
		super(pvInputs, price);
		this.#batteryChargeCurrent = batteryChargeCurrent;
	}

	copy(): ChargeController {
		var copiedPVInputs: PVInput[] = this.PVInputs.map(pvInput => pvInput.copy());
		return new ChargeController(this.#batteryChargeCurrent, copiedPVInputs, this.price);
	}

	get batteryChargeCurrent() { return this.#batteryChargeCurrent; }

	getEnergy(dcArrayOutputkWhPerkWp: number, outputVoltage: number, dt: number): number {
		return Math.min(super.getUnlimitedEnergy(dcArrayOutputkWhPerkWp), outputVoltage*this.#batteryChargeCurrent*dt);
	}
}

class PVInverter extends PVInverterCC {
	#ratedPower: number;

	constructor(ratedPower: number, pvInputs: PVInput[], price: number) {
		super(pvInputs, price);
		this.#ratedPower = ratedPower;
	}

	copy(): PVInverter {
		var copiedPVInputs: PVInput[] = this.PVInputs.map(pvInput => pvInput.copy());
		return new PVInverter(this.#ratedPower, copiedPVInputs, this.price);
	}

	get ratedPower() { return this.#ratedPower; }

	getEnergy(dcArrayOutputkWhPerkWp: number, outputVoltage: number, dt: number): number {
		return Math.min(super.getUnlimitedEnergy(dcArrayOutputkWhPerkWp), this.#ratedPower*dt);
	}
}

abstract class ACDCCoupledEquipmentGroup {
	#equipmentGroup: PVInverterCC[];

	constructor(equipmentGroup: PVInverterCC[]) {
		this.#equipmentGroup = equipmentGroup;
	}

	copy(): ACDCCoupledEquipmentGroup {
		throw new Error('Must implement');
	}

	get equipmentGroup() { return this.#equipmentGroup; }

	get price(): number {
		var price: number = 0;
		this.#equipmentGroup.forEach(equipment => {
			price+= equipment.totalPrice;
		});
		return price;
	}
}

class DCCoupledPVGenerationEquipment extends ACDCCoupledEquipmentGroup {
	#equipmentGroup: ChargeController[];

	constructor(chargeControllers: ChargeController[]) {
		super(chargeControllers);
	}

	copy(): DCCoupledPVGenerationEquipment {
		var copiedEquipmentGroup: ChargeController[] = this.#equipmentGroup.map(equipment => equipment.copy());
		return new DCCoupledPVGenerationEquipment(copiedEquipmentGroup);
	}

	getEnergy(dcArrayOutputkWhPerkWp: number, outputVoltage: number, dt: number): number {
		var energy: number = 0;
		this.equipmentGroup.forEach((cc: ChargeController) => {
			energy+= cc.getEnergy(dcArrayOutputkWhPerkWp, outputVoltage, dt);
		});
		return energy;
	}
}

class ACCoupledPVGenerationEquipment extends ACDCCoupledEquipmentGroup {
	#equipmentGroup: PVInverter[];

	constructor(pvInverters: PVInverter[]) {
		super(pvInverters);
	}

	copy(): ACCoupledPVGenerationEquipment {
		var copiedEquipmentGroup: PVInverter[] = this.#equipmentGroup.map(equipment => equipment.copy());
		return new ACCoupledPVGenerationEquipment(copiedEquipmentGroup);
	}

	getEnergy(dcArrayOutputkWhPerkWp: number, dt: number): number {
		var energy: number = 0;
		this.equipmentGroup.forEach((inverter: PVInverter) => {
			energy+= inverter.getEnergy(dcArrayOutputkWhPerkWp, LV_VOLTAGE, dt);
		});
		return energy;
	}
}

class Battery {
	#capacity: number;
	#minSOC: number;
	#cRate: number;
	#dRate: number;
	#price: number;

	constructor(capacity: number, minSOC: number, cRate: number, dRate: number, price: number) {
		this.#capacity = capacity;
		this.#minSOC = minSOC;
		this.#cRate = cRate;
		this.#dRate = dRate;
		this.#price = price;
	}

	copy(): Battery {
		return new Battery(this.#capacity, this.#minSOC, this.#cRate, this.#dRate, this.#price);
	}

	get capacity() { return this.#capacity; }
	get minSOC() { return this.#minSOC; }
	get cRate() { return this.#cRate; }
	get dRate() { return this.#dRate; }
	get price() { return this.#price; }
}

class BatteryBank {
	#batteries: Battery[];
	#outputVoltage: number;
	#minSOC: number;
	#cRate: number;
	#dRate: number;
	#price: number;
	#capacity: number;
	#energy: number;
	#cumE: number;

	constructor(batteries: Battery[], outputVoltage: number) {
		this.#batteries = batteries;
		this.#outputVoltage = outputVoltage;
		// TODO: confirm batteries are equivalent

		// NOTE: if batteries not equivalent, this breaks
		this.#minSOC = batteries[0].minSOC;
		this.#cRate = batteries[0].cRate;
		this.#dRate = batteries[0].dRate;
		
		this.#price = 0;
		this.#capacity = 0;
		this.#batteries.forEach(battery => {
			this.#capacity+= battery.capacity;
			this.#price+= battery.price;
		});
		
		this.#energy = this.#capacity;
		this.#cumE = 0;
	}

	get batteries() { return this.#batteries; }
	get outputVoltage() { return this.#outputVoltage; }
	get minSOC() { return this.#minSOC; }
	get price() { return this.#price; }
	get capacity() { return this.#capacity; }
	get energy() { return this.#energy; }
	get effectiveEnergy(): number { return this.#energy - this.#minSOC*this.#capacity; }

	// TODO: add limits for charging and discharging rates
	getEnergyAvailable(dt: number): number {
		return this.effectiveEnergy;
	}

	get soc() { return this.#energy/this.#capacity; }

	canDischarge(energy: number): boolean {
		return (this.#energy-energy)/this.#capacity > this.#minSOC;
	}

	canCharge(energy: number): boolean {
		return (this.#energy+energy) <= this.#capacity;
	}

	/**
	 * Requests energy from the batteries. Updates SOC and cycles.
	 *
	 * @param {number} energy - The amount of energy requested from the batteries [kWh].
	 * @returns {number} - The amount of energy actually supplied by the batteries, limited by the min SOC
	 */
	requestDischarge(energy: number): number {
		var energySupplied: number = Math.min(this.effectiveEnergy, energy);

		this.#energy-= energySupplied;
		this.#cumE+= energySupplied;

		return energySupplied;
	}

	/**
	 * Requests the batteries charge using incoming energy. Updates SOC and cycles.
	 *
	 * @param {number} energy - The amount of energy requested to the batteries [kWh].
	 * @returns {number} - The amount of energy actually used to charge the batteries, limited by the capacity
	 */
	requestCharge(energy: number): number {
		var energySupplied: number = Math.min(this.#capacity-this.#energy, energy);

		this.#energy+= energySupplied;
		this.#cumE+= energySupplied;

		return energySupplied;
	}
}

class BatteryInverter {
	#ratedPower: number;
	#inverterEfficiency: number;
	#chargerEfficiency: number;
	#price: number;
	#batteryBank: BatteryBank;

	constructor(ratedPower: number, inverterEfficiency: number, chargerEfficiency: number, price: number) {
		this.#ratedPower = ratedPower;
		this.#inverterEfficiency = inverterEfficiency;
		this.#chargerEfficiency = chargerEfficiency;
		this.#price = price;
	}

	get ratedPower() { return this.#ratedPower; }
	get inverterEfficiency() { return this.#inverterEfficiency; }
	get chargerEfficiency() { return this.#chargerEfficiency; }
	get price() { return this.#price; }

	/**
	 * Requests energy from the batteries inverted into AC. Updates SOC and cycles.
	 *
	 * @param {number} ac - The amount of energy requested to the AC bus [kWh].
	 * @param {number} dt - The amount of time to provide the energy [hr]
	 * @returns {number} - The amount of AC actually produced, limited by the power rating and the batteries [kWh]
	 */
	requestAC(ac: number, dt: number): number {
		if (!this.#batteryBank) {
			throw new Error('Battery inverter needs battery bank to invert.');
		}
		
		// Limit AC ouptut by rated power
		ac = Math.min(ac, this.ratedPower*dt);

		// Amount of DC needed to fulfill the load [kWh]
		var dcNeeded: number = ac/this.inverterEfficiency;

		// Amount of DC drawn from the batteries [kWh]
		var dcProduced: number = this.#batteryBank.requestDischarge(dcNeeded);

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
	requestChargeBatteries(ac: number, dt: number): number {
		if (!this.#batteryBank) {
			throw new Error('Battery inverter needs a battery bank to charge.');
		}

		// Limit DC output by rated power
		ac = Math.min(ac, this.ratedPower*dt);

		// Rectify AC into DC
		var dcProduced: number = ac*this.chargerEfficiency;

		// Charge batteries with DC
		return this.#batteryBank.requestCharge(dcProduced);
	}

	connectBatteryBank(batteryBank: BatteryBank): void {
		this.#batteryBank = batteryBank;
	}

	canSupply(energy: number, time: number): boolean {
		return energy/time<=this.ratedPower;
	}
}

interface GeneratorResponse {
	energy: number;
	diesel: number;
}

class DieselGenerator {
	#ratedPower: number;
	#price: number;
	#runHours: number;
	#dieselConsumed: number;
	#turnedOn: boolean;
	#currentOutput: number;
	#generatorRow: number[];

	constructor(ratedPower: number, price: number) {
		this.#ratedPower = ratedPower;
		this.#price = price;

		this.#runHours = 0;
		this.#dieselConsumed = 0;
		this.#turnedOn = false;
		this.#currentOutput = 0;

		if (this.#ratedPower < Math.min(...DieselGenerator.genSizeHeaders) || this.#ratedPower>Math.max(...DieselGenerator.genSizeHeaders)) {
			throw new Error(`Diesel genset power ${this.#ratedPower} is outside the range [${Math.min(...DieselGenerator.genSizeHeaders),Math.max(...DieselGenerator.genSizeHeaders)}].`);
		}
		this.#generatorRow = [];
		for (let p: number=0; p<DieselGenerator.genSizeHeaders.length; p++) {
			if (this.#ratedPower === DieselGenerator.genSizeHeaders[p]) {
				this.#generatorRow = DieselGenerator.generatorTable[p];
				break;
			} else if (this.#ratedPower < DieselGenerator.genSizeHeaders[p+1]) {
				var p_frac: number = (this.#ratedPower-DieselGenerator.genSizeHeaders[p])/(DieselGenerator.genSizeHeaders[p+1]-DieselGenerator.genSizeHeaders[p]);
				for (let l: number=0; l<DieselGenerator.loadingFracHeaders.length; l++) {
					this.#generatorRow.push(DieselGenerator.generatorTable[p][l] + p_frac*(DieselGenerator.generatorTable[p+1][l]-DieselGenerator.generatorTable[p][l]));
				}
				break;
			}
		}
	}

	get ratedPower() { return this.#ratedPower; }
	get price() { return this.#price; }
	get runHours() { return this.#runHours; }
	get dieselConsumed() { return this.#dieselConsumed; }
	get currentOutput() { return this.#currentOutput; }

	static get generatorTable(): number[][] {
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

	static get loadingFracHeaders(): number[] {
		return [0, 0.25, 0.5, 0.75, 1.0];
	}

	static get genSizeHeaders(): number[] {
		return [10, 20, 30, 40, 60, 75, 100, 125, 135, 150, 175, 200, 230, 250, 300, 350, 400, 500, 600, 750, 1000, 125, 1500, 1750, 2000, 2250];
	}

	canSupply(energy: number, time: number) {
		return energy/time<=this.ratedPower;
	}

	get isOn(): boolean {
		return this.#turnedOn;
	}

	turnOn(): void {
		this.#turnedOn = true;
	}
	turnOff(): void {
		this.#turnedOn = false;
	}

	/**
	 * Request generator supply power. Updates diesel consumption, run hours, and current output.
	 *
	 * @param {number} power - Amount of power requested from the generator.
	 * @param {number} dt - Amount of time to run.
	 * @returns {Object} - An object with two keys:
	 * - energy {number} Amount of energy supplied during dt.
	 * - diesel {number} Amount of diesel consumed during dt.
	 */
	supply(power: number, dt: number): GeneratorResponse {
		var loadingFrac: number = power/this.ratedPower;
		if (loadingFrac > Math.max(...DieselGenerator.loadingFracHeaders)) {
			console.warn(`Generator asked to supply ${power}, but can only supply ${this.ratedPower}`);
			power = this.ratedPower;
			loadingFrac = 1.0;
		}

		var galPerHr: number = -1;
		for (let l: number=0; l<DieselGenerator.loadingFracHeaders.length; l++) {
			if (loadingFrac === DieselGenerator.loadingFracHeaders[l]) {
				galPerHr = this.#generatorRow[l];
			} else if (loadingFrac < DieselGenerator.loadingFracHeaders[l+1]) {
				var l_frac: number = (loadingFrac - DieselGenerator.loadingFracHeaders[l]) / (DieselGenerator.loadingFracHeaders[l+1] - DieselGenerator.loadingFracHeaders[l]);
				galPerHr = this.#generatorRow[l] + l_frac*(this.#generatorRow[l+1] - this.#generatorRow[l]);
			}
		}
		if (galPerHr === -1) {
			throw new Error(`I wasn't able to compute the amount of diesel consumed per hour.`);
		}
		var lPerHr: number = galPerHr*L_PER_GAL;

		this.#dieselConsumed+= lPerHr*dt;
		this.#runHours+= dt;
		this.#currentOutput = power;
		return {
			energy: power*dt,
			diesel: lPerHr*dt
		};
	}
}

class Customer {
	#name: string;
	#loadProfile: (tariff: number, t: number) => number;
	#qty: number;

	/**
	 * A customer archetype and quantity.
	 *
	 * @param {string} name - Unique name for the class of customer, e.g. "residential" or "commercial"
	 * @param {(tariff: number, t: number) => number} loadProfile - Energy needs of a single customer [kWh/hr] given the tariff and time since commissioning [hr].
	 * @param {number} qty - Quantity of customers of that archetype.
	 * @constructor
	 */
	constructor(name: string, loadProfile: (tariff: number, t: number) => number, qty: number) {
		this.#name = name;
		this.#loadProfile = loadProfile;
		this.#qty = qty;
	}

	get name() { return this.#name; }
	get loadProfile() { return this.#loadProfile; }

	get totalLoadProfile() {
		return (tariff: number, t: number) => this.loadProfile(tariff, t)*this.#qty;
	}

	get qty () { return this.#qty; }

	getLoad(tariff: number, t: number): number {
		return this.#loadProfile(tariff, t);
	}

	getTotalLoad(tariff: number, t: number): number {
		return this.totalLoadProfile(tariff, t);
	}
}

interface GenerationSiteOperationStep {
	availableACFromPVInverters: number;
	availableDCFromCCs: number;
	loadWithDxLosses: number;
	batterySOCkWh: number;
	batterySOC: number;
	totalSolarToLoad: number;
	totalSolarToBattery: number;
	totalBatteryToLoad: number;
	totalEnergyToLoad: number;
	generatorLoad: number;
	generatorFuelConsumption: number;
	remainingLoad: number;
	wastedSolar: number;
}

class GenerationSite {
	#batteryInverter: BatteryInverter;
	#batteryBank: BatteryBank;
	#pvInverters: ACCoupledPVGenerationEquipment;
	#chargeControllers: DCCoupledPVGenerationEquipment;
	#generator: DieselGenerator | null;
	#shouldTurnGeneratorOn: (soc: number, t: number) => boolean;
	#shouldTurnGeneratorOff: (soc: number, t: number) => boolean;
	#acBus: number;

	/**
	 * All of the equipment at a generation site.
	 *
	 * @param {BatteryInverter} batteryInverter - The total battery inverter.
	 * @param {BatteryBank} batteryBank - The battery bank.
	 * @param {ACCoupledPVGenerationEquipment} pvInverters - All of the PV inverters and their connected solar panels.
	 * @param {DCCoupledPVGenerationEquipment} chargeControllers - All of the charge controllers and their connected solar panels
	 * @param {Generator} generator - The diesel generator
	 * @param {function(soc: number, t: number) => boolean} shouldTurnOnGenerator - A function to decide when to turn the generator on given battery SOC and the current time since commissioning [hr]
	 * @param {function(soc: number, t: number) => boolean} shouldTurnOffGenerator - A function to decide when to turn the generator off given battery SOC and the current time since commissioning [hr]
	 * @constructor
	 */
	constructor(
		batteryInverter: BatteryInverter,
		batteryBank: BatteryBank,
		pvInverters: ACCoupledPVGenerationEquipment,
		chargeControllers: DCCoupledPVGenerationEquipment,
		generator: DieselGenerator | null,
		shouldTurnGeneratorOn: (soc: number, t: number) => boolean = (soc: number, t: number) => false,
		shouldTurnGeneratorOff: (soc: number, t: number) => boolean = (soc: number, t: number) => false)
	{
		this.#batteryInverter = batteryInverter;
		this.#batteryBank = batteryBank;
		this.#pvInverters = pvInverters;
		this.#chargeControllers = chargeControllers;
		this.#generator = generator;
		this.#shouldTurnGeneratorOn = shouldTurnGeneratorOn;
		this.#shouldTurnGeneratorOff = shouldTurnGeneratorOff;
	
		this.#batteryInverter.connectBatteryBank(this.#batteryBank);
		this.#acBus = 0;
	}

	get batteryInverter() { return this.#batteryInverter; }
	get batteryBank() { return this.#batteryBank; }
	get pvInverters() { return this.#pvInverters; }
	get chargeControllers () { return this.#chargeControllers; }
	get generator() { return this.#generator; }

	/**
	 * Runs the generation site for one unit of time
	 *
	 * @param {number} t - Time since commissioning [hr]
	 * @param {number} dt - The amount of time that passes [hr].
	 * @param {number} dcArrayOutputkWhPerkWp - From irradiance data [kWh].
	 * @param {number} load - Total load, including distribution losses [kWh].
	 * @returns {Object} - An object with 13 keys:
	 * - availableACFromPVInverters {number} Energy generated by PV inverters [kWh].
	 * - availableDCFromCCs {number} Energy generated by charge controllers [kWh].
	 * - loadWithDxLosses {number} The load, given as an input parameter [kWh].
	 * - batterySOCkWh {number} Amount of energy remaining in the battery bank [kWh].
	 * - batterySOC {number} SOC of the battery bank at the end of dt.
	 * - totalSolarToLoad {number} Energy sent from the PV inverters to the load [kWh].
	 * - totalSolarToBattery {number} Energy sent from the PV to the batteries [kWh].
	 * - totalBatteryToLoad {number} Energy sent from the batteries to the load [kWh].
	 * - totalEnergyToLoad {number} Energy sent from the generation site to the load [kWh].
	 * - generatorLoad {number} Energy supplied by the generator [kWh].
	 * - generatorFuelConsumption {number} Fuel consumed by the generator [L].
	 * - remainingLoad {number} Unmet load [kWh].
	 * - wastedSolar {number} Solar energy not used due to inefficiencies [kWh].
	 */
	operate(t: number, dt: number, dcArrayOutputkWhPerkWp: number, load: number): GenerationSiteOperationStep {
		var wastedSolar: number = 0;
		var energySentToLoad: number = 0;
		var generatorLoad: number = 0;
		var generatorFuelConsumption: number = 0;

		// Charge the batteries from the charge controllers
		var availableDCFromCCs: number = this.chargeControllers.getEnergy(dcArrayOutputkWhPerkWp, this.batteryBank.outputVoltage, dt);
		var ccSolarToBattery: number = this.batteryBank.requestCharge(availableDCFromCCs);
		wastedSolar+= availableDCFromCCs - ccSolarToBattery;

		if (this.generator !== null) {
			// If the generator is on but should be off, turn it off.
			if (this.generator.isOn && this.#shouldTurnGeneratorOff(this.batteryBank.soc, t)) {
				this.generator.turnOff();
			}
			// If the generator is off but should be on, turn it on.
			if (!this.generator.isOn && this.#shouldTurnGeneratorOn(this.batteryBank.soc, t)) {
				this.generator.turnOn();
			}
			// If the generator is still on, use it to charge the batteries.
			// Note: this commands the generator to charge the batteries at 100% generator loading fraction.
			if (this.generator.isOn) {
				let generatorResponse: GeneratorResponse = this.generator.supply(this.generator.ratedPower, dt);
				generatorLoad = generatorResponse.energy;
				generatorFuelConsumption = generatorResponse.diesel;
				this.#batteryInverter.requestChargeBatteries(generatorLoad, dt);
			}
		}

		var availableACFromPVInverters: number = this.pvInverters.getEnergy(dcArrayOutputkWhPerkWp, dt);

		var totalSolarToLoad: number = 0;
		var totalBatteryToLoad: number = 0;
		var totalSolarToBattery: number = ccSolarToBattery;
		
		// If the PV inverters can supply the load
		if (load <= availableACFromPVInverters) {
			// Fulfill entire load
			totalSolarToLoad+= load;
			energySentToLoad+= totalSolarToLoad;

			// Send the excess to the batteries
			var extraACFromPVInverters: number = load - availableACFromPVInverters;
			var energyStored: number = this.batteryInverter.requestChargeBatteries(extraACFromPVInverters, dt);
			totalSolarToBattery+= energyStored;
			wastedSolar+= extraACFromPVInverters - energyStored;	// Note: this counts energy lost due to battery inverter inefficiency as wasted solar. As of now, I don't count losses due to inverting battery DC as wasted energy.

		// If the PV inverters can't supply the load, request the remainder from the batteries
		} else {
			totalSolarToLoad+= availableACFromPVInverters;
			energySentToLoad+= totalSolarToLoad;
			totalBatteryToLoad = this.batteryInverter.requestAC(load-energySentToLoad, dt)
			energySentToLoad+= totalBatteryToLoad;
		}

		return {
			availableACFromPVInverters: availableACFromPVInverters,
			availableDCFromCCs: availableDCFromCCs,
			loadWithDxLosses: load,
			batterySOCkWh: this.batteryBank.energy,
			batterySOC: this.batteryBank.soc,
			totalSolarToLoad: totalSolarToLoad,
			totalSolarToBattery: totalSolarToBattery,
			totalBatteryToLoad: totalBatteryToLoad,
			totalEnergyToLoad: energySentToLoad,
			generatorLoad: generatorLoad,
			generatorFuelConsumption: generatorFuelConsumption,
			remainingLoad: load-energySentToLoad,
			wastedSolar: wastedSolar
		};
	}
}

interface MiniGridOperationStep extends GenerationSiteOperationStep {
	load: number;
	remainingLoadWithDxLosses: number;
	remainingLoad: number;
}

class MiniGrid {
	#customers: Customer[];
	#tariff: (name: string, t: number) => number;
	#dxLosses: number;
	#dcArrayOutputkWhPerkWpFn: (t: number) => number;
	#generationSite: GenerationSite;

	constructor(customers: Customer[], tariff: (name: string, t: number) => number, dxLosses: number) {
		this.#customers = customers;
		this.#tariff = tariff;
		this.#dxLosses = dxLosses;
	}

	place(latitude: number, longitude: number, roofMounted: boolean = false, PVWATTS_API_KEY: string) {
		const url: string = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${PVWATTS_API_KEY}&lat=${latitude}&lon=${longitude}&system_capacity=1&module_type=0&losses=0&array_type=${roofMounted ? 1 : 0}&tilt=10&azimuth=180&timeframe=hourly&dataset=intl`;

		return new Promise((resolve, reject) => {
			const request: XMLHttpRequest = new XMLHttpRequest();
			request.open('GET', url);
			request.onload = () => {
				if (request.status === 200) {
					var dcArrayOutputkWhPerkWpArr: number[] = [...JSON.parse(request.response).outputs.dc];
					this.#dcArrayOutputkWhPerkWpFn = t => dcArrayOutputkWhPerkWpArr[Math.round(t) % (HR_PER_DAY*DAYS_PER_YR)];
					resolve(JSON.parse(request.response));
				} else {
					reject(Error(request.statusText));
				}
			};
			request.onerror = () => {
				reject(Error('Network Error'));
			};
			request.send();
		});
	}

	buildGenerationSite(generationSite) {
		this.#generationSite = generationSite;
	}

	getDCArrayOutputkWhPerkWp(t: number) {
		return this.#dcArrayOutputkWhPerkWpFn(t);
	}

	operate(t: number, dt: number): MiniGridOperationStep {
		var dcArrayOutputkWhPerkWp: number = this.getDCArrayOutputkWhPerkWp(t);

		var load: number = 0;
		this.#customers.forEach(customer => {
			load+= customer.getTotalLoad(this.#tariff(customer.name, t), t);
		});

		var result: GenerationSiteOperationStep = this.#generationSite.operate(t, dt, dcArrayOutputkWhPerkWp, load/(1-this.#dxLosses));
		return {
			availableACFromPVInverters: result.availableACFromPVInverters,
			availableDCFromCCs: result.availableDCFromCCs,
			loadWithDxLosses: result.loadWithDxLosses,
			batterySOCkWh: result.batterySOCkWh,
			batterySOC: result.batterySOC,
			totalSolarToLoad: result.totalSolarToLoad,
			totalSolarToBattery: result.totalSolarToBattery,
			totalBatteryToLoad: result.totalBatteryToLoad,
			totalEnergyToLoad: result.totalEnergyToLoad,
			generatorLoad: result.generatorLoad,
			generatorFuelConsumption: result.generatorFuelConsumption,
			wastedSolar: result.wastedSolar,
			load: load,
			remainingLoadWithDxLosses: result.remainingLoad,
			remainingLoad: load-result.totalEnergyToLoad*(1-this.#dxLosses)
		};
	}
}

/**
 * Simulate mini-grid performance over time.
 *
 * @param {number} t - The total amount of time to simulate [hr].
 * @param {number} dt - The time interval between simulation steps [hr].
 * @param {number} latitude - The latitude of the generation site.
 * @param {number} longitude - The longitude of the generation site.
 */
async function simulate(t: number, dt: number, latitude: number, longitude: number, PVWATTS_API_KEY: string, panelsPerStringCC: number, stringsPerSubarrayCC: number, numChargeControllers: number, numBatteries: number) {
	var genericCustomer: Customer = new Customer(
		'generic',
		t => 30,
		2
	);
	var customers: Customer[] = [genericCustomer];

	var minigrid: MiniGrid = new MiniGrid(customers, (name, t) => 1, 0.1);

	await minigrid.place(latitude, longitude, false, PVWATTS_API_KEY);

	var jkm445m: Panel = new Panel(0.445, 49.07, 41.17, 11.46, 10.81, 445*0.2630);
	var panels: Panel[] = [];
	for (let p: number =0; p<panelsPerStringCC; p++) {
		panels.push(jkm445m.copy());
	}

	var pvString: PVString = new PVString(panels);
	var pvStrings: PVString[] = [];
	for (let s: number =0; s<stringsPerSubarrayCC; s++) {
		pvStrings.push(pvString.copy());
	}

	var subarray:Subarray = new Subarray(pvStrings, 0.1);
	var pvInput: PVInput = new PVInput(60, 245, 60, 245, 70, 70, 4.9);
	pvInput.connectSubarray(subarray);

	var cc: ChargeController = new ChargeController(85, [pvInput], 588.88);
	var ccs: ChargeController[] = [];
	for (let c: number =0; c<numChargeControllers; c++) {
		ccs.push(cc.copy());
	}

	var ccGroup: DCCoupledPVGenerationEquipment = new DCCoupledPVGenerationEquipment(ccs);

	var pvInvGroup: ACCoupledPVGenerationEquipment = new ACCoupledPVGenerationEquipment([]);

	var smd143: Battery = new Battery(14.3, 0.1, 0, 0, 1000);
	var batteries: Battery[] = [];
	for (let b: number =0; b<numBatteries; b++) {
		batteries.push(smd143.copy());
	}

	var batteryBank: BatteryBank = new BatteryBank(batteries, 48);

	var batteryInv: BatteryInverter = new BatteryInverter(15, .95, .95, 1000);

	var site: GenerationSite = new GenerationSite(batteryInv, batteryBank, pvInvGroup, ccGroup, null);
	minigrid.buildGenerationSite(site);
	
	for (let t: number =0; t<12; t++){
		console.log(minigrid.operate(t, 1));
	}
}

interface Credentials {
	PVWATTS_API_KEY: string;
}

interface RadioOption {
	label: string;
	value: string;
}

interface Question {
	label: string;
	key: string;
	type: string;
	default: string | number;
	options: Array<RadioOption>;
}

interface FormSection {
	header: string;
	key: string;
	questions: Array<Question>;
}

async function run() {
	// Get credentials
	var creds: Credentials;
	const credFileInput = document.getElementById('cred-file');
	if (!credFileInput || !(credFileInput instanceof HTMLInputElement))
  		throw Error('Could not retrieve file input element');
	const fr = new FileReader();
	fr.onload = (e: Event) => {
		const contents: string = fr.result as string;
		creds = JSON.parse(contents);
	};
	fr.readAsText(credFileInput.files[0]);

	// Load form
	const formEl = document.getElementById('form-from-json');

	// TODO: Extract data from form

	// TODO: Pick battery inverter and genset to be barely big enough to handle load

	// TODO: Optimization loop
		// For each combination of decision variables
			// TODO: Simulate

			// TODO: Create BOQ

			// TODO: Compute IRR
		// Move in the direction of steepest IRR ascent
}

document.getElementById('run').addEventListener('click', run)