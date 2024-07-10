#include <vector>
#include <functional>
#include <string>
#include <fstream>
#include <sstream>
#include <cmath>
#include "GenerationSite.cpp"
#include "Customer.cpp"
#include "../include/Constants.h"

struct MiniGridOperationStep : GenerationSiteOperationStep {
	double load;
	double remainingLoadWithDxLosses;
	double remainingLoad;
}

class MiniGrid {
	private:
		static const int FIRST_DATA_ROW = 32;	// Index of the first data row in the PVWatts CSV, should be the first row after "Month	Day	Hour,Beam Irradiance (W/m2),Diffuse Irradiance (W/m2),Ambient Temperature (C),Wind Speed (m/s),Albedo,Plane of Array Irradiance (W/m2),Cell Temperature (C),DC Array Output (W),AC System Output (W)"
		static const int DC_OUTPUT_DATA_COLUMN = 10;	// Index of the "DC Array Output (W)" column in the PVWatts CSV

		const std::vector<std::unique_ptr<Customer>> customers;
		const std::function<double(std::string, double)> tariff;
		const double dxLosses;
		std::function<double(double)> dcArrayOutputWhPerWpFn;
		std::unique_ptr<GenerationSite> generationSite;

		static std::function<double(double)> getDCArrayOutputWhPerWpFn(const std::string& filename) {
			std::ifstream file(filename);
			if (!file.is_open()) {
				throw std::runtime_error("Could not open file: " + filename);
			}

			std::vector<double> dcArrayOutputWhPerWpArr;
			std::string line;
			
			// Skip the header if there is one
			for (int l=0; l<FIRST_DATA_ROW; l++) {
				std::getline(file, line);
			}

			while (std::getline(file, line)) {
				std::istringstream iss(line);
				std::string token;
				
				// Assuming the DC output is in the second column
				// Adjust the column index if it's different in your CSV
				int column = 0;
				while (std::getline(iss, token, ',')) {
					if (column == 1) {  // 0-indexed, so 1 is the second column
						try {
							double value = std::stod(token) / 1000.0;  // Convert kW to W
							dcArrayOutputWhPerWpArr.push_back(value);
						} catch (const std::exception& e) {
							throw std::runtime_error("Error parsing value: " + token);
						}
						break;
					}
					column++;
				}
			}

			if (dcArrayOutputWhPerWpArr.empty()) {
				throw std::runtime_error("No data was read from the file");
			}

			return [dcArrayOutputWhPerWpArr](double t) {
				return dcArrayOutputWhPerWpArr[static_cast<int>(std::round(t)) % (Global::HR_PER_DAY * Global::DAY_PER_YR)];
			};
		}

	public:
		MiniGrid(std::vector<std::unique_ptr<Customer>> customers, std::function<double(std::string, double)> tariff, double dxLosses, std::string filename) : customers(customers), tariff(tariff), dxLosses(dxLosses) {}

		void placeFromFile(std::string filename) {
			dcArrayOutputWhPerWpFn = getDCArrayOutputWhPerWpFn(filename);
		}

	buildGenerationSite(generationSite) {
		this.#generationSite = generationSite
	}

	getDCArrayOutputWhPerkWp(t: number) {
		return this.#dcArrayOutputWhPerWpFn(t)
	}

	operate(t: number, dt: number): MiniGridOperationStep {
		var dcArrayOutputWhPerWp: number = this.getDCArrayOutputWhPerkWp(t)

		var load: number = 0
		this.#customers.forEach(customer => {
			load+= customer.getTotalLoad(this.#tariff(customer.name, t), t)
		})

		var result: GenerationSiteOperationStep = this.#generationSite.operate(t, dt, dcArrayOutputWhPerWp, load/(1-this.#dxLosses))
		return {
			availableACFromPVInverters: result.availableACFromPVInverters,
			availableDCFromCCs: result.availableDCFromCCs,
			loadWithDxLosses: result.loadWithDxLosses,
			batterySOCWhStart: result.batterySOCWhStart,
			batterySOCStart: result.batterySOCStart,
			batterySOCWhEnd: result.batterySOCWhEnd,
			batterySOCEnd: result.batterySOCEnd,
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
		}
	}
}