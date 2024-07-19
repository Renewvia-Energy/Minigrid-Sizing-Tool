#ifndef MINIGRID_CPP
#define MINIGRID_CPP

#include <vector>
#include <functional>
#include <string>
#include <fstream>
#include <sstream>
#include <cmath>
#include "GenerationSite.cpp"
#include "Customer.cpp"
#include "../include/Constants.h"
#include "../include/UserInput.h"

struct MiniGridOperationStep : public GenerationSiteOperationStep {
	double load;
	double remainingLoadWithDxLosses;
	double remainingLoad;
};

class MiniGrid {
	private:
		static const int FIRST_DATA_ROW = 32;	// Index of the first data row in the PVWatts CSV, should be the first row after "Month	Day	Hour,Beam Irradiance (W/m2),Diffuse Irradiance (W/m2),Ambient Temperature (C),Wind Speed (m/s),Albedo,Plane of Array Irradiance (W/m2),Cell Temperature (C),DC Array Output (W),AC System Output (W)"
		static const int DC_OUTPUT_DATA_COLUMN = 10;	// Index of the "DC Array Output (W)" column in the PVWatts CSV

		std::vector<std::unique_ptr<Customer>> customers;
		const std::function<double(std::string, double)> tariff;
		const double dxLosses;
		std::function<double(double)> dcArrayOutputWhPerWpFn;
		std::unique_ptr<GenerationSite> generationSite;

		static std::function<double(double)> getDCArrayOutputWhPerWpFn(const std::string& filename) {
			// Open file
			std::ifstream file(filename);
			if (!file.is_open()) {
				throw std::runtime_error("Could not open file: " + filename);
			}

			std::vector<double> dcArrayOutputWhPerWpArr;
			std::string line;
			
			// Skip the header
			for (int l=0; l<FIRST_DATA_ROW; l++) {
				std::getline(file, line);
			}

			std::istringstream iss;
			std::string token;
			while (std::getline(file, line)) {
				iss.str(line);
				
				// Skip to DC output column
				for (int c=0; c<=DC_OUTPUT_DATA_COLUMN; c++) {
					std::getline(iss, token, ',');
				}
				try {
					double value = std::stod(token.substr(1, token.length()-2)) / 1000.0;  // Remove quotes and convert kW to W
					dcArrayOutputWhPerWpArr.push_back(value);
				} catch (const std::exception& e) {
					throw std::runtime_error("Error parsing value: " + token);
				}

				iss.clear();
			}
			file.close();

			if (dcArrayOutputWhPerWpArr.empty()) {
				throw std::runtime_error("No data was read from the file");
			}

			return [dcArrayOutputWhPerWpArr](double t) {
				return dcArrayOutputWhPerWpArr[static_cast<int>(std::round(t)) % (Global::HR_PER_DAY * Global::DAY_PER_YR)];
			};
		}

	public:
		MiniGrid(std::vector<std::unique_ptr<Customer>> customers, std::function<double(std::string, double)> tariff, double dxLosses)
			: customers(std::move(customers)), tariff(tariff), dxLosses(dxLosses) {}

		void placeFromFile(std::string filename) {
			dcArrayOutputWhPerWpFn = getDCArrayOutputWhPerWpFn(filename);
		}

		void buildGenerationSite(std::unique_ptr<GenerationSite> generationSite) {
			this->generationSite = std::move(generationSite);
		}

		double getDCArrayOutputWhPerWp(double t) const { return dcArrayOutputWhPerWpFn(t); }

		MiniGridOperationStep operate(double t, double dt) {
			const double dcOutputWhPerWp = getDCArrayOutputWhPerWp(t);

			const double loadNow = std::accumulate(customers.begin(), customers.end(), 0.0, [&](double sum, const auto& customer) {
				return sum + customer->getTotalLoad(tariff(customer->getName(), t), t);
			});

			const GenerationSiteOperationStep result = generationSite->operate(t, dt, dcOutputWhPerWp, loadNow/(1-dxLosses));

			MiniGridOperationStep step;
			step.load = loadNow;
			step.remainingLoadWithDxLosses = result.remainingLoad;
			step.remainingLoad = loadNow - result.totalEnergyToLoad * (1 - dxLosses);
			step.availableACFromPVInverters = result.availableACFromPVInverters;
			step.availableDCFromCCs = result.availableDCFromCCs;
			step.loadWithDxLosses = result.loadWithDxLosses;
			step.batterySOCWhStart = result.batterySOCWhStart;
			step.batterySOCStart = result.batterySOCStart;
			step.batterySOCWhEnd = result.batterySOCWhEnd;
			step.batterySOCEnd = result.batterySOCEnd;
			step.totalSolarToLoad = result.totalSolarToLoad;
			step.totalSolarToBattery = result.totalSolarToBattery;
			step.totalBatteryToLoad = result.totalBatteryToLoad;
			step.totalEnergyToLoad = result.totalEnergyToLoad;
			step.generatorLoad = result.generatorLoad;
			step.generatorFuelConsumption = result.generatorFuelConsumption;
			step.wastedSolar = result.wastedSolar;
			
			return step;
		}
};

#endif // MINIGRID_CPP