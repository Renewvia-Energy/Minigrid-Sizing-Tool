#ifndef PVINVERTERCC_H
#define PVINVERTERCC_H

#include <vector>
#include <memory>
#include <numeric>
#include "../include/Napps.h"
#include "PVInput.cpp"

class PVInverterCC : public napps::Cloneable<PVInverterCC> {
	private:
		const std::vector<std::unique_ptr<PVInput>> pvInputs;
		const double maxPVPower;
		const double price;
		const double subarrayPrice;

	protected:
    	virtual PVInverterCC* cloneImpl() const = 0;

	public:
		/**
		 * A customer archetype and quantity.
		 *
		 * @param pvInputs Array of PVInputs of device.
		 * @param maxPVPower Maximum PV generator power [Wp].
		 * @param price Price of device [¤].
		 * @constructor
		 */
		PVInverterCC(std::vector<std::unique_ptr<PVInput>> pvInputs, double maxPVPower, double price) : 
			pvInputs(std::move(pvInputs)),
			maxPVPower(maxPVPower),
			price(price),
			subarrayPrice(std::accumulate(pvInputs.begin(),pvInputs.end(), 0.0, [](double sum, const auto& pvInput) { return sum + pvInput->getPrice(); })) {
			double Pmp = 0;
			for (const auto& pvInput : pvInputs) {
				Pmp+= pvInput->getPmp();
			}
			if (Pmp>maxPVPower) {
				throw std::runtime_error("Too much PV input power connected. " + std::to_string(Pmp) + ">" + std::to_string(maxPVPower));
			}
		}

		// Destructor
		virtual ~PVInverterCC() = default;

		// Copy assignment operator
		PVInverterCC& operator=(const PVInverterCC& other) = delete;

		// Copy constructor is just virtual copy method
		std::unique_ptr<PVInverterCC> clone() {
			return std::unique_ptr<PVInverterCC>(cloneImpl());
		}
		
		// Getters
		const std::vector<std::unique_ptr<PVInput>>& getPVInputs() const { return pvInputs; }
		double getMaxPVPower() const { return maxPVPower; }
		double getPrice() const { return price; }
		double totalPrice() const { return subarrayPrice + price; }

		/**
		 * The amount of energy [Wh] that could be generated by the attached PV if the PVInverterCC had no output power limit.
		 * 
		 * @param dcArrayOutputWhPerWp Amount of energy [Wh] a 1-Wp panel could output during the time interval.
		 * @returns the total amount of energy [Wh] that could be generated by the attached PV if the PVInverterCC had no output power limit.
		 */
		double getUnlimitedEnergy(double dcArrayOutputWhPerWp) const {
			double energy = std::accumulate(pvInputs.begin(), pvInputs.end(), 0.0, [dcArrayOutputWhPerWp](double sum, const std::unique_ptr<PVInput>& pvInput) {
				return sum + pvInput->getEnergy(dcArrayOutputWhPerWp);
			});
			assert(energy>=0 && "Energy generated by panel should be nonnegative.");
			return energy;
		}

		/**
		 * Energy [Wh] generated by the subarray connected to this PV inverter. In the abstract class, this will throw an error. This method must be implemented in the subclass.
		 * 
		 * @param dcArrayOutputWhPerWp Amount of energy [Wh] a 1-Wp panel could output during the time interval.
		 * @param outputVoltage The voltage of the output of the PV inverter or charge controller. For a PV inverter, this will be the VAC of LV in the country of operation. For a charge controller, this will be the DCV of the powerhouse.
		 * @param dt The time interval [hr]
		 * @returns Energy [Wh] generated by the subarray connected to this PV inverter. In the abstract class, this will throw an error. This method must be implemented in the subclass.
		 * @throws An error if called. You must re-implement this in the subclass.
		 */
		virtual double getEnergy(double dcArrayOutputWhPerWp, double outputVoltage, double dt) const = 0;
};

#endif // PVINVERTERCC_H