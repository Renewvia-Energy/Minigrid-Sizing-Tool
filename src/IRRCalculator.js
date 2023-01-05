/*
assume that project going to last for 20 years, C0 = cost tracking tools(original, same very years), 
Profit: 30 Shilling per kWh * total kWH for one year
Cost: assume that only cost that happen every year is disel, assume that the cost of dieasal 100 Shilling per litter
Make all of the money for every year at the end of the year - pay for the disels at the end of the year 
-> calculate IRR assume NPV = 0

#asume that there is 7.4kW for battery
*/

// instantiate time interval and epsilon
var T = 20
let EPSILON = 0.000025

/**
 * calulcate NPV given parameters
 * @param {*} i: discount rate
 * @param {*} Ct: cost incremented by the year
 * @param {*} C0: fixed initial cost
 * @returns 
 */
function NPV(i, Ct, C0) {
    running = 0
    for (let t = 1; t <= T; t++) {
        running += (Ct/Math.pow(1 + i, t))
    }
    return running - C0
}

/**
 * Calculate IRR given bounds and battery count, charge controller count
 * @param {c} a: lower bound
 * @param {*} b: upper bound
 * @param {*} batteryCount: battery count
 * @param {*} chargeControllerCount: charge controller count
 * @returns return the IRR
 */
function bisection(a, b, batteryCount, chargeControllerCount) {
    var solarPanelCount = chargeControllerCount * 9
    var C0 = calculateC0(solarPanelCount, batteryCount, chargeControllerCount)*120
    result = simulation(solarPanelCount, batteryCount, chargeControllerCount)
    var Ct = result[0] * 30 - result[1] * 100
    if (NPV(a, Ct, C0) * NPV(b, Ct, C0) >= 0) {
        console.log(NPV(a, Ct, C0))
        console.log(NPV(b, Ct, C0))
        console.log('Try with different a and b')
        return
    }
    let c;
    while ((b - a) >= EPSILON) {
        c = (a+b)/2
        if (NPV(c, Ct, C0) == 0) {
            break
        } else if (NPV(c, Ct, C0) * NPV(a, Ct, C0) < 0) {
            b = c
        } else {
            a = c
        }
    }
    return c

}