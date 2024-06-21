#ifndef ACDCCOUPLEDEQUIPMENTGROUP_H
#define ACDCCOUPLEDEQUIPMENTGROUP_H

#include <vector>
#include "PVInverterCC.h"

class ACDCCoupledEquipmentGroup {
	private:
		std::vector<PVInverterCC> equipmentGroup;

	public:
		/**
		 * Group of generation equipment, either PV inverters or charge contollers.
		 * 
		 * @param {PVInverterCC[]} equipmentGroup - Array of PV inverters or charge controllers.
		 */
		ACDCCoupledEquipmentGroup(std::vector<PVInverterCC> equipmentGroup) : equipmentGroup(equipmentGroup) {}

		virtual ACDCCoupledEquipmentGroup* copy() const = 0;

		// Getters
		std::vector<PVInverterCC> getEquipmentGroup() const { return equipmentGroup; }
		double getPrice() const {
			return std::accumulate(equipmentGroup.begin(), equipmentGroup.end(), 0.0,
			[](double sum, const PVInverterCC& equipment) {
				return sum + equipment.totalPrice();
			});
		}

		virtual double getEnergy(double dcArrayOutputWhPerWp, double outputVoltage, double dt) const = 0;
};

#endif // ACDCCOUPLEDEQUIPMENTGROUP_H