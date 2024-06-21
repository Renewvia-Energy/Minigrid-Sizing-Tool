#include <cassert>
#include <string>

class Battery {
	private:
		double capacity;
		double minSOC;
		double cRate;
		double dRate;
		double price;
	
	public:
		/**
		 * One battery, to be connected into a battery bank.
		 * 
		 * @param {number} capacity - Total battery energy storage capacity [Wh]
		 * @param {number} minSOC - Minimum acceptable state of charge [0-1]
		 * @param {number} cRate - Minimum complete charge time in hours
		 * @param {number} dRate - Minimum complete discharge time in hours
		 * @param {number} price - Unit cost of battery, exclusive of shipping, clearing, labor, etc. [$]
		 */
		Battery(double capacity, double minSOC, double cRate, double dRate, double price) : capacity(capacity), minSOC(minSOC), cRate(cRate), dRate(dRate), price(price) {
			std::string errorMsg = "MinSOC " + std::to_string(minSOC) + " must be between 0 and 1.";
			assert(minSOC>=0 && minSOC<=1 && errorMsg.c_str());
		}

		Battery copy() const {
			return *this;
		}

		// Getters
		double getCapacity() const { return capacity; }
		double getMinSOC() const { return minSOC; }
		double getCRate() const { return cRate; }
		double getDRate() const { return dRate; }
		double getPrice() const { return price; }
};