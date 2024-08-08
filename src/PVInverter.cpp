#ifndef PVINVERTER_CPP
#define PVINVERTER_CPP

#include <vector>
#include <cassert>
#include "../include/Napps.h"
#include "PVInverterCC.h"

class PVInverter : public PVInverterCC {
	private:
		const double ratedPower;

	protected:
		PVInverter* cloneImpl() const override {
			return new PVInverter(*this);
		}

	public:
		/**
		 * An AC-coupled power generation device.
		 * 
		 * @param ratedPower The maximum output power of the device.
		 * @param maxPVPower The maximum Pmp of all solar panels connected to the device.
		 * @param pvInputs Array of PV inputs of the device. Each PV input should be connected to a single subarray. 
		 * @param price The unit price of the device. 
		 */
		PVInverter(double ratedPower, double maxPVPower, std::vector<std::unique_ptr<PVInput>> pvInputs, double price) : PVInverterCC(std::move(pvInputs), maxPVPower, price), ratedPower(ratedPower) {}

		// Destructor
		~PVInverter() override = default;

		// Copy constructor
		PVInverter(const PVInverter& other)
			: PVInverterCC(
			  	napps::copy_unique_ptr_vector(other.getPVInputs()),
				other.getMaxPVPower(), other.getPrice()),
			  ratedPower(other.getRatedPower()) {}

		// Copy assignment operator
		PVInverter& operator=(const PVInverter& other) = delete;

		// Move constructor
		PVInverter(PVInverter&& other) = default;

		// Move assignment operator
		PVInverter& operator=(PVInverter&& other) = delete;

		// Getters
		double getRatedPower() const { return ratedPower; }

		/**
		 * Energy generated by the subarrays connected to the device.
		 * 
		 * @param dcArrayOutputWhPerWp Amount of energy [Wh] a 1-Wp panel could output during the time interval.
		 * @param outputVoltage The AC voltage of the distribution network. This input is not actually used by this method.
		 * @param dt The time interval [hr]
		 * @returns Amount of energy [Wh] output by the device over the time interval.
		 */
		double getEnergy(double dcArrayOutputWhPerWp, double outputVoltage, double dt) const override {
			double energy = std::min(getUnlimitedEnergy(dcArrayOutputWhPerWp), ratedPower*dt);
			assert(energy>=0 && ("Energy produced by PV inverter " + std::to_string(energy) + " must be >=0.\nRated power=" + std::to_string(ratedPower) + "\ndt=" + std::to_string(dt) + "\nEnergy generated by connected PV=" + std::to_string(getUnlimitedEnergy(dcArrayOutputWhPerWp))).c_str());
			return energy;
		}
};

#endif // PVINVERTER_CPP