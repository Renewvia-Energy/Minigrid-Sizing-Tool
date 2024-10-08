#ifndef BATTERYINVERTER_CPP
#define BATTERYINVERTER_CPP

#include <memory>
#include <string>
#include "BatteryBank.cpp"

class BatteryInverter {
	private:
		const double ratedPower;
		const double inverterEfficiency;
		const double chargerEfficiency;
		const double price;
		std::shared_ptr<BatteryBank> batteryBank;

	public:
		BatteryInverter(double ratedPower, double inverterEfficiency, double chargerEfficiency, double price) : ratedPower(ratedPower), inverterEfficiency(inverterEfficiency), chargerEfficiency(chargerEfficiency), price(price) {}

		std::unique_ptr<BatteryInverter> cloneWithoutBatteries() {
			return std::make_unique<BatteryInverter>(this->ratedPower, this->inverterEfficiency, this->chargerEfficiency, this->price);
		}

		// Getters
		double getRatedPower() const { return ratedPower; }
		double getInverterEfficiency() const { return inverterEfficiency; }
		double getChargerEfficiency() const { return chargerEfficiency; }
		double getPrice() const { return price; }

		/**
		 * Requests energy from the batteries inverted into AC. Updates SOC and cycles.
		 *
		 * @param ac The amount of energy requested to the AC bus [Wh].
		 * @param dt The amount of time to provide the energy [hr]
		 * @returns The amount of AC actually produced, limited by the power rating and the batteries [Wh]
		 */
		double requestAC(double ac, double dt) {
			if (!batteryBank) {
				throw std::runtime_error("Battery inverter needs battery bank to invert.");
			}
			
			// Limit AC ouptut by rated power
			ac = std::min(ac, ratedPower * dt);

			// Amount of DC needed to fulfill the load [Wh]
			double dcNeeded = ac / inverterEfficiency;

			// Amount of DC drawn from the batteries [Wh]
			double dcProduced = batteryBank->requestDischarge(dcNeeded, dt);

			// Amount of AC actually provided
			return dcProduced * inverterEfficiency;
		}

		/**
		 * Requests excess energy to be used to charge the batteries. Updates SOC and cycles.
		 *
		 * @param ac The amount of AC energy to send to the batteries [Wh].
		 * @param dt The amount of time to send the energy [hr]
		 * @returns The amount of DC energy actually stored in the batteries, limited by the power rating and the batteries [Wh]
		 */
		double requestChargeBatteries(double ac, double dt) {
			if (!batteryBank) {
				throw std::runtime_error("Battery inverter needs a battery bank to charge.");
			}

			// Limit DC output by rated power
			ac = std::min(ac, ratedPower * dt);

			// Rectify AC into DC
			double dcProduced = ac * chargerEfficiency;

			// Charge batteries with DC
			return batteryBank->requestCharge(dcProduced, dt);
		}

		/**
		 * Sets the battery bank for the inverter.
		 *
		 * @param batteryBank The shared pointer to the BatteryBank object to connect.
		 *
		 * @return None
		 *
		 * @throws None
		 */
		void connectBatteryBank(std::shared_ptr<BatteryBank> batteryBank) {
			this->batteryBank = batteryBank;
		}

		/**
		 * Checks if the BatteryInverter can supply a given amount of energy within a given time.
		 *
		 * @param energy The amount of energy to supply [Wh].
		 * @param time The time within which the energy should be supplied [hr].
		 *
		 * @return true if the BatteryInverter can supply the given amount of energy within the given time, false otherwise.
		 */
		bool canSupply(double energy, double time) {
			return energy/time<=ratedPower;
		}
		
		std::string to_string() {
			return std::to_string(ratedPower) + "-VA battery inverter costing " + std::to_string(price);
		}
};

#endif // BATTERYINVERTER_CPP