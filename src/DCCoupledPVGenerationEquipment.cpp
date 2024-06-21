#include <vector>
#include "ACDCCoupledEquipmentGroup.h"
#include "ChargeController.cpp"

class DCCoupledPVGenerationEquipment : ACDCCoupledEquipmentGroup {
	private:
		std::vector<ChargeController> equipmentGroup;

	public:
		/**
		 * Group of charge controllers.
		 * 
		 * @param {ChargeController[]} chargeControllers 
		 */
		DCCoupledPVGenerationEquipment(std::vector<ChargeController> equipmentGroup) : ACDCCoupledEquipmentGroup(equipmentGroup) {}

		DCCoupledPVGenerationEquipment* copy() const override {
			std::vector<ChargeController> copiedEquipmentGroup;
			for (const auto& chargeController : equipmentGroup) {
				copiedEquipmentGroup.push_back(*chargeController.copy());
			}
			return new DCCoupledPVGenerationEquipment(copiedEquipmentGroup);
		}

		/**
		 * Amount of energy 
		 * @param dcArrayOutputWhPerWp 
		 * @param outputVoltage 
		 * @param dt 
		 * @returns 
		 */
		double getEnergy(double dcArrayOutputWhPerWp, double outputVoltage, double dt) const override {
			double energy = std::accumulate(equipmentGroup.begin(), equipmentGroup.end(), 0.0, [dcArrayOutputWhPerWp, outputVoltage, dt](double sum, const ChargeController& chargeController) {
				return sum + chargeController.getEnergy(dcArrayOutputWhPerWp, outputVoltage, dt);
			});
			return energy;
		}
};