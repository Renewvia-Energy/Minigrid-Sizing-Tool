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
	constexpr double CC_IN_TABLE[1][6] = {{60, 245, 60, 245, 70, 70}};
}

#endif // USERINPUT_H