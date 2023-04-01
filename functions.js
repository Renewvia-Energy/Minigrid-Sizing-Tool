const L_PER_GAL = 4.54609;

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

	getPower(DCArrayOutputWPerkWp) {
		return DCArrayOutputWPerkWp*this.Pmp;
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

	getPower(DCArrayOutputWPerkWp) {
		var power = 0;
		this.panels.forEach(panel => {
			power+= panel.getPower(DCArrayOutputWPerkWp);
		});
		return power;
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

	getPower(DCArrayOutputWPerkWp) {
		var power = 0;
		this.strings.forEach(string => {
			power+= string.getPower(DCArrayOutputWPerkWp);
		});
		return power*(1-this.arrayLosses);
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

	getPower(DCArrayOutputWPerkWp) {
		return this.subarray.getPower(DCArrayOutputWPerkWp);
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

	getUnlimitedPower(DCArrayOutputWPerkWp) {
		var power = 0;
		this.PVInputs.forEach(pvinput => {
			power+= pvinput.getPower(DCArrayOutputWPerkWp);
		});
		return power;
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

	getPower(DCArrayOutputWPerkWp, outputVoltage) {
		return Math.min(super.getUnlimitedPower(DCArrayOutputWPerkWp), outputVoltage*this.batteryChargeCurrent);
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

	getPower(DCArrayOutputWPerkWp) {
		return Math.min(super.getUnlimitedPower(), this.ratedPower);
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

	getPower(DCArrayOutputWPerkWp, outputVoltage) {
		var power = 0;
		this.equipmentGroup.forEach(cc => {
			power+= cc.getPower(DCArrayOutputWPerkWp, outputVoltage);
		});
		return power;
	}
}

class ACCoupledGenerationEquipment extends ACDCCoupledEquipmentGroup {
	constructor(pvInverters) {
		super(pvInverters);
	}

	getPower(DCArrayOutputWPerkWp) {
		var power = 0;
		this.equipmentGroup.forEach(inverter => {
			power+= inverter.getPower(DCArrayOutputWPerkWp);
		});
		return power;
	}
}

class Battery {
	constructor(capacity, minSOC, price) {
		this.capacity = capacity;
		this.minSOC = minSOC;
		this.price = price;
	}

	getCapacity() {
		return this.capacity;
	}

	getMinSOC() {
		return this.minSOC;
	}

	getPrice() {
		return this.price;
	}
}

class BatteryBank {
	constructor(batteries) {
		this.batteries = batteries;
		// TODO: confirm batteries have equivalent SOC

		// NOTE: if minSOC different, this breaks
		this.minSOC = batteries[0].getMinSOC();
		
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

	getSOC() {
		return this.getEnergy()/this.getCapacity();
	}

	canDischarge(energy) {
		return (this.getEnergy()-energy)/this.getCapacity();
	}

	discharge(energy) {
		this.energy-= energy;
		this.cumE+= Math.abs(energy)/2;
	}
}

class BatteryInverter {
	constructor(ratedPower, price) {
		this.ratedPower = ratedPower;
		this.price = price;
	}

	getRatedPower() {
		return this.ratedPower;
	}

	getPrice() {
		return this.price;
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

	supply(power, time) {
		var loadingFrac = power/self.ratedPower;
		if (loadingFrac > Math.max(DieselGenerator.loadingFracHeaders)) {
			console.warn(`Generator asked to supply ${power}, but can only supply ${self.ratedPower}`);
			power = self.ratedPower;
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

		self.dieselConsumed+= lPerHr*time;
		self.runHours+= time;
		return power;
	}
}

class GenerationSite {
	constructor(batteryInverter, batteryBank, pvInverters, chargeControllers)
}