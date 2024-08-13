#ifndef USERINPUT_H
#define USERINPUT_H

#include<string>

namespace UserInput
{
	const std::string CUSTOMERS_FN = "../customers.csv";
	const std::string PVWATTS_FN = "../pvwatts_hourly.csv";
	const double PANEL_PMP = 325;
	const double PANEL_VOC = 46.7;
	const double PANEL_VMP = 37.6;
	const double PANEL_ISC = 9.1;
	const double PANEL_IMP = 8.66;
	const double PANEL_PRICE = 0.4*PANEL_PMP;
	const double ARRAY_LOSSES = 0.1;
	constexpr double CC_IN_TABLE[1][9] = {{60, 245, 60, 245, 70, 70, 85, 588.88, 4900}};	// Voc_min, Voc_max, Vmp_min, Vmp_max, Isc_max, Imp_max, batt_charge_i, price, pv_power_max
	constexpr double PVINV_IN_TABLE[1][9] = {{580, 1000, 580, 850, 71.6, 47.7, 39.1, 4713.75, 37800}};
	constexpr double BATT_INV_TABLE[1][5] = {{5000, 0.95, 0.95, 1, 3}};
	constexpr size_t NUM_CHARGE_CONTROLLERS = 1;
	constexpr size_t NUM_PV_INVERTERS = 1;
	constexpr size_t NUM_BATTERIES = 1;
	const double BATT_CAPACITY = 14300;
	const double BATT_MIN_SOC = 0.1;
	const double BATT_C_RATE = 1;
	const double BATT_D_RATE = 1;
	const double BATT_PRICE = 6000;
	const double DCV = 48;
	const double FOS_MAX_LOAD = 2;
	const double DX_LOSSES = 0.15;
}

#endif // USERINPUT_H