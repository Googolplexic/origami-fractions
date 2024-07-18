function generateFujimotoConstruction(svg, size, n, d) {
    [x, a] = fujimotoBinary(n, d);
    x = x.split('').reverse().join('');
    a = a.split('').reverse().join('');

    const CP_Array = [];
    const [lPoint, loc] = fujimotoLeft(CP_Array, x, size, svg);
    if (a !== '') {
        const firstPoint = foldOnLine(CP_Array, lPoint, loc, size, svg);
        const [rPoint, l1, l2] = foldSecond(CP_Array, firstPoint, size, svg);
        fujimotoRight(CP_Array, rPoint, a, l1, l2, size, svg);
    }
    else {
        let newCP = new CP(size, svg);
        newCP.createCrease([0, lPoint], [1, lPoint], 'E');
        CP_Array.push(newCP);
    }

    return CP_Array;
}


function fujimotoLeft(arr, left, size, svg) {

    let yPos = 1;
    let d;
    if (left.length === 1) { yPos = 0; }
    for (let i = 0; i < left.length; i++) {
        let oldYPos = yPos;
        let newCP = new CP(size, svg);
        x = left[i];

        if (x === '0') {
            yPos /= 2;
        }
        else {
            yPos = (1 + yPos) / 2;
        }

        if (i + 1 === left.length) {
            const a = 1;
            const b = -2;
            const c = yPos ** 2;
            d = quadraticEquation(a, b, c)[1];

            newCP.createHorizontalPinch(yPos, 'left', (d <= 0.8) ? d + 0.2 : 1);
        }
        else { newCP.createHorizontalPinch(yPos, 'left', 0.2); };

        newCP.createCrease([0, oldYPos], [0.2, oldYPos], 'E');

        newCP.createPoint([0, oldYPos]);
        newCP.createPoint([0, (x === '0' ? 0 : 1)]);
        newCP.createVerticalArrow((x === '0' ? 0 : 1), oldYPos, 'L');
        arr.push(newCP);
    }
    return [yPos, d];

}

function foldOnLine(arr, yPoint, loc, size, svg) {
    let newCP = new CP(size, svg);

    const point = (yPoint - loc) / (1 - loc);
    newCP.createCrease([0, yPoint], [(loc <= 0.8) ? loc + 0.2 : 1, yPoint], 'E');

    newCP.createCrease([point, 1], [1, 0], 'V', 'dashed');
    newCP.createPoint([1, 1]);
    newCP.createPoint([loc, yPoint]);
    newCP.createArrow([1, 1], [loc, yPoint], [-0.05, -0.03], [0.02, 0.05], 'R');
    arr.push(newCP);
    return point;
}


function foldSecond(arr, point, size, svg) {
    let newCP = new CP(size, svg);
    newCP.createCrease([point, 1], [1, 0], 'E');
    const slope = 1 - point;
    const midPoint = (1 + point) / 2;
    const rPoint = slope * ((1 - point) / 2) + 0.5;

    x1 = midPoint - 0.1 / Math.sqrt(1 + slope ** 2);
    y1 = 0.5 - 0.1 * slope / Math.sqrt(1 + slope ** 2);
    newCP.createCrease([x1, y1], [1, rPoint], 'V', 'dashed');
    newCP.createPoint([1, 0]);
    newCP.createPoint([point, 1]);
    newCP.createArrow([1, 0], [point, 1], [-0.05, 0.02], [0, -0.05], 'L');
    arr.push(newCP);
    return [rPoint, [x1, y1], [1, rPoint]];
}

function fujimotoRight(arr, rPoint, right, l1, l2, size, svg) {
    let yPos = rPoint;

    for (let i = 0; i < right.length; i++) {
        let oldYPos = yPos;
        let newCP = new CP(size, svg);
        x = right[i];

        if (x === '0') {
            yPos /= 2;
        }
        else {
            yPos = (rPoint + yPos) / 2;
        }

        newCP.createHorizontalPinch(yPos, 'right', 0.2);
        newCP.createCrease(l1, l2, 'E');
        if (i !== 0) { newCP.createCrease([1, oldYPos], [0.8, oldYPos], 'E'); }
        newCP.createPoint([1, oldYPos]);
        newCP.createPoint([1, (x === '0' ? 0 : rPoint)]);
        newCP.createVerticalArrow(x === '0' ? 0 : rPoint, oldYPos, 'R');
        arr.push(newCP);
    }
    let lastCP = new CP(size, svg);
    lastCP.createCrease([0, yPos], [1, yPos], 'E');

    arr.push(lastCP);

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

    let xBin, aBin;
    let x = parseInt(d - p);
    if (x === p) {
        let nBin = p !== 1 ? n.toString(2).padStart(Math.log2(p) + 1, '0') : '0';
        nBin = nBin.slice(0, -1) + '0';

        return [nBin, ''];

    }
    let a = parseInt(n);
    let p_x = p;
    let p_a = n === 0 ? 1 : p;

    let xGCD = findGCD(x, p_x);

    x /= xGCD;
    p_x /= xGCD;
    let aGCD = findGCD(a, p_a);
    a /= aGCD;
    p_a /= aGCD;

    xBin = p_x !== 1 ? x.toString(2).padStart(Math.log2(p_x), '0') : "";
    if (xBin.length > 1) {
        xBin = xBin.slice(0, -1) + '0';
    }
    aBin = p_a !== 1 ? a.toString(2).padStart(Math.log2(p_a), '0').slice(0, -1) + '0' : "";
    return [xBin, aBin];
}