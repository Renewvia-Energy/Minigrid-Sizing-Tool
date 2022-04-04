var button = document.getElementById('goButton');

button.onclick = () => {
    var xx = new Array();
    var yy = new Array();
    for (let i=0; i<4; i++) {
        xx.push(parseFloat(document.getElementById(`x${i+1}`).value));
        yy.push(parseFloat(document.getElementById(`y${i+1}`).value));
    }

    var maxx = -1;
    var maxy = -1;
    var maxt = -9e9;
    for (let xi=0; xi<xx.length; xi++) {
        for (let yi=0; yi<yy.length; yi++) {
            if (Math.tan(yy[yi]/xx[xi])>maxt) {
                maxx = xx[xi];
                maxy = yy[yi];
                maxt = Math.tan(yy[yi]/xx[xi]);
            }
        }
    }

    document.getElementById('optx').innerHTML = maxx;
    document.getElementById('opty').innerHTML = maxy;
    document.getElementById('maxtan').innerHTML = maxt;
}