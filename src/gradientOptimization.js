// initial guess
function optimizer(initY,initZ,initH) {
    var initX = 9 * initZ
    let ipt = [initX,initY,initZ,initH]
    let visited = new Set()
    let irr = 0
    // change the condition
    while (!visited.has(ipt)) {
        temp = [...ipt]
        visited.add(temp)
        var x = ipt[0]
        var y = ipt[1]
        var z = ipt[2]
        var h = ipt[3]
        let irr = bisection(-0.64,.64,x,y,z,h)
        console.log(`irr=${irr}`)
        //let dx = bisection(-0.64,.64,x + 1,y,z,h) - irr // (-.64,.64)
        let dy = bisection(-0.64,.64,x,y + 1,z,h) - irr
        let dz = bisection(-0.64,.64,x + 9,y,z + 1,h) - irr
        //let dh = bisection(-0.64,.64,x,y,z,h + 1) - irr

        let gradM = [ Math.abs(dy), Math.abs(dz)] //check this?
        let gradD = [dy,dz]
        let i = -1
        console.log(`gradM=${gradM}`)
        if (gradM[0] < gradM[1]) {
            i = 1
        } else {
            i = 0
        }
        console.log(i)
        console.log(`gradD=${gradM}`)
        console.log(ipt)
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

        console.log(ipt)
        console.log(visited)
        //console.log(!visited.has(ipt))
    }
    return irr
}


var res = optimizer(25,25,4) //PV, battery, CC, inverter
// (load * 2)/15 round up
console.log(`inputs=[${res[0]}]`)
console.log(`irr=${res[1]}`)

