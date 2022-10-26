// initial guess
function optimizer(initX,initY,initZ,initH) {
    let ipt = (initX,initY,initZ,initH)
    let visited = new Set()
    let irr = 0
    // change the condition
    while (true) {
        if (visited.has(ipt)) {
            return irr
        }
        visited.add(ipt)
        x,y,z,h = ipt[0], ipt[1], ipt[2], ipt[3]
        let irr = bisection(0,.64,x,y,z,h)
        let dx = bisection(0,.64,x + 1,y,z,h) - irr
        let dy = bisection(0,.64,x,y + 1,z,h) - irr
        let dz = bisection(0,.64,x,y,z + 1,h) - irr
        let dh = bisection(0,.64,x,y,z,h + 1) - irr

        let gradM = abs([dx, dy, dz, dh]) //check this?
        let gradD = [dx,dy,dz,dh]
        //argmax in javascript?
        let i = argmax(gradM) 

        ipt[i] += gradD[i]
    }
}

//optimizer(90,10,2,10)

