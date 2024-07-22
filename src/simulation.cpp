#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>
#include <memory>
#include <iterator>
#include "Customer.cpp"
#include "MiniGrid.cpp"
#include "Panel.cpp"
#include "../include/UserInput.h"

int main() {
	/** Step 1: Get Customer Data ***/

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
	for (size_t ct=0; ct<tariffNames.size(); ct++) {	// ct = "customer type index"
		std::getline(iss, token, ',');
		maxLoads[ct] = std::stod(token);
	}
	iss.clear();
	
	// Get quantities
	std::vector<int> quantities = std::vector<int>(tariffNames.size());
	std::getline(file, line);	// Get third line of file, containing quantities
	iss.str(line);
	std::getline(iss, token, ',');	// Skip "Quantity"
	for (size_t ct=0; ct<tariffNames.size(); ct++) {
		std::getline(iss, token, ',');
		quantities[ct] = std::stoi(token);
	}
	iss.clear();

	// Get default tariffs
	std::vector<double> defaultTariffs = std::vector<double>(tariffNames.size());
	std::getline(file, line);	// Get fourth line of file, containing default tariffs
	iss.str(line);
	std::getline(iss, token, ',');	// Skip "Default Tariff (¤/kWh)"
	for (size_t ct=0; ct<tariffNames.size(); ct++) {
		std::getline(iss, token, ',');
		defaultTariffs[ct] = std::stod(token);
	}
	iss.clear();

	// Read array of customer load profiles
	std::vector<std::vector<double>> loadProfiles = std::vector<std::vector<double>>(tariffNames.size(), std::vector<double>());
	while (std::getline(file, line)) {
		iss.str(line);
		std::getline(iss, token, ',');	// Skip first column, datetime
		for (size_t ct=0; ct<tariffNames.size(); ct++) {
			std::getline(iss, token, ',');
			loadProfiles[ct].push_back(std::stod(token));
		}
		iss.clear();
	}
	file.close();

	// Create customers vector
	std::vector<std::unique_ptr<Customer>> customers = std::vector<std::unique_ptr<Customer>>();
	for (size_t ct=0; ct<tariffNames.size(); ct++) {
		customers.push_back(std::make_unique<Customer>(Customer(tariffNames[ct], maxLoads[ct], Customer::getTariffFn(loadProfiles[ct]), quantities[ct])));
	}

	/** Step 2: Pre-Optimization Initialize Mini-Grid ***/

	// Initialize minigrid
	std::function<double(std::string, double)> tariffFn = [](std::string name, double t) { return 1.0; };
	MiniGrid minigrid = MiniGrid(std::move(customers), tariffFn, 0.1);
	minigrid.placeFromFile(UserInput::PVWATTS_FN);

	// Construct panel
	Panel panel = Panel(UserInput::PANEL_PMP, UserInput::PANEL_VOC, UserInput::PANEL_VMP, UserInput::PANEL_ISC, UserInput::PANEL_IMP, UserInput::PANEL_PRICE);

	// Charge controllers: Assemble panels into PVString
	std::vector<std::unique_ptr<Panel>> ccPanels = std::vector<std::unique_ptr<Panel>>();
	const int panelsPerStringCC = 3;	// TODO: Auto-stringing
	for (size_t p=0; p<panelsPerStringCC; p++) {
		ccPanels.push_back(panel.clone());
	}
	PVString pvString = PVString(std::move(ccPanels));
	
	// Charge controller: assemble strings into subarray
	std::vector<std::unique_ptr<PVString>> pvStrings = std::vector<std::unique_ptr<PVString>>();
	const int stringsPerSubarrayCC = 3;
	for (size_t s=0; s<stringsPerSubarrayCC; s++) {
		pvStrings.push_back(pvString.clone());
	}
	const double arrayLosses = UserInput::ARRAY_LOSSES;
	Subarray subarray = Subarray(std::move(pvStrings), arrayLosses);

	// Charge controller: connect subarray to PV input
	std::vector<std::unique_ptr<PVInput>> pvInputs = std::vector<std::unique_ptr<PVInput>>();
	for (size_t r=0; r<std::size(UserInput::CC_IN_TABLE); r++) {
		PVInput pvInput = PVInput(UserInput::CC_IN_TABLE[r][0], UserInput::CC_IN_TABLE[r][1], UserInput::CC_IN_TABLE[r][2], UserInput::CC_IN_TABLE[r][3], UserInput::CC_IN_TABLE[r][4], UserInput::CC_IN_TABLE[r][5]);
		pvInput.connectSubarray(subarray.clone());
		pvInputs.push_back(std::make_unique<PVInput>(pvInput));
	}

	// PV inverters: assemble panels into string
	std::vector<std::unique_ptr<Panel>> pvinvPanels = std::vector<std::unique_ptr<Panel>>();
	const int panelsPerStringPVInv = 19;	// TODO: Auto-stringing
	for (size_t p=0; p<panelsPerStringPVInv; p++) {
		pvinvPanels.push_back(panel.clone());
	}
	PVString pvinvString = PVString(std::move(pvinvPanels));

	// PV inverters: assemble strings into subarray
	std::vector<std::unique_ptr<PVString>> pvinvStrings = std::vector<std::unique_ptr<PVString>>();
	const int stringsPerSubarrayPVInv = 4;	// TODO: Auto-stringing
	for (size_t s=0; s<stringsPerSubarrayPVInv; s++) {
		pvinvStrings.push_back(pvinvString.clone());
	}
	Subarray pvinvSubarray = Subarray(std::move(pvinvStrings), arrayLosses);

	// PV inverters: connect subarray to PV input
	std::vector<std::unique_ptr<PVInput>> pvinvPVInputs = std::vector<std::unique_ptr<PVInput>>();
	for (size_t r=0; r<std::size(UserInput::PVINV_IN_TABLE); r++) {
		PVInput pvInput = PVInput(UserInput::PVINV_IN_TABLE[r][0], UserInput::PVINV_IN_TABLE[r][1], UserInput::PVINV_IN_TABLE[r][2], UserInput::PVINV_IN_TABLE[r][3], UserInput::PVINV_IN_TABLE[r][4], UserInput::PVINV_IN_TABLE[r][5]);
		pvInput.connectSubarray(pvinvSubarray.clone());
		pvinvPVInputs.push_back(std::make_unique<PVInput>(pvInput));
	} // TODO: add support for multiple PV inputs with auto-stringing

	// Battery inverters
	std::vector<std::unique_ptr<BatteryInverter>> indivBattInvs = std::vector<std::unique_ptr<BatteryInverter>>();
	std::vector<int> battInvMaxQtys = std::vector<int>();
	for (size_t b=0; b<std::size(UserInput::BATT_INV_TABLE); b++) {
		BatteryInverter battInv = BatteryInverter(UserInput::BATT_INV_TABLE[b][0], UserInput::BATT_INV_TABLE[b][1], UserInput::BATT_INV_TABLE[b][2], UserInput::BATT_INV_TABLE[b][3]);
		indivBattInvs.push_back(std::make_unique<BatteryInverter>(battInv));
		battInvMaxQtys.push_back(UserInput::BATT_INV_TABLE[b][4]);
	}
	std::vector<std::unique_ptr<BatteryInverter>> battInvs = std::vector<std::unique_ptr<BatteryInverter>>();
	std::vector<double> battInvSizes = std::vector<double>();
	std::vector<double> battInvPrices = std::vector<double>();
	for (size_t b=0; b<indivBattInvs.size(); b++) {
		for (unsigned int qty=1; qty<=battInvMaxQtys[b]; qty++) {
			BatteryInverter battInv = BatteryInverter(indivBattInvs[b]->getRatedPower()*qty, indivBattInvs[b]->getInverterEfficiency(), indivBattInvs[b]->getChargerEfficiency(), indivBattInvs[b]->getPrice()*qty);
			int i = napps::indexOf(battInvSizes, battInv.getRatedPower());
			if (i == -1) {	// if there is no battery inverter combination of that size yet, add it
				size_t low = 0;
				size_t high = battInvSizes.size();
				
				while (low < high) {
					size_t mid = (low+high)/2;
					if (battInvSizes[mid]<battInv.getRatedPower()) {
						low = mid+1;
					} else {
						high = mid;
					}
				}
				battInvPrices.insert(battInvPrices.begin() + low, battInv.getPrice());
				battInvSizes.insert(battInvSizes.begin() + low, battInv.getRatedPower());
				battInvs.insert(battInvs.begin() + low, std::make_unique<BatteryInverter>(battInv));
			} else {	// if there is already a battery inverter combination of that size, replace if iff cheaper
				if (battInvPrices[i]>battInv.getPrice()) {
					battInvPrices[i] = battInv.getPrice();
					battInvs[i] = std::make_unique<BatteryInverter>(battInv);
				}
			}
		}
	}

	/** Step 3: Optimization Initialize Mini-Grid ***/

	// Charge controllers
	ChargeController cc = ChargeController();

	return 0;
}
/*
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