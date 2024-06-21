#ifndef ACDCCOUPLEDEQUIPMENTGROUP_H
#define ACDCCOUPLEDEQUIPMENTGROUP_H

#include <vector>
#include <memory>
#include "PVInverterCC.h"

template <typename T, typename = std::enable_if_t<std::is_base_of<PVInverterCC, T>::value>>
class ACDCCoupledEquipmentGroup {
	protected:
		std::vector<T> equipmentGroup;

	public:
		ACDCCoupledEquipmentGroup(std::vector<T> equipmentGroup) : equipmentGroup(equipmentGroup) {}

		virtual ~ACDCCoupledEquipmentGroup() = default;

		virtual ACDCCoupledEquipmentGroup* copy() const = 0;

		std::vector<T> getEquipmentGroup() const { return equipmentGroup; }

		double getPrice() const {
			return std::accumulate(equipmentGroup.begin(), equipmentGroup.end(), 0.0,
			[](double sum, const PVInverterCC& equipment) {
				return sum + equipment.totalPrice();
			});
		}

		virtual double getEnergy(double dcArrayOutputWhPerWp, double outputVoltage, double dt) const = 0;
};

#endif // ACDCCOUPLEDEQUIPMENTGROUP_H