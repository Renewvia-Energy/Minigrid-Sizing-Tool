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

	canSupply(energy, time) {
		return energy/time<=this.ratedPower;
	}

	supply(energy, time) {
		var power = energy/time;
	}
}

class GenerationSite {
	constructor(batteryInverter, batteryBank, pvInverters, chargeControllers)
}