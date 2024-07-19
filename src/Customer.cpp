#ifndef CUSTOMER_CPP
#define CUSTOMER_CPP

#include <string>
#include <functional>

class Customer {
	private:
		const std::string name;
		const double maxLoad;
		const std::function<double(double, double)> loadProfile;	// (tariff: number, t: number) => number; Energy needs of a single customer [Wh/hr] given the tariff and time since commissioning [hr].
		const int qty;

	public:
		/**
		 * A customer archetype and quantity.
		 *
		 * @param {string} name - Unique name for the class of customer, e.g. "residential" or "commercial"
		 * @param {number} maxLoad - Maximum instantaneous load of a single customer [W]
		 * @param {(tariff: number, t: number) => number} loadProfile - Energy needs of a single customer [Wh/hr] given the tariff and time since commissioning [hr].
		 * @param {number} qty - Quantity of customers of that archetype.
		 * @constructor
		 */
		Customer(std::string name, double maxLoad, std::function<double(double, double)> loadProfile, double qty) : name(name), maxLoad(maxLoad), loadProfile(loadProfile), qty(qty) {}

		// Getters
		std::string getName() const { return name; }
		double getMaxLoad() const { return maxLoad; }
		std::function<double(double, double)> getLoadProfile() const { return loadProfile; }
		std::function<double(double, double)> getTotalLoadProfile() const {
			return [this](double tariff, double t) { return this->loadProfile(tariff, t) * this->qty; };
		}
		double getQty() const { return qty; }
		double getLoad(double tariff, double t) const {
			return loadProfile(tariff, t);
		}
		double getTotalLoad(double tariff, double t) const {
			return this->getTotalLoadProfile()(tariff, t);
		}

		std::string to_string() const {
			return std::to_string(qty) + " " + name + " customer(s) " + " with max load " + std::to_string(maxLoad) + ", first three hours: " + std::to_string(getLoad(0,0)) + ", " + std::to_string(getLoad(0, 1)) + ", " + std::to_string(getLoad(0, 2));
		}

		static const std::function<double(double, double)> getTariffFn(std::vector<double> loadProfile) {
			return [loadProfile](double tariff, double t) { return loadProfile[(int)t % loadProfile.size()]; };
		}
};

#endif // CUSTOMER_CPP