#include <vector>
#include <memory>
#include <numeric>
#include "Battery.cpp"

class BatteryBank {
	private:
		const std::vector<std::unique_ptr<Battery>> batteries;
		const double outputVoltage;
		const double minSOC;
		const double cRate;
		const double dRate;
		const double price;
		const double capacity;
		double energy;
		double cumE;

	public:
		BatteryBank(std::vector<std::unique_ptr<Battery>> batteries, double outputVoltage) : 
			batteries(batteries),
			outputVoltage(outputVoltage),
			minSOC(batteries[0]->getMinSOC()),
			cRate(batteries[0]->getCRate()),
			dRate(batteries[0]->getDRate()),
			price(std::accumulate(batteries.begin(),batteries.end(), 0.0, [](double sum, const auto& battery) { return sum + battery->getPrice(); })),
			capacity(std::accumulate(batteries.begin(),batteries.end(), 0.0, [](double sum, const auto& battery) { return sum + battery->getCapacity(); })),
			cumE(0) {
			// TODO: confirm batteries are equivalent

			this->energy = this->capacity;
		}

		// Getters
		std::vector<std::unique_ptr<Battery>> getBatteries() const { return batteries; }
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