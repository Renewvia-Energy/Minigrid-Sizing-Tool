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


var ipt = [['Batteries','Customs','ClearingAgentFees'],
            ['Batteries','Customs','InspectionFee'], ['Batteries','Customs','NonVAtCustoms'],
            ['Batteries','Customs','PortFees'],['Batteries','Customs','VAT'],['Batteries','Materials','Batteries'],
            ['Batteries','Transport','InternationalTransport'], 
            ['CusomerMeteringAndWiring', 'Material', 'MeteringBaseStation'],
            ['CusomerMeteringAndWiring', 'Material', 'SM200EMeters'],
            ['CusomerMeteringAndWiring', 'Material', 'SMRPIMeters'],
            ['CusomerMeteringAndWiring', 'Material', 'SMRDSMeters'],
            ['CusomerMeteringAndWiring','Transport', 'CustomerDropWireTransportToSite'],
            ['CusomerMeteringAndWiring','Transport', 'InternationalTransport'],
            ['CusomerMeteringAndWiring','Customs', 'ClearingAgentFees'],
            ['CusomerMeteringAndWiring','Customs', 'InspectionFee'],
            ['CusomerMeteringAndWiring','Customs', 'NonVAtCustoms'],
            ['CusomerMeteringAndWiring','Customs', 'PortFees'],
            ['CusomerMeteringAndWiring','Customs', 'VAT'],
            ['Distribution', 'Contingency', 'DistributionContingency'],
            ['Distribution', 'DirectJobCost', 'DistributionSurveyor'],
            ['Distribution', 'Labor', 'DistributionLabor'],
            ['Distribution', 'Materials', 'DistributionMaterials'],
            ['Distribution', 'Transport', 'DistributionMaterialsRoadTransport'],
            ['Fencing', 'Labor', 'FencingLabor'], ['Fencing', 'Materials', 'FencingMaterials'], ['Fencing', 'Transport', 'FencingMaterialsTransport'],
            ['Intervers', 'Customs', 'ClearingAgentFees', 'NotSpecify'],
            ['Intervers', 'Customs', 'ClearingAgentFees', 'SGS'],
            ['Intervers', 'Customs', 'ClearingAgentFees', 'NCS'],
            ['Intervers', 'Customs', 'ClearingAgentFees', 'NPA'],
            ['Intervers', 'Customs','NonVAtCustoms'],
            ['Intervers', 'Customs','VAT'],['Intervers', 'Customs','VictronSmartSolarMPPT25085ChargeController'],
            ['Intervers', 'Materials','BatteryInverterVictronQuattro15kW'], ['Intervers', 'Transport', 'InternationalTransport'],
            ['RackingAndMounting', 'Customs', 'ClearingAgentFees'],
            ['RackingAndMounting', 'Customs', 'InspectionFee'],
            ['RackingAndMounting', 'Customs', 'NonVATCustoms'],
            ['RackingAndMounting', 'Customs', 'PortFees'],
            ['RackingAndMounting', 'Customs', 'VAT'],
            ['RackingAndMounting', 'Materials', 'Racking'],
            ['RackingAndMounting', 'Transport', 'TransportToSite'],
            ['RackingAndMounting', 'Labor', 'RackingLabor'],
            ['SolarPanels', 'Customs', 'ClearingAgentFees'],
            ['SolarPanels', 'Customs', 'InspectionFee'],
            ['SolarPanels', 'Customs', 'NonVATCustoms'],
            ['SolarPanels', 'Customs', 'PortFees'],
            ['SolarPanels', 'Material', 'SolarPanels'],
            ['SolarPanels', 'Transport', 'InternationalTransport'],
            ['SolarPanels', 'Transport', 'TransportToSite']]

var budget = batteries+community_relations+customer_metering_wiring+permits+plant_balance_of_system+plant_site + power_house+racking_and_mounting+ solar_panels+ temporary_facilities+ travel_lodging_meals

for (let i = 0; i < ipt.length; i++) {
    let expenses = ipt[i]
    var curr = costs[expenses[0]]
    for (let j = 1; j < expenses.length; j ++) {
        curr = curr[expenses[j]]
    }
    console.log(ipt[i])
    console.log(curr)
    budget += curr
}

console.log('Final Budget:' + budget)




