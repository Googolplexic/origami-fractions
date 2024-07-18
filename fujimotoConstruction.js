function generateFujimotoConstruction(svg, size, n, d) {
    [x, a] = fujimotoBinary(n, d);
    x = x.split('').reverse().join('');
    a = a.split('').reverse().join('');
    console.log(x, a);
    const CP_Array = [];
    let lPoint = fujimotoLeft(CP_Array, x, size, svg);
    foldOnLine(CP_Array, lPoint, size, svg);
    // if (a !== b) {
    //     let rPoint = generateRight(CP_Array, b, lPoint, size, svg);
    //     generateDiagonals(CP_Array, lPoint, rPoint, size, svg);
    // }
    // else {
    //     let newCP = new CP(size, svg);
    //     newCP.createCrease([0, lPoint], [1, lPoint], 'E');
    //     CP_Array.push(newCP);
    // }
    console.log(CP_Array.length);
    return CP_Array;
}


function fujimotoLeft(arr, left, size, svg) {
    let yPos = 1;
    if (left === '1') { yPos = 0; }
    for (let i = 0; i < left.length; i++) {
        let oldYPos = yPos;
        let newCP = new CP(size, svg);
        x = left[i];
        console.log("Reading x", x);
        if (x === '0') {
            yPos /= 2;
        }
        else {
            yPos = (1 + yPos) / 2;
        }
        console.log("YPos: ", yPos);
        newCP.createHorizontalPinch(yPos, 'left');
        if (oldYPos !== 1) { newCP.createCrease([0, oldYPos], [0.2, oldYPos], 'E'); }
        newCP.createPoint([0, oldYPos]);
        newCP.createPoint([0, (x === '0' ? 0 : 1)]);
        newCP.createArrow((x === '0' ? 0 : 1), oldYPos, 0);
        arr.push(newCP);
    }
    return yPos;

}

function foldOnLine(arr, yPoint, size, svg) {
    let newCP = new CP(size, svg);
    if (yPoint !== 1) { newCP.createCrease([0, yPoint], [0.8, yPoint], 'E'); }

    const x1 = 0;
    const x2 = 1;
    const y1 = yPoint;
    const y2 = yPoint;
    const xc = 1;
    const yc = 0;
    const r = 1;
    const a = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    const b = 2 * (x2 - x1) * (x1 - xc) + 2 * (y2 - y1) * (y1 - yc);
    const c = xc ** 2 + yc ** 2 + x1 ** 2 + y1 ** 2 - 2 * (xc * x1 + yc * y1) - r ** 2;
    console.log(a, b, c);
    const d = quadraticEquation(a, b, c)[1];
    
    const point = (yPoint - d) / (1 - d);


    newCP.createCrease([point, 1], [1, 0], 'V', 'dashed');
    arr.push(newCP);


}

function quadraticEquation(a, b, c) {
    const determinant = b ** 2 - 4 * a * c;
    if (determinant < 0) { return [NaN, NaN]; }
    return [(-b + Math.sqrt(determinant)) / 2 * a, (-b - Math.sqrt(determinant)) / 2 * a];


}
function fujimotoBinary(n, d) {
    let p = 1;
    while (p < d) { p *= 2; }
    if (p > 1) { p /= 2; }
    console.log(p);
    let xBin, aBin;
    let x = parseInt(d - p);
    if (x === p) {
        let nBin = p !== 1 ? n.toString(2).padStart(Math.log2(p) + 1, '0') : '0';
        nBin = nBin.slice(0, -1) + '0';
        console.log("bin", nBin);
        return [nBin, ''];

    }
    let a = parseInt(n);
    let p_x = p;
    let p_a = n === 0 ? 1 : p;
    console.log(p);
    let xGCD = findGCD(x, p_x);
    console.log(p);
    x /= xGCD;
    p_x /= xGCD;
    let aGCD = findGCD(a, p_a);
    a /= aGCD;
    p_a /= aGCD;
    console.log(p_x, p_a);
    xBin = p_x !== 1 ? x.toString(2).padStart(Math.log2(p_x), '0') : "";
    if (xBin.length > 1) {
        xBin = xBin.slice(0, -1) + '0';
    }
    aBin = p_a !== 1 ? a.toString(2).padStart(Math.log2(p_a), '0') : "";
    if (aBin.length > 1) {
        aBin = aBin.slice(0, -1) + '0';
    }

    console.log("x:", x, p_x, xBin);
    console.log("a:", a, p_a, aBin);
    return [xBin, aBin];
}