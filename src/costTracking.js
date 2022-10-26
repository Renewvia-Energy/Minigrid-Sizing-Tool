/*
var batteries_materials_solarMDSmartLogger = 170.53

var communityRelations_directJobCost_preConstructionVisitLodging = 313.87
var communityRelations_directJobCost_preConstructionVisitPerDiem = 97.32
var communityRelations_directJobCost_preConstructionVisitRentalBodaBodas = 121.65
var communityRelations_directJobCost_preConstructionVisitTravel = 418.49
var communityRelations_EquipmentRentals_ChairRentalAndDrinksForMeetings = 48.66
var communityRelations_Labor_SalariesForCommunityRepresentatives = 19.46
var communityRelations_Labor_SecurityDuringConstruction = 170.32

var CustomerMeteringAndWiring_Customs_SparkMeterPreShipmentFees = 500
var CustomerMeteringAndWiring_DirectJobCost_SparkMeterSaaSTermLicenses = 0
var CustomerMeteringAndWiring_Labor_LoadingOfMetersAndCustomerWiringMaterials = 43.80
*/

var batteries = 170.53
var community_relations = 1019.46
var customer_metering_wiring = 13367.05
var distribution = 0
var fencing = 0
var generator = 0
var inverter = 0
var permits = 4082.82
var plant_balance_of_system = 4338.38
var plant_site = 2396.65
var power_house = 4348.75
var racking_and_mounting = 4977.25
var solar_panels = 2506.08
var temporary_facilities = 121.65
var transmission = 0
var travel_lodging_meals = 3459.12


var ExchangeRateNGNUSD = 411
var ExchangeRateUSDNG = 1/411
var ExchangeRateKshsUSD = 117
var InspectionFees = 250
var VATRate = 0.075
var ImportCharge = 0.01
var PortSurcharge = 0.07
var ETLLevy = 0.005


function batteryCost(bCount) {
    var BatterySitesCount = 5
    var BatteryShippingPerkWh = 6
    var BatterykWhPerUnit = 7.4
    var BatteryPricePerUnit = 2200
    var BatteryLugsPerUnit = 4
    var BatterykWhAtSite = BatterykWhPerUnit * bCount
    var BatteryCost = BatteryPricePerUnit * bCount
    var BatteryCostShipping = BatteryShippingPerkWh * BatterykWhAtSite
    var CombinedShippingInvertersBatteries = false
    var VATonBatteries = VATRate
    var DutyOnBatteries = 0.2
    var LevyOnBatteries = 0

    var BatteryNonVAT = Math.ceil(ExchangeRateNGNUSD*((BatteryCost + BatteryCostShipping) * DutyOnBatteries))
                        + Math.ceil(ExchangeRateNGNUSD*((BatteryCost+BatteryCostShipping)*LevyOnBatteries))
                        + Math.ceil(ExchangeRateNGNUSD*(ImportCharge*BatteryCost))
                        + Math.ceil((ExchangeRateNGNUSD*(PortSurcharge*(BatteryCost+BatteryCostShipping)*DutyOnBatteries)))
                        + Math.ceil(ExchangeRateNGNUSD*(ETLLevy*(BatteryCost+BatteryCostShipping)))
  
    var BatteryVAT = VATRate * VATonBatteries * (BatteryNonVAT+ExchangeRateNGNUSD*(BatteryCost+BatteryCostShipping))

    return [BatterykWhAtSite, BatteryNonVAT*ExchangeRateUSDNG, BatteryVAT*ExchangeRateUSDNG]

}

function inverterCost(iC) {
    var BatteryInverterCount = iC
    var BatteryInverterPricePerUnit = 2600
    var BatteryInverterkWPerUnit = 15 //(kW)
    var BatteryInverterCost = BatteryInverterCount*BatteryInverterPricePerUnit
    var BatteryInverterShippingPricePerkW = 36
    var BatteryInverterCostShipping = BatteryInverterShippingPricePerkW*BatteryInverterCount*BatteryInverterkWPerUnit
    var VATonBatteryInverters = 0
    var DutyOnBatteryInverters = 0.05
    var LevyOnBatteryInverters = 0

    var BatteryInverterNonVAT =Math.ceil(ExchangeRateNGNUSD*((BatteryInverterCost+BatteryInverterCostShipping)*DutyOnBatteryInverters))
        +Math.ceil(ExchangeRateNGNUSD*((BatteryInverterCost+BatteryInverterCostShipping)*LevyOnBatteryInverters))
        +Math.ceil(ExchangeRateNGNUSD*(ImportCharge*BatteryInverterCost))
        +Math.ceil(ExchangeRateNGNUSD*(PortSurcharge*(BatteryInverterCost+BatteryInverterCostShipping)*DutyOnBatteryInverters))
        +Math.ceil(ExchangeRateNGNUSD*(ETLLevy*(BatteryInverterCost+BatteryInverterCostShipping)))
    
    return [BatteryInverterNonVAT*ExchangeRateUSDNG, BatteryInverterkWPerUnit*BatteryInverterCount]
}

