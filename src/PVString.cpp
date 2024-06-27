#include <vector>
#include <numeric>
#include <memory>
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
			panels(panels),
			Pmp(std::accumulate(panels.begin(),panels.end(), 0.0, [](double sum, const auto& panel) { return sum + panel->getPmp(); })),
			Voc(std::accumulate(panels.begin(),panels.end(), 0.0, [](double sum, const auto& panel) { return sum + panel->getVoc(); })),
			Vmp(std::accumulate(panels.begin(),panels.end(), 0.0, [](double sum, const auto& panel) { return sum + panel->getVmp(); })),
			Isc(panels[0]->getIsc()),
			Imp(panels[0]->getImp()),
			price(std::accumulate(panels.begin(),panels.end(), 0.0, [](double sum, const auto& panel) { return sum + panel->getPrice(); })) {}

		std::unique_ptr<PVString> copy() const {
			std::vector<std::unique_ptr<Panel>> copiedPanels;
			copiedPanels.reserve(panels.size());
			for (const auto& panel : panels) {
				copiedPanels.push_back(std::make_unique<Panel>(panel->copy()));
			}
			return std::make_unique<PVString>(PVString(copiedPanels));
		}

		// Getters
		std::vector<std::unique_ptr<Panel>> getPanels() const { return panels; }
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
			double energy = std::accumulate(panels.begin(), panels.end(), 0.0, [dcArrayOutputWhPerWp](double sum, const Panel& panel) {
				return sum + panel.getEnergy(dcArrayOutputWhPerWp);
			});
			return energy;
		}
};