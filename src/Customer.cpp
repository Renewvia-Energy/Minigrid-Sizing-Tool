#ifndef CUSTOMER_CPP
#define CUSTOMER_CPP

#include <string>
#include <functional>

class Customer {
	private:
		const std::string name;
		const double maxLoad;
		const std::function<double(double, double)> loadProfile;	// (tariff: number, t: number) => number; Energy needs of a single customer [Wh/hr] given the tariff and time since commissioning [hr].
		const unsigned int qty;

	public:
		/**
		 * A customer archetype and quantity.
		 *
		 * @param name Unique name for the class of customer, e.g. "residential" or "commercial"
		 * @param maxLoad Maximum instantaneous load of a single customer [W]
		 * @param loadProfile Energy needs of a single customer [Wh/hr] given the tariff and time since commissioning [hr].
		 * @param qty Quantity of customers of that archetype.
		 */
		Customer(std::string name, double maxLoad, std::function<double(double, double)> loadProfile, unsigned int qty) : name(name), maxLoad(maxLoad), loadProfile(loadProfile), qty(qty) {}

		// Getters
		std::string getName() const { return name; }
		double getMaxLoad() const { return maxLoad; }
		std::function<double(double, double)> getLoadProfile() const { return loadProfile; }
		std::function<double(double, double)> getTotalLoadProfile() const {
			return [this](double tariff, double t) { return this->loadProfile(tariff, t) * this->qty; };
		}
		unsigned int getQty() const { return qty; }
		double getLoad(double tariff, double t) const {
			return loadProfile(tariff, t);
		}
		double getTotalLoad(double tariff, double t) const {
			return this->getTotalLoadProfile()(tariff, t);
		}

		std::string to_string() const {
			return std::to_string(qty) + " " + name + " customer(s) " + " with max load " + std::to_string(maxLoad) + ", first three hours: " + std::to_string(getLoad(0,0)) + ", " + std::to_string(getLoad(0, 1)) + ", " + std::to_string(getLoad(0, 2));
		}

		/**
		 * Returns a function that takes a tariff [¤] and time [hr], and returns the corresponding load profile [Wh]. This function is designed to be used with a PVWatts output or a 24-hour load profile. It assumes the loadProfile data is periodic in time, so it wraps t.
		 *
		 * @param loadProfile a vector of load profiles indexed sequentially by hour
		 *
		 * @return a function that takes a tariff and time, and returns the corresponding load profile at that time
		 *
		 * @throws None
		 */
		static const std::function<double(double, double)> getTariffFn(std::vector<double> loadProfile) {
			return [loadProfile](double tariff, double t) { return loadProfile[(int)t % loadProfile.size()]; };
		}
};

#endif // CUSTOMER_CPP