function ccCost(ccC) {
    var PVCCCount = ccC
    var PVCCPricePerUnit = 588.88
    var PVCCCost = PVCCCount*PVCCPricePerUnit
    var VATonPVInverters = 0
    var DutyOnPVInverters = 0.05
    var LevyOnPVInverters = 0
    var PVCCCostShipping = 0

    var PVCCNonVAT = (Math.ceil(ExchangeRateNGNUSD*((PVCCCost+PVCCCostShipping)*DutyOnPVInverters))
        +Math.ceil(ExchangeRateNGNUSD*((PVCCCost+PVCCCostShipping)*LevyOnPVInverters))
        +Math.ceil(ExchangeRateNGNUSD*(ImportCharge*PVCCCost))
        +Math.ceil(ExchangeRateNGNUSD*(PortSurcharge*(PVCCCost+PVCCCostShipping)*DutyOnPVInverters))
        +Math.ceil(ExchangeRateNGNUSD*(ETLLevy*(PVCCCost+PVCCCostShipping))))

    return PVCCNonVAT*ExchangeRateUSDNG
}

function PVCost(pvC) {
    var PVPanelCount = pvC
    var PVWattsPerPanel = 540
    var PVSiteWattage = PVPanelCount*PVWattsPerPanel
    var RackingPricePerW = 0.05
    var RackingCost = RackingPricePerW*PVSiteWattage
    var RackingShippingCost = 1000

    var LevyOnRacking = 0.15
    var DutyOnRacking = 0.05
    var VATonRacking = 0.075
    var RackingNonVAT = Math.ceil(ExchangeRateNGNUSD*((RackingCost+RackingShippingCost)*DutyOnRacking))
        +Math.ceil(ExchangeRateNGNUSD*((RackingCost+RackingShippingCost)*LevyOnRacking))
        +Math.ceil(ExchangeRateNGNUSD*(ImportCharge*RackingCost))
        +Math.ceil(ExchangeRateNGNUSD*(PortSurcharge*(RackingCost+RackingShippingCost)*DutyOnRacking))
        +Math.ceil(ExchangeRateNGNUSD*(ETLLevy*(RackingCost+RackingShippingCost)))
    var RackingVAT = VATRate*VATonRacking*(RackingNonVAT+ExchangeRateNGNUSD*(RackingCost+RackingShippingCost))

    var PVPanelsInShipment = 620
    var PVkWInShipment = PVPanelsInShipment*PVWattsPerPanel/1000
    var C138 = PVSiteWattage/(PVkWInShipment*1000)
    var PVInspection = InspectionFees*ExchangeRateNGNUSD*C138
    var PortFeesTwentyFoot = 218703
    var PVPortFees = C138 * PortFeesTwentyFoot
    var PVPricePerWatt = 0.273
    var PVPricePerPanel = PVPricePerWatt * PVWattsPerPanel
    var PVTransportTotal = 4000
    var PVTransportPerPanel = PVTransportTotal/PVPanelsInShipment
    var PVCost = PVPanelCount * PVPricePerPanel
    var PVCostShipping = PVTransportPerPanel*PVPanelCount
    var VATonPV = 0
    var DutyOnPV = 0
    var LevyOnPV = 0

    var PVNonVAT = Math.ceil(ExchangeRateNGNUSD*((PVCost+PVCostShipping)*DutyOnPV))
        +Math.ceil(ExchangeRateNGNUSD*((PVCost+PVCostShipping)*LevyOnPV))
        +Math.ceil(ExchangeRateNGNUSD*(ImportCharge*PVCost))
        +Math.ceil(ExchangeRateNGNUSD*(PortSurcharge*(PVCost+PVCostShipping)*DutyOnPV))
        +Math.ceil(ExchangeRateNGNUSD*(ETLLevy*(PVCost+PVCostShipping)))
    return [PVSiteWattage, RackingNonVAT*ExchangeRateUSDNG, RackingVAT*ExchangeRateUSDNG, PVInspection*ExchangeRateUSDNG, PVPortFees*ExchangeRateUSDNG, PVNonVAT*ExchangeRateUSDNG]

}





