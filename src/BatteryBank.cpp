#include <vector>
#include "Battery.cpp"

class BatteryBank {
	private:
		std::vector<Battery> batteries;
		double outputVoltage;
		double minSOC;
		double cRate;
		double dRate;
		double price;
		double capacity;
		double energy;
		double cumE;

	public:
		BatteryBank(std::vector<Battery> batteries, double outputVoltage) : batteries(batteries), outputVoltage(outputVoltage), minSOC(batteries[0].getMinSOC()), cRate(batteries[0].getCRate()), dRate(batteries[0].getDRate()), price(0), capacity(0), cumE(0) {
			// TODO: confirm batteries are equivalent
			for (const auto& battery : batteries) {
				this->capacity+= battery.getCapacity();
				this->price+= battery.getPrice();
			}

			this->energy = this->capacity;
		}

		// Getters
		std::vector<Battery> getBatteries() const { return batteries; }
		double getOutputVoltage() const { return outputVoltage; }
		double getMinSOC() const { return minSOC; }
		double getPrice() const { return price; }
		double getCapacity() const { return capacity; }
		double getEnergy() const { return energy; }
		double effectiveEnergy() const { return energy - minSOC*capacity; }
		double soc() { return energy/capacity; }

		// TODO: add limits for charging and discharging rates
		double getEnergyAvailable(double dt) const {
			return effectiveEnergy();
		}

		bool canDischarge(double energy) {
			return (this->energy-energy)/this->capacity > this->minSOC;
		}

		bool canCharge(double energy) {
			return capacity+energy <= capacity;
		}

		/**
		 * Requests energy from the batteries. Updates SOC and cycles.
		 *
		 * @param {number} energy - The amount of energy requested from the batteries [Wh].
		 * @returns {number} - The amount of energy actually supplied by the batteries, limited by the min SOC
		 */
		double requestDischarge(double energy, double dt) {
			double energySupplied = std::min(getEnergyAvailable(dt), energy);

			this->energy-= energySupplied;
			this->cumE+= energySupplied;

			return energySupplied;
		}

		/**
		 * Requests the batteries charge using incoming energy. Updates SOC and cycles.
		 *
		 * @param {number} energy - The amount of energy requested to the batteries [Wh].
		 * @returns {number} - The amount of energy actually used to charge the batteries, limited by the capacity
		 */
		double requestCharge(double energy, double dt) {
			double energySupplied = std::min(capacity-this->energy, energy);

			this->energy+= energySupplied;
			this->cumE+= energySupplied;

			return energySupplied;
		}
};