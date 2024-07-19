#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>
#include <memory>
#include "Customer.cpp"
#include "MiniGrid.cpp"
#include "../include/UserInput.h"

int main() {
	/**
	 * Step 1: Get Customer Data
	 */

	// Open file
	std::ifstream file(UserInput::CUSTOMERS_FN);
	if (!file.is_open()) {
		throw std::runtime_error("Could not open file: " + UserInput::CUSTOMERS_FN);
	}
	
	// Declare iss and token
	std::istringstream iss;
	std::string token;

	// Get tariff names
	std::vector<std::string> tariffNames = std::vector<std::string>();
	std::string line;
	std::getline(file, line);	// Get first header line containing the names of the tariffs
	iss.str(line);	// Initialize input string stream with first header line
	std::getline(iss, token, ',');	// Skip "Name"
	while (std::getline(iss, token, ',')) {	// Collect tariff names in array
		tariffNames.push_back(token);
	}
	iss.clear();

	// Get max loads
	std::vector<double> maxLoads = std::vector<double>(tariffNames.size());
	std::getline(file, line);	// Get second line of file, containing max loads
	iss.str(line);
	std::getline(iss, token, ',');	// Skip "Max Load (W)"
	for (int ct=0; ct<tariffNames.size(); ct++) {	// ct = "customer type index"
		std::getline(iss, token, ',');
		maxLoads[ct] = std::stod(token);
	}
	iss.clear();
	
	// Get quantities
	std::vector<int> quantities = std::vector<int>(tariffNames.size());
	std::getline(file, line);	// Get third line of file, containing quantities
	iss.str(line);
	std::getline(iss, token, ',');	// Skip "Quantity"
	for (int ct=0; ct<tariffNames.size(); ct++) {
		std::getline(iss, token, ',');
		quantities[ct] = std::stoi(token);
	}
	iss.clear();

	// Get default tariffs
	std::vector<double> defaultTariffs = std::vector<double>(tariffNames.size());
	std::getline(file, line);	// Get fourth line of file, containing default tariffs
	iss.str(line);
	std::getline(iss, token, ',');	// Skip "Default Tariff (¤/kWh)"
	for (int ct=0; ct<tariffNames.size(); ct++) {
		std::getline(iss, token, ',');
		defaultTariffs[ct] = std::stod(token);
	}
	iss.clear();

	// Read array of customer load profiles
	std::vector<std::vector<double>> loadProfiles = std::vector<std::vector<double>>(tariffNames.size(), std::vector<double>());
	while (std::getline(file, line)) {
		iss.str(line);
		std::getline(iss, token, ',');	// Skip first column, datetime
		for (int ct=0; ct<tariffNames.size(); ct++) {
			std::getline(iss, token, ',');
			loadProfiles[ct].push_back(std::stod(token));
		}
		iss.clear();
	}
	file.close();

	// Create customers vector
	std::vector<std::unique_ptr<Customer>> customers = std::vector<std::unique_ptr<Customer>>();
	for (int ct=0; ct<tariffNames.size(); ct++) {
		customers.push_back(std::make_unique<Customer>(Customer(tariffNames[ct], maxLoads[ct], Customer::getTariffFn(loadProfiles[ct]), quantities[ct])));
	}

	/**
	 * Step 2: Initialize Mini-Grid
	 */
	std::function<double(std::string, double)> tariffFn = [](std::string name, double t) { return 1.0; };
	MiniGrid minigrid = MiniGrid(std::move(customers), tariffFn, 0.1);
	minigrid.placeFromFile(UserInput::PVWATTS_FN);
	
	std::cout << std::to_string(minigrid.getDCArrayOutputWhPerWp(0)) << std::endl;
	std::cout << std::to_string(minigrid.getDCArrayOutputWhPerWp(10)) << std::endl;
	std::cout << std::to_string(minigrid.getDCArrayOutputWhPerWp(12)) << std::endl;
}

	/*
	// Initialize Mini-Grid
	const latitude = Number((<HTMLInputElement>document.getElementById('location_lat')).value)	// [°N]
	const longitude = Number((<HTMLInputElement>document.getElementById('location_lon')).value)	// [°E]
	var minigrid: MiniGrid = new MiniGrid(customers, (name, t) => 1, 0.1)
	await minigrid.place(latitude, longitude, false, creds.PVWATTS_API_KEY)

	// Construct panel
	const pvPmp = Number((<HTMLInputElement>document.getElementById('pv_Pmp')).value)	// [Wp]
	var panel: Panel = new Panel(
		pvPmp,
		Number((<HTMLInputElement>document.getElementById('pv_Voc')).value),
		Number((<HTMLInputElement>document.getElementById('pv_Vmp')).value),
		Number((<HTMLInputElement>document.getElementById('pv_Isc')).value),
		Number((<HTMLInputElement>document.getElementById('pv_Imp')).value),
		pvPmp*Number((<HTMLInputElement>document.getElementById('pv_price')).value))

	// Charge controller: assemble panels into string
	var ccPanels: Panel[] = []
	const panelsPerStringCC = 3 // TODO: autostringing
	for (let p: number =0; p<panelsPerStringCC; p++) {
		ccPanels.push(panel.copy())
	}

	// Charge controller: assemble strings into subarray
	var pvString: PVString = new PVString(ccPanels)
	var ccStrings: PVString[] = []
	const stringsPerSubarrayCC = 3 // TODO: autostringing
	for (let s: number =0; s<stringsPerSubarrayCC; s++) {
		ccStrings.push(pvString.copy())
	}
	const arrayLosses = Number((<HTMLInputElement>document.getElementById('overview_array-losses')).value)/100	//[0-1]
	var ccSubarray: Subarray = new Subarray(ccStrings, arrayLosses)

	// Charge controller: connect subarray to PV input
	var ccPVInputs: PVInput[] = []
	const ccInTable = <HTMLTableElement>document.getElementById('ccs_charge-controller-inputs')
	for (let r=1; r<ccInTable.rows.length-1; r++) {
		const cells = ccInTable.rows.item(r).cells
		ccPVInputs.push(new PVInput(
			Number(cells[1].innerHTML),	// [V]
			Number(cells[2].innerHTML),	// [V]
			Number(cells[3].innerHTML),	// [V]
			Number(cells[4].innerHTML),	// [V]
			Number(cells[5].innerHTML),	// [A]
			Number(cells[6].innerHTML)	// [A]
		))
	}
	ccPVInputs[0].connectSubarray(ccSubarray)// TODO: add support for multiple PV inputs. Needs auto stringing

	// PV inverters: assemble panels into string
	var pvinvPanels: Panel[] = []
	const panelsPerStringPVInv = 19 // TODO: autostringing
	for (let p: number =0; p<panelsPerStringPVInv; p++) {
		pvinvPanels.push(panel.copy())
	}

	// PV inverters: assemble strings into subarray
	pvString = new PVString(pvinvPanels)
	var pvinvStrings: PVString[] = []
	const stringsPerSubarrayPVInv = 4 // TODO: autostringing
	for (let s: number =0; s<stringsPerSubarrayPVInv; s++) {
		pvinvStrings.push(pvString.copy())
	}
	var pvinvSubarray: Subarray = new Subarray(pvinvStrings, arrayLosses)

	// PV inverters: connect subarray to PV input
	var pvinvPVInputs: PVInput[] = []
	const pvinvInTable = <HTMLTableElement> document.getElementById('pvinv_pv-inverter-inputs')
	for (let r=1; r<pvinvInTable.rows.length-1; r++) {
		const cells = pvinvInTable.rows.item(r).cells
		pvinvPVInputs.push(new PVInput(
			Number(cells[1].innerHTML),	// [V]
			Number(cells[2].innerHTML),	// [V]
			Number(cells[3].innerHTML),	// [V]
			Number(cells[4].innerHTML),	// [V]
			Number(cells[5].innerHTML),	// [A]
			Number(cells[6].innerHTML)	// [A]
		))
	}
	pvinvPVInputs[0].connectSubarray(pvinvSubarray)// TODO: add support for multiple PV inputs. Needs auto stringing

	// Battery inverters
	var indivBattInvs: BatteryInverter[] = []
	var battInvMaxQtys: number[] = []
	const battInvTable = <HTMLTableElement> document.getElementById('batt-inv_options')
	for (let r=1; r<battInvTable.rows.length-1; r++) {
		const cells = battInvTable.rows.item(r).cells
		indivBattInvs.push(new BatteryInverter(
			Number(cells[3].innerHTML),	// [W]
			Number(cells[5].innerHTML)/100,	// [0-1]
			Number(cells[4].innerHTML)/100,	// [0-1]
			Number(cells[2].innerHTML)	// [$]
		))
		battInvMaxQtys.push(Number(cells[6].innerHTML))
	}
	var battInvs: BatteryInverter[] = []
	var battInvSizes: number[] = []
	var battInvPrices: number[] = []
	for (let b=0; b<indivBattInvs.length; b++) {
		for (let qty=1; qty<=battInvMaxQtys[b]; qty++) {
			let battInv = new BatteryInverter(
				indivBattInvs[b].ratedPower*qty,	// [W]
				indivBattInvs[b].inverterEfficiency,	// [0-1]
				indivBattInvs[b].chargerEfficiency,	// [0-1]
				indivBattInvs[b].price*qty	// [$]
			)
			let i = battInvSizes.indexOf(battInv.ratedPower)
			if (i == -1) {	// if there is no battery inverter combination of that size yet, add it
				let low = 0
				let high = battInvSizes.length

				while (low < high) {
					let mid = (low + high) >>> 1;
					if (battInvSizes[mid] < battInv.ratedPower) low = mid + 1;
					else high = mid;
				}
				battInvs.splice(low, 0, battInv)
				battInvPrices.splice(low, 0, battInv.price)
				battInvSizes.splice(low, 0, battInv.ratedPower)
			} else {	// if there is already a battery inverter combination of that size, replace it iff cheaper
				if (battInvPrices[i]>battInv.price) {
					battInvs[i] = battInv
					battInvPrices[i] = battInv.price
				}
			}
		}
	}

	// Other constants from form
	const ccBatteryChargeCurrent = Number((<HTMLInputElement>document.getElementById('ccs_max-output-current')).value)	// [A]
	const ccMaxPVPower = Number((<HTMLInputElement>document.getElementById('ccs_max-pv-power')).value)	// [Wp]
	const ccPrice = Number((<HTMLInputElement>document.getElementById('ccs_price')).value)	// [$]
	const vac = Number((<HTMLInputElement>document.getElementById('overview_vac')).value)	// [V]
	const pvinvRatedPower = Number((<HTMLInputElement>document.getElementById('pvinv_max-output-power')).value)		// [VA]
	const pvinvMaxPVPower = Number((<HTMLInputElement>document.getElementById('pvinv_max-pv-power')).value)	// [Wp]
	const pvinvPrice = Number((<HTMLInputElement>document.getElementById('pvinv_price')).value)	// [$]
	const battCapacity = Number((<HTMLInputElement>document.getElementById('batt_capacity')).value)*1000	// [Wh]
	const minSOC = Number((<HTMLInputElement>document.getElementById('batt_minSOC')).value)/100	// [0-1]
	const cRate = Number((<HTMLInputElement>document.getElementById('batt_c-rate')).value)	// [C]
	const battPrice = Number((<HTMLInputElement>document.getElementById('batt_price')).value)	// [$]
	const battDCV = Number((<HTMLInputElement>document.getElementById('batt_dcv')).value)	// [V]
	const dxLosses = Number((<HTMLInputElement>document.getElementById('dx_losses')).value)/100	// [0-1]
	const exchangeRate = Number((<HTMLInputElement>document.getElementById('misc_toUSD')).value)	// [¤/$]
	const vat = Number((<HTMLInputElement>document.getElementById('misc_vat')).value)/100	// [0-1]

	// Assemble decision variables
	var decisionVariables = {
		numChargeControllers: { value: 1, step: 1 },
		numPVInverters: { value: 1, step: 1 },
		numBatteries: { value: 1, step: 1 }
	}
	for (let c=0; c<customers.length; c++) {
		decisionVariables[`tariff${c}`] = defaultTariffs[c]
	}
	console.timeEnd('setup')
	console.time('opt')
	while (true) {
		// Construct charge controllers
		var cc: ChargeController = new ChargeController(ccBatteryChargeCurrent, ccMaxPVPower, ccPVInputs, ccPrice)
		var ccs: ChargeController[] = []
		for (let c=0; c<decisionVariables.numChargeControllers.value; c++) {
			ccs.push(cc.copy())
		}
		var ccGroup: DCCoupledPVGenerationEquipment = new DCCoupledPVGenerationEquipment(ccs)

		// Construct PV inverters
		var pvinv: PVInverter = new PVInverter(pvinvRatedPower, pvinvMaxPVPower, pvinvPVInputs, pvinvPrice)
		var pvInvs: PVInverter[] = []
		for (let p=0; p<decisionVariables.numPVInverters.value; p++) {
			pvInvs.push(pvinv.copy())
		}
		var pvInvGroup: ACCoupledPVGenerationEquipment = new ACCoupledPVGenerationEquipment(pvInvs)

		// Construct battery bank
		var batt = new Battery(battCapacity, minSOC, cRate, cRate, battPrice)
		var batteries: Battery[] = []
		for (let b=0; b<decisionVariables.numBatteries.value; b++) {
			batteries.push(batt.copy())
		}
		var batteryBank: BatteryBank = new BatteryBank(batteries, battDCV)

		// Pick battery inverter to handle max load
		var maxLoad = customers.reduce((sum, customer) => customer.totalMaxLoad + sum, 0)/(1-dxLosses)*FOS_MAX_LOAD
		var battInv: BatteryInverter
		for (let newBattInv of battInvs) {
			if (newBattInv.ratedPower>=maxLoad) {
				battInv = newBattInv
				break
			}
		}
		if (typeof battInv === 'undefined') {
			throw new Error('No battery inverter is big enough')
		}

		// TODO: Genset optimization

		// Build generation site
		var site: GenerationSite = new GenerationSite(battInv, batteryBank, pvInvGroup, ccGroup, null, null, null, vac)
		minigrid.buildGenerationSite(site)

		// TODO: Simulate
		for (let t=0; t<HR_PER_DAY*DAYS_PER_YR; t++){
			minigrid.operate(t, 1)
		}

		// TODO: Create BOQ
		var boq = new Budget(exchangeRate, vat)
		boq.addLineItem('Batteries', 'Customs', 'Clearing Agent Fees', 'Spedag', '', 'NGN', 1, 27400, true)
		// XXX: HERE

		// TODO: Compute IRR

		// Move in the direction of steepest IRR ascent

		break	// TODO: remove. I just added this so it wouldn't hang during testing.
	}
	console.timeEnd('opt')
}
	return 0;
}
*/