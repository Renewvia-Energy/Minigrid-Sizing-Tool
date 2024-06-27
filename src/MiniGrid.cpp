#include <vector>
#include <functional>
#include <string>
#include <fstream>
#include <sstream>
#include "GenerationSite.cpp"
#include "Customer.cpp"

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
		const std::function<double(double)> dcArrayOutputWhPerWpFn;
		const std::unique_ptr<GenerationSite> generationSite;

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

			dcArrayOutputWhPerWpFn = [this, dcArrayOutputWhPerWpArr](double t) {
				return dcArrayOutputWhPerWpArr[std::round(t) % (HR_PER_DAY * DAYS_PER_YR)];
			};
		}

	public:
		MiniGrid(std::vector<std::unique_ptr<Customer>> customers, std::function<double(std::string, double)> tariff, double dxLosses, double latitude, double longitude, bool roofMounted = false, std::string PVWATTS_API_KEY) : customers(customers), tariff(tariff), dxLosses(dxLosses) {
			const std::string url = "https://developer.nrel.gov/api/pvwatts/v8.json?api_key=" + PVWATTS_API_KEY + "&lat=" + std::to_string(latitude) + "&lon=" + std::to_string(longitude) + "&system_capacity=1&module_type=0&losses=0&array_type=" + (roofMounted ? "1" : "0") + "&tilt=10&azimuth=180&timeframe=hourly&dataset=intl";


		}

	place(latitude: number, longitude: number, roofMounted: boolean = false, PVWATTS_API_KEY: string) {
		const url: string = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${PVWATTS_API_KEY}&lat=${latitude}&lon=${longitude}&system_capacity=1&module_type=0&losses=0&array_type=${roofMounted ? 1 : 0}&tilt=10&azimuth=180&timeframe=hourly&dataset=intl`

		return new Promise((resolve, reject) => {
			const request: XMLHttpRequest = new XMLHttpRequest()
			request.open('GET', url)
			request.onload = () => {
				if (request.status === 200) {
					var dcArrayOutputWhPerkWpArr: number[] = [...JSON.parse(request.response).outputs.dc]
					var dcArrayOutputWhPerWpArr: number[] = dcArrayOutputWhPerkWpArr.map(dcArrayOutputWhPerkWp => dcArrayOutputWhPerkWp/1000)
					this.#dcArrayOutputWhPerWpFn = t => dcArrayOutputWhPerWpArr[Math.round(t) % (HR_PER_DAY*DAYS_PER_YR)]
					resolve(JSON.parse(request.response))
				} else {
					reject(Error(request.statusText))
				}
			}
			request.onerror = () => {
				reject(Error('Network Error'))
			}
			request.send()
		})
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