// initial guess
function optimizer(initX,initY,initZ,initH) {
    let ipt = [initX,initY,initZ,initH]
    let visited = new Set()
    let irr = 0
    // change the condition
    while (!visited.has(ipt)) {
        visited.add(ipt)
        var x = ipt[0]
        var y = ipt[1]
        var z = ipt[2]
        var h = ipt[3]
        let irr = bisection(0,.64,x,y,z,h)
        let dx = bisection(0,.64,x + 1,y,z,h) - irr
        let dy = bisection(0,.64,x,y + 1,z,h) - irr
        let dz = bisection(0,.64,x,y,z + 1,h) - irr
        let dh = bisection(0,.64,x,y,z,h + 1) - irr

        let gradM = [Math.abs(dx), Math.abs(dy), Math.abs(dz), Math.abs(dh)] //check this?
        let gradD = [dx,dy,dz,dh]
        //argmax in javascript?
        let mmax = Math.max(gradM)
        let i = gradM.indexOf(mmax)
        //let i = argmax(gradM) 

        ipt[i] += gradD[i]
        console.log(ipt)
    }
    return irr
}


optimizer(90,10,10,2) //PV, battery, CC, inverter

