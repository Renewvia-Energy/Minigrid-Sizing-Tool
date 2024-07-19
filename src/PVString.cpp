#ifndef PVSTRING_CPP
#define PVSTRING_CPP

#include <vector>
#include <numeric>
#include <memory>
#include "../include/Napps.h"
#include "Panel.cpp"

class PVString {
	private:
		const double Pmp;
		const double Voc;
		const double Vmp;
		const double Isc;
		const double Imp;
		const double price;
		const std::vector<std::unique_ptr<Panel>> panels;

	public:
		/**
		 * A string of solar panels connected in series. Here, a "string" refers to a specific way to connect solar panels rather than an array of characters.
		 * 
		 * NOTE: if you allow different panels in one string, this breaks.
		 * 
		 * @param {Panel[]} panels - Array of solar panels connected in series into one string
		 * @constructor
		 */
		PVString(std::vector<std::unique_ptr<Panel>> panels) : 
			panels(std::move(panels)),
			Pmp(std::accumulate(panels.begin(),panels.end(), 0.0, [](double sum, const auto& panel) { return sum + panel->getPmp(); })),
			Voc(std::accumulate(panels.begin(),panels.end(), 0.0, [](double sum, const auto& panel) { return sum + panel->getVoc(); })),
			Vmp(std::accumulate(panels.begin(),panels.end(), 0.0, [](double sum, const auto& panel) { return sum + panel->getVmp(); })),
			Isc(panels[0]->getIsc()),
			Imp(panels[0]->getImp()),
			price(std::accumulate(panels.begin(),panels.end(), 0.0, [](double sum, const auto& panel) { return sum + panel->getPrice(); })) {}

		// Destructor
		~PVString() = default;

		// Copy constructor
		PVString(const PVString& other)
			: panels(napps::copy_unique_ptr_vector(other.panels)),
			  Pmp(other.Pmp), Voc(other.Voc), Vmp(other.Vmp), Isc(other.Isc), Imp(other.Imp), price(other.price) {}

		// Copy assignment operator
		PVString& operator=(const PVString& other) = delete;

		// Move operator
		PVString(PVString&& other) = default;

		// Move assignment operator
		PVString& operator=(PVString&& other) = delete;

		std::unique_ptr<PVString> clone() const {
			return std::make_unique<PVString>(*this);
		}

		// Getters
		const std::vector<std::unique_ptr<Panel>>& getPanels() const { return panels; }
		double getPmp() const { return Pmp; }
		double getVoc() const { return Voc; }
		double getVmp() const { return Vmp; }
		double getIsc() const { return Isc; }
		double getImp() const { return Imp; }
		double getPrice() const { return price; }

		/**	
		 * Compute the amount of energy produced in one unit of time by every panel in the string.
		 *
		 * @param {number} dcArrayOutputWhPerWp - Amount of energy [Wh] a 1-Wp panel could output during the time interval.
		 * @returns {number} Amount of energy [Wh] produced by the string over the time interval.
		 */
		double getEnergy(double dcArrayOutputWhPerWp) const {
			double energy = std::accumulate(panels.begin(), panels.end(), 0.0, [dcArrayOutputWhPerWp](double sum, const auto& panel) {
				return sum + panel->getEnergy(dcArrayOutputWhPerWp);
			});
			return energy;
		}
};

#endif // PVSTRING_CPP