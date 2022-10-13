/*
assume that project going to last for 20 years, C0 = cost tracking tools(original, same very years), 
Profit: 30 Shilling per kWh * total kWH for one year
Cost: assume that only cost that happen every year is disel, assume that the cost of dieasal 100 Shilling per litter
Make all of the money for every year at the end of the year - pay for the disels at the end of the year 
-> calculate IRR assume NPV = 0

#asume that there is 7.4kW for battery
*/
var T = 20
//var Ct = 159454 * 30 - 22481 * 100
var C0 = budget * 120

let EPSILON = 0.0000025
function NPV(i) {
    running = 0
    for (let t = 1; t <= T; t++) {
        result = simulation()
        var Ct = result[0] * 30 - result[1] * 100
        running += (Ct/Math.pow(1 + i, t))
    }
    return running - C0
}

function bisection(a, b) {
    //console.log('---')
    //console.log(NPV(a))
    //console.log(NPV(b))
    if (NPV(a) * NPV(b) >= 0) {
        console.print('Try with different a and b')
        return
    }
    let c;
    while ((b - a) >= EPSILON) {
        c = (a+b)/2
        /*
        console.log('***')
        console.log('b - a')
        console.log(b - a)
        console.log('c')
        console.log(c)
        */
        if (NPV(c) == 0) {
            break
        } else if (NPV(c) * NPV(a) < 0) {
            b = c
        } else {
            a = c
        }
    }
    return c

}
console.log('bisection')
console.log(bisection(0,.64))
console.log(NPV(0.08778076171874999))
console.log(NPV(0))


