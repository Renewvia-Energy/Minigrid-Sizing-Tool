#ifndef BATTERYBANK_CPP
#define BATTERYBANK_CPP

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
		/**
		 * Constructor for creating a BatteryBank object.
		 *
		 * @param batteries A vector of unique pointers to Battery objects.
		 * @param outputVoltage The output voltage of the battery bank.		 *
		 * 
		 * @throws None
		 */
		BatteryBank(std::vector<std::unique_ptr<Battery>> batteries, double outputVoltage) : 
			batteries(std::move(batteries)),
			outputVoltage(outputVoltage),
			minSOC(this->batteries[0]->getMinSOC()),
			cRate(this->batteries[0]->getCRate()),
			dRate(this->batteries[0]->getDRate()),
			price(std::accumulate(this->batteries.begin(),this->batteries.end(), 0.0, [](double sum, const auto& battery) { return sum + battery->getPrice(); })),
			capacity(std::accumulate(this->batteries.begin(),this->batteries.end(), 0.0, [](double sum, const auto& battery) { return sum + battery->getCapacity(); })),
			cumE(0) {
			// TODO: confirm batteries are equivalent

			this->energy = this->capacity;
		}

		// Getters
		const std::vector<std::unique_ptr<Battery>>& getBatteries() const { return batteries; }
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

		/**
		 * Determines if the battery bank can discharge the specified amount of energy.
		 *
		 * @param energy The amount of energy to discharge [Wh].
		 *
		 * @return true if the battery bank can discharge the energy, false otherwise.
		 *
		 * @throws None
		 */
		bool canDischarge(double energy) {
			return (this->energy-energy)/this->capacity > this->minSOC;
		}

		/**
		 * Determines if the battery bank can charge with the given amount of energy.
		 *
		 * @param energy The amount of energy to charge the battery bank [Wh].
		 *
		 * @return true if the battery bank can charge with the given amount of energy, false otherwise.
		 */
		bool canCharge(double energy) {
			return capacity+energy <= capacity;
		}

		/**
		 * Requests energy from the batteries. Updates SOC and cycles.
		 *
		 * @param energy The amount of energy requested from the batteries [Wh].
		 * @returns The amount of energy actually supplied by the batteries, limited by the min SOC
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
		 * @param energy The amount of energy requested to the batteries [Wh].
		 * @returns The amount of energy actually used to charge the batteries, limited by the capacity
		 */
		double requestCharge(double energy, double dt) {
			double energySupplied = std::min(capacity-this->energy, energy);

			this->energy+= energySupplied;
			this->cumE+= energySupplied;

			return energySupplied;
		}
};

#endif // BATTERYBANK_CPP