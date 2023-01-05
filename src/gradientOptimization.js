/**
 * optimizer function returns the optimized engineering parameters from the inital guesses
 * @param {Integer} initY: inital guess for battery count
 * @param {Integer} initZ: inital guess for charge controller
 * @returns the optimized engineering parameters
 */
function optimizer(initY,initZ) {
    //set up all the parameters in array
    var initX = 9 * initZ
    let ipt = [initX,initY,initZ]
    let visited = new Set()
    let irr = 0

    // run the while loop until found optimized parameters
    while (!visited.has(ipt)) {
        temp = [...ipt]
        visited.add(temp)
        var x = ipt[0]
        var y = ipt[1]
        var z = ipt[2]
        let irr = bisection(-0.64,.64,y,z)
        let dy = bisection(-0.64,.64,y + 1,z) - irr
        let dz = bisection(-0.64,.64,y,z + 1) - irr

        let gradM = [Math.abs(dy), Math.abs(dz)] //check this?
        let gradD = [dy,dz]
        let i = -1
        console.log(`gradM=${gradM}`)
        if (gradM[0] < gradM[1]) {
            i = 1
        } else {
            i = 0
        }
        // note that we only add more engineering inputs, so if adding more materials but the rate of change in IRR stays the same
        //then we would not want to add that and terminate
        if (gradM[1] == 0 && gradM[0] == 0) {
            return [ipt,irr]
        }

        if (i == 1) {
            if (gradD[i] < 0) {
                ipt[2] -= 1
                ipt[0] = ipt[2] * 9
            } else {
                ipt[2] += 1
                ipt[0] = ipt[2] * 9
            }
        } else {
            if (gradD[i] < 0) {
                ipt[1] -= 1
            } else {
                ipt[1] += 1
            }
        }
    }
    return irr
}

/**
 * parse button, run optimizer function and displays result in web
 */
var Obutton = document.getElementById('optimizer');
Obutton.onclick = () => {
    var pvCount = parseInt(document.getElementById('num-pv').value)
    var batteryCount = parseInt(document.getElementById('num-batteries').value)
    var ccCount = parseInt(document.getElementById('num-cc').value)
    var result = optimizer(batteryCount,ccCount)
    document.getElementById('oPV').innerHTML = result[0][0];
    document.getElementById('oB').innerHTML = result[0][1];
    document.getElementById('oCC').innerHTML = result[0][2];
    document.getElementById('oIRR').innerHTML = result[1];
}
