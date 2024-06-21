#include <vector>
#include <memory>
#include "ACDCCoupledEquipmentGroup.h"
#include "ChargeController.cpp"

class DCCoupledPVGenerationEquipment : public ACDCCoupledEquipmentGroup<ChargeController> {
	public:
		/**
		 * Group of charge controllers.
		 * 
		 * @param {ChargeController[]} chargeControllers 
		 */
		DCCoupledPVGenerationEquipment(std::vector<ChargeController> equipmentGroup) : ACDCCoupledEquipmentGroup<ChargeController>(equipmentGroup) {}

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