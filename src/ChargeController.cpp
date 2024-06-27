#include <vector>
#include "PVInverterCC.h"

class ChargeController : public PVInverterCC {
	private:
		const double batteryChargeCurrent;

	public:
		/**
		 * A DC-coupled power generation device.
		 * 
		 * @param {number} batteryChargeCurrent - The maximum output current of the device.
		 * @param {number} maxPVPower - The maximum Pmp of all solar panels connected to the device.
		 * @param {PVInput[]} pvInputs - Array of PV inputs of the device. Each PV input should be connected to a single subarray. 
		 * @param {number} price - The unit price of the device. 
		 */
		ChargeController(double batteryChargeCurrent, double maxPVPower, std::vector<std::unique_ptr<PVInput>> pvInputs, double price) : PVInverterCC(pvInputs, maxPVPower, price), batteryChargeCurrent(batteryChargeCurrent) {}

		std::unique_ptr<PVInverterCC> copy() const override {
			std::vector<std::unique_ptr<PVInput>> copiedPVInputs;
			copiedPVInputs.reserve(getPVInputs().size());
			for (const auto& pvInput : getPVInputs()) {
				copiedPVInputs.push_back(std::make_unique<PVInput>(pvInput->copy()));
			}
			return std::make_unique<ChargeController>(ChargeController(batteryChargeCurrent, getMaxPVPower(), copiedPVInputs, getPrice()));
		}

		// Getters
		double getBatteryChargeCurrent() const { return batteryChargeCurrent; }

		/**
		 * Energy generated by the subarrays connected to the device.
		 * 
		 * @param {number} dcArrayOutputWhPerWp - Amount of energy [Wh] a 1-Wp panel could output during the time interval.
		 * @param {number} outputVoltage - The DCV of the powerhouse.
		 * @param {number} dt - The time interval [hr]
		 * @returns {number} Amount of energy [Wh] output by the device over the time interval.
		 */
		double getEnergy(double dcArrayOutputWhPerWp, double outputVoltage, double dt) const override {
			double energy = std::min(getUnlimitedEnergy(dcArrayOutputWhPerWp), outputVoltage*batteryChargeCurrent*dt);
			assert(energy>=0 && "Energy produced by CC must be >=0.");
			return energy;
		}
};