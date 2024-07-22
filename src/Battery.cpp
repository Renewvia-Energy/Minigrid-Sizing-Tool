#ifndef BATTERY_CPP
#define BATTERY_CPP

#include <cassert>
#include <string>

class Battery {
	private:
		const double capacity;
		const double minSOC;
		const double cRate;
		const double dRate;
		const double price;
	
	public:
		/**
		 * One battery, to be connected into a battery bank.
		 * 
		 * @param capacity Total battery energy storage capacity [Wh]
		 * @param minSOC Minimum acceptable state of charge [0-1]
		 * @param cRate Minimum complete charge time in hours
		 * @param dRate Minimum complete discharge time in hours
		 * @param price Unit cost of battery, exclusive of shipping, clearing, labor, etc. [$]
		 *
		 * @throws Assertion error if minSOC is not between 0 and 1
		 */
		Battery(double capacity, double minSOC, double cRate, double dRate, double price) : capacity(capacity), minSOC(minSOC), cRate(cRate), dRate(dRate), price(price) {
			assert(minSOC>=0 && minSOC<=1 && ("MinSOC " + std::to_string(minSOC) + " must be between 0 and 1.").c_str());
		}

		Battery clone() const {
			return *this;
		}

		// Getters
		double getCapacity() const { return capacity; }
		double getMinSOC() const { return minSOC; }
		double getCRate() const { return cRate; }
		double getDRate() const { return dRate; }
		double getPrice() const { return price; }
};

#endif // BATTERY_CPP