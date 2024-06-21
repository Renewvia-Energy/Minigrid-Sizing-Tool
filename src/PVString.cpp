#include <vector>
#include <numeric>
#include "Panel.cpp"

class PVString {
	private:
		double Pmp;
		double Voc;
		double Vmp;
		double Isc;
		double Imp;
		double price;
        std::vector<Panel> panels;

	public:
		/**
		 * A string of solar panels connected in series. Here, a "string" refers to a specific way to connect solar panels rather than an array of characters.
		 * 
		 * NOTE: if you allow different panels in one string, this breaks.
		 * 
		 * @param {Panel[]} panels - Array of solar panels connected in series into one string
		 * @constructor
		 */
		PVString(std::vector<Panel> panels) : panels(panels), Pmp(0), Voc(0), Vmp(0), Isc(panels[0].getIsc()), Imp(panels[0].getImp()), price(0) {
			for (const auto& panel : panels) {
				Pmp+= panel.getPmp();
				Voc+= panel.getVoc();
				Vmp+= panel.getVmp();
				price+= panel.getPrice();
			}
		}

		PVString* copy() const {
			std::vector<Panel> copiedPanels;
			copiedPanels.reserve(panels.size());
			for (const auto& panel : panels) {
				copiedPanels.push_back(panel.copy());
			}
			return new PVString(copiedPanels);
		}

		// Getters
		std::vector<Panel> getPanels() const { return panels; }
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