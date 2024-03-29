//  instantiate globals variables for rate and fee. These are fixed variables
var ExchangeRateNGNUSD = 411
var ExchangeRateUSDNG = 1/411
var ExchangeRateKshsUSD = 117
var InspectionFees = 250
var VATRate = 0.075
var ImportCharge = 0.01
var PortSurcharge = 0.07
var ETLLevy = 0.005

/**
 * helper function to calculate for all the Half auto-budgets for battery
 * @param {Integer} bCount: battery count
 * @returns return batterykWhAtSite, BatteryNonVAT, BatteryVAT
 */
function batteryCost(bCount) {
    var BatterySitesCount = bCount
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
/**
 * helper function to calculate for all the Half auto-budgets for inverter
 * @param {Integer} iV:  inverter count
 * @returns return all the Half auto-budgets for inverter
 */
function inverterCost(iV) {
    var BatteryInverterCount = iV
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
/**
 * helper function to calculate for all the Half auto-budgets for charge controller
 * @param {Integer} ccC: number of charge controller
 * @returns all the Half cost for charge controller
 */

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

/**
 * helper function to calculate for all the Half auto-budgets for PV
 * @param {Integer} pvC: number of PV
 * @returns all the Half cost for PV
 */
function PVCost(pvC) {
    var PVPanelCount = pvC
    var PVWattsPerPanel = 540
    var PVSiteWattage = PVPanelCount*PVWattsPerPanel
    var RackingPricePerW = 0.05
    var RackingCost = RackingPricePerW*PVSiteWattage
    var RackingShippingCost = 1000
    //calculation on Rack category
    var LevyOnRacking = 0.15
    var DutyOnRacking = 0.05
    var VATonRacking = 0.075
    var RackingNonVAT = Math.ceil(ExchangeRateNGNUSD*((RackingCost+RackingShippingCost)*DutyOnRacking))
        +Math.ceil(ExchangeRateNGNUSD*((RackingCost+RackingShippingCost)*LevyOnRacking))
        +Math.ceil(ExchangeRateNGNUSD*(ImportCharge*RackingCost))
        +Math.ceil(ExchangeRateNGNUSD*(PortSurcharge*(RackingCost+RackingShippingCost)*DutyOnRacking))
        +Math.ceil(ExchangeRateNGNUSD*(ETLLevy*(RackingCost+RackingShippingCost)))
    var RackingVAT = VATRate*VATonRacking*(RackingNonVAT+ExchangeRateNGNUSD*(RackingCost+RackingShippingCost))
    // calculation on PV
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

// list of input for YES auto-budget items
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
let preBudget = 12098.19

/**
 * button function to load all the cost and carry out calculations
 */
var Cbutton = document.getElementById('cost');
Cbutton.onclick = () => {
    for (let i = 0; i < 100; i++) {
        let val = parseFloat(document.getElementById(`c${i+1}`).value)
        //console.log(val)
        preBudget += val
    } 
}

/**
 * calculate cummulative cost for the whole cost tracking template
 * @param {Integer} solarPanelCount: solar panel count
 * @param {Integer} batteryCount: battery count
 * @param {Integer} chargeControllerCount: charge controller count
 * @returns the cummulative cost for the project
 */
function calculateC0(solarPanelCount, batteryCount, chargeControllerCount) {
    var inverter = new Inverter(chargeControllerCount)
    var inverterCount = inverter.count
    var bC = batteryCost(batteryCount)
    var iC = inverterCost(inverterCount)
    var CCNonVAT = ccCost(chargeControllerCount)
    var PV = PVCost(solarPanelCount)

    var PVStringCount = solarPanelCount / 3
    var plant_balance_of_system_half_inverter = (inverterCount*2000 + 3*inverterCount*2000 + inverterCount*700 + (2+inverterCount)*1000)*ExchangeRateUSDNG*(1+VATRate)
    var plant_balance_of_system_half_battery = (batteryCount*4*1000 + 4*batteryCount*400)*ExchangeRateUSDNG*(1+VATRate)
    var plant_balance_of_system_half_CC = (chargeControllerCount*15000 + chargeControllerCount*400 + 2*chargeControllerCount*1200 + chargeControllerCount*10*2*700)*ExchangeRateUSDNG*(1+VATRate)
    var plant_balance_of_system_half_PV = (PVStringCount*1500 + (1/3)*PVStringCount*(3+6+9+1+1)*1.2*300)*ExchangeRateUSDNG*(1+VATRate) + PV[0]*4*ExchangeRateUSDNG

    quantity = [1,1,bC[1],1,bC[2],batteryCount,bC[0],1,1,1,1,1,1,1,0,432,1,1,5,1,5,5,5,200,200,200,1,1,iC[0],1,1,inverterCount,iC[1],CCNonVAT,1,chargeControllerCount,1,1,1,PV[1],1,PV[2],PV[0],PV[0],1,1,PV[3],PV[5],PV[4],1,solarPanelCount,solarPanelCount, 1]

    let budget = preBudget + plant_balance_of_system_half_inverter + plant_balance_of_system_half_battery + plant_balance_of_system_half_CC + plant_balance_of_system_half_PV
    for (let i = 0; i < ipt.length; i++) {
        let expenses = ipt[i]
        var curr = costs[expenses[0]]
        for (let j = 1; j < expenses.length; j ++) {
            curr = curr[expenses[j]]
        }
        budget += (curr * quantity[i])
    }
    return budget
}

//console.log(calculateC0(40,20,5,2))