var ipt = [['Batteries','Customs','ClearingAgentFees'],
            ['Batteries','Customs','InspectionFee'],
            ['Batteries','Customs','NonVATCustoms'],
            ['Batteries','Customs','PortFees'],
            ['Batteries','Customs','VAT'],
            ['Batteries','Materials','Batteries'],
            ['Batteries','Transport','InternationalTransport'],
            ['CusomerMeteringAndWiring','Customs', 'ClearingAgentFees'],
            ['CusomerMeteringAndWiring','Customs', 'InspectionFee'], 
            ['CusomerMeteringAndWiring','Customs', 'NonVATCustoms'],
            ['CusomerMeteringAndWiring','Customs', 'PortFees'],
            ['CusomerMeteringAndWiring','Customs', 'VAT'],
            ['CusomerMeteringAndWiring', 'Material', 'MeteringBaseStation'],
            ['CusomerMeteringAndWiring', 'Material', 'SM200EMeters'],
            ['CusomerMeteringAndWiring', 'Material', 'SMRPIMeters'],
            ['CusomerMeteringAndWiring', 'Material', 'SMRDSMeters'],
            ['CusomerMeteringAndWiring','Transport', 'CustomerDropWireTransportToSite'],
            ['CusomerMeteringAndWiring','Transport', 'InternationalTransport'],
            ['Distribution', 'Contingency', 'DistributionContingency'],
            ['Distribution', 'DirectJobCost', 'DistributionSurveyor'],
            ['Distribution', 'Labor', 'DistributionLabor'],
            ['Distribution', 'Materials', 'DistributionMaterials'],
            ['Distribution', 'Transport', 'DistributionMaterialsRoadTransport'],
            ['Fencing', 'Labor', 'FencingLabor'], 
            ['Fencing', 'Materials', 'FencingMaterials'], 
            ['Fencing', 'Transport', 'FencingMaterialsTransport'],
            ['InterversB', 'Customs', 'ClearingAgentFees'],
            ['InterversB', 'Customs', 'InspectionFee'],
            ['InterversB', 'Customs', 'NonVATCustoms'],
            ['InterversB', 'Customs', 'PortFees'],
            ['InterversB', 'Customs','VAT'],
            ['InterversB', 'Materials','BatteryInverterVictronQuattro15kW'],
            ['InterversB', 'Transport', 'InternationalTransport'],
            ['InterversPV', 'Customs', 'NonVATCustoms'],
            ['InterversPV', 'Customs','VAT'],
            ['InterversPV', 'Materials','VictronSmartSolarMPPT25085ChargeController'],
            ['PowerHouse', 'Transport', 'PowerHouseTransportByRoad'],
            ['RackingAndMounting', 'Customs', 'ClearingAgentFees'],
            ['RackingAndMounting', 'Customs', 'InspectionFee'],
            ['RackingAndMounting', 'Customs', 'NonVATCustoms'],
            ['RackingAndMounting', 'Customs', 'PortFees'],
            ['RackingAndMounting', 'Customs', 'VAT'],
            ['RackingAndMounting', 'Labor', 'RackingLabor'],
            ['RackingAndMounting', 'Materials', 'Racking'],
            ['RackingAndMounting', 'Transport', 'TransportToSite'],
            ['SolarPanels', 'Customs', 'ClearingAgentFees'],
            ['SolarPanels', 'Customs', 'InspectionFee'],
            ['SolarPanels', 'Customs', 'NonVATCustoms'],
            ['SolarPanels', 'Customs', 'PortFees'],
            ['SolarPanels', 'Customs', 'VAT'],
            ['SolarPanels', 'Material', 'SolarPanels'],
            ['SolarPanels', 'Transport', 'InternationalTransport'],
            ['SolarPanels', 'Transport', 'TransportToSite']]

// engineering input goes here!
function calculateC0(solarPanelCount, batteryCount, chargeControllerCount, inverterCount) {
    var bC = batteryCost(batteryCount)
    var iC = inverterCost(inverterCount)
    var CCNonVAT = ccCost(chargeControllerCount)
    var PV = PVCost(solarPanelCount)
    quantity = [1,1,bC[1],1,bC[2],batteryCount,bC[0],1,1,1,1,1,1,1,0,432,1,1,5,1,5,5,5,200,200,200,1,1,iC[0],1,1,inverterCount,iC[1],CCNonVAT,1,chargeControllerCount,1,1,1,PV[1],1,PV[2],PV[0],PV[0],1,1,PV[3],PV[5],PV[4],1,solarPanelCount,solarPanelCount, 1]

    //quantity = [1,1,1,1,1,10,74,1,1,1,1,1,1,1,0,432,1,1,5,1,5,5,5,200,200,200,1,1,1,1,1,1,15,1,1,10,1,1,1,1,1,1,48600,48600,1,1,1,1,1,1,90,90, 1]
    let budget = batteries+community_relations+customer_metering_wiring+permits+plant_balance_of_system+plant_site + power_house+racking_and_mounting+ solar_panels+ temporary_facilities+ travel_lodging_meals

    for (let i = 0; i < ipt.length; i++) {
        let expenses = ipt[i]
        var curr = costs[expenses[0]]
        for (let j = 1; j < expenses.length; j ++) {
            curr = curr[expenses[j]]
        }
        //console.log('--')
        //console.log(curr)
        //console.log(quantity[i])
        console.log(curr * quantity[i])
        budget += (curr * quantity[i])
    }

    console.log('Final Budget:' + budget)
    return budget
}

calculateC0(40,20,5,2)





