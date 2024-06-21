#include <vector>
#include <cassert>
#include "PVInverterCC.h"

class PVInverter : public PVInverterCC {
	private:
		double ratedPower;

	public:
		/**
		 * An AC-coupled power generation device.
		 * 
		 * @param {number} ratedPower - The maximum output power of the device.
		 * @param {number} maxPVPower - The maximum Pmp of all solar panels connected to the device.
		 * @param {PVInput[]} pvInputs - Array of PV inputs of the device. Each PV input should be connected to a single subarray. 
		 * @param {number} price - The unit price of the device. 
		 */
		PVInverter(double ratedPower, double maxPVPower, std::vector<PVInput> pvInputs, double price) : PVInverterCC(pvInputs, maxPVPower, price), ratedPower(ratedPower) {}

		PVInverter* copy() const override {
			std::vector<PVInput> copiedPVInputs;
			copiedPVInputs.reserve(getPVInputs().size());
			for (const auto& pvInput : getPVInputs()) {
				copiedPVInputs.push_back(pvInput.copy());
			}
			return new PVInverter(ratedPower, getMaxPVPower(), copiedPVInputs, getPrice());
		}

		// Getters
		double getRatedPower() const { return ratedPower; }

		/**
		 * Energy generated by the subarrays connected to the device.
		 * 
		 * @param {number} dcArrayOutputWhPerWp - Amount of energy [Wh] a 1-Wp panel could output during the time interval.
		 * @param {number} outputVoltage - The AC voltage of the distribution network. This input is not actually used by this method.
		 * @param {number} dt - The time interval [hr]
		 * @returns {number} Amount of energy [Wh] output by the device over the time interval.
		 */
		double getEnergy(double dcArrayOutputWhPerWp, double outputVoltage, double dt) const override {
			double energy = std::min(getUnlimitedEnergy(dcArrayOutputWhPerWp), ratedPower*dt);
			std::string errorMsg = "Energy produced by PV inverter " + std::to_string(energy) + " must be >=0.\nRated power=" + std::to_string(ratedPower) + "\ndt=" + std::to_string(dt) + "\nEnergy generated by connected PV=" + std::to_string(getUnlimitedEnergy(dcArrayOutputWhPerWp));
			assert(energy>=0 && errorMsg.c_str());
			return energy;
		}
};