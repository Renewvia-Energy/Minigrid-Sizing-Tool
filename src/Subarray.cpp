#ifndef SUBARRAY_CPP
#define SUBARRAY_CPP

#include <vector>
#include <cassert>
#include <numeric>
#include <memory>
#include "PVString.cpp"

class Subarray {
	private:
		const std::vector<std::unique_ptr<PVString>> pvStrings;
		const double arrayLosses;
		const double Voc;
		const double Vmp;
		const double Pmp;
		const double Isc;
		const double Imp;
		const double price;

	public:
		/**
		 * A subarray of strings of solar panles connected in parallel through a combiner box to be plugged into a PV inverter or charge controller as a PV input.
		 * 
		 * @param pvStrings Array of PVStrings to be connected in parallel through a combiner box. 
		 * @param arrayLosses Fraction of energy produced by the panels that is lost before reaching the PV inverter or charge controller
		 */
		Subarray(std::vector<std::unique_ptr<PVString>> pvStrings, double arrayLosses) : 
			pvStrings(std::move(pvStrings)),
			arrayLosses(arrayLosses),
			Voc(pvStrings[0]->getVoc()),
			Vmp(pvStrings[0]->getVmp()),
			Pmp(std::accumulate(pvStrings.begin(),pvStrings.end(), 0.0, [](double sum, const auto& pvString) { return sum + pvString->getPmp(); })),
			Isc(std::accumulate(pvStrings.begin(),pvStrings.end(), 0.0, [](double sum, const auto& pvString) { return sum + pvString->getIsc(); })),
			Imp(std::accumulate(pvStrings.begin(),pvStrings.end(), 0.0, [](double sum, const auto& pvString) { return sum + pvString->getImp(); })),
			price(std::accumulate(pvStrings.begin(),pvStrings.end(), 0.0, [](double sum, const auto& pvString) { return sum + pvString->getPrice(); })) {
			// TODO: confirm all strings same

			assert(arrayLosses >= 0 && arrayLosses <= 1 && "Array losses must be in [0,1]");
		}

		// Destructor
		~Subarray() = default;

		// Copy constructor
		Subarray(const Subarray& other)
			: pvStrings(napps::copy_unique_ptr_vector(other.pvStrings)),
			  arrayLosses(other.arrayLosses), Voc(other.Voc), Vmp(other.Vmp), Pmp(other.Pmp), Isc(other.Isc), Imp(other.Imp), price(other.price) {}

		// Copy assignment operator
		Subarray& operator=(const Subarray& other) = delete;

		// Move operator
		Subarray(Subarray&& other) = default;

		// Move assignment operator
		Subarray& operator=(Subarray&& other) = delete;

		std::unique_ptr<Subarray> clone() const {
			return std::make_unique<Subarray>(*this);
		}

		// Getters
		const std::vector<std::unique_ptr<PVString>>& getPVStrings() const { return pvStrings; }
		double getVoc() const { return Voc; }
		double getVmp() const { return Vmp; }
		double getPmp() const { return Pmp; }
		double getIsc() const { return Isc; }
		double getImp() const { return Imp; }
		double getPrice() const { return price; }
	
		/**
		 * Compute the amount of energy produced in one unit of time by the entire subarray.
		 *
		 * @param dcArrayOutputWhPerWp Amount of energy [Wh] a 1-Wp panel could output during the time interval.
		 * @returns Amount of energy [Wh] produced by the subarray over the time interval.
		 */
		double getEnergy(double dcArrayOutputWhPerWp) const {
			double energy = std::accumulate(pvStrings.begin(), pvStrings.end(), 0.0, [dcArrayOutputWhPerWp](double sum, const auto& pvString) {
				return sum + pvString->getEnergy(dcArrayOutputWhPerWp);
			});
			return energy*(1-arrayLosses);
		}
};

#endif // SUBARRAY_CPP