function generateFujimotoConstruction(svg, size, n, d) {
    [x, a] = fujimotoBinary(n, d);
    x = x.split('').reverse().join('');
    a = a.split('').reverse().join('');

    const CreasePattern_Array = [];
    const [lPoint, loc] = fujimotoLeft(CreasePattern_Array, x, size, svg);
    if (a !== '') {
        const firstPoint = foldOnLine(CreasePattern_Array, lPoint, loc, size, svg);
        const [rPoint, l1, l2] = foldSecond(CreasePattern_Array, firstPoint, size, svg);
        fujimotoRight(CreasePattern_Array, rPoint, a, l1, l2, size, svg);
    }
    else {
        let newCreasePattern = new CreasePattern(size, svg);
        newCreasePattern.createCrease([0, lPoint], [1, lPoint], 'E');
        CreasePattern_Array.push(newCreasePattern);
    }

    return CreasePattern_Array;
}


function fujimotoLeft(arr, left, size, svg) {

    let yPos = 1;
    let d;
    if (left.length === 1) { yPos = 0; }
    for (let i = 0; i < left.length; i++) {
        let oldYPos = yPos;
        let newCreasePattern = new CreasePattern(size, svg);
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

            newCreasePattern.createHorizontalPinch(yPos, 'left', (d <= 0.8) ? d + 0.2 : 1);
        }
        else { newCreasePattern.createHorizontalPinch(yPos, 'left', 0.2); };

        newCreasePattern.createCrease([0, oldYPos], [0.2, oldYPos], 'E');

        newCreasePattern.createPoint([0, oldYPos]);
        newCreasePattern.createPoint([0, (x === '0' ? 0 : 1)]);
        newCreasePattern.createVerticalArrow((x === '0' ? 0 : 1), oldYPos, 'L');
        arr.push(newCreasePattern);
    }
    return [yPos, d];

}

function foldOnLine(arr, yPoint, loc, size, svg) {
    let newCreasePattern = new CreasePattern(size, svg);

    const point = (yPoint - loc) / (1 - loc);
    newCreasePattern.createCrease([0, yPoint], [(loc <= 0.8) ? loc + 0.2 : 1, yPoint], 'E');

    newCreasePattern.createCrease([point, 1], [1, 0], 'V', 'dashed');
    newCreasePattern.createPoint([1, 1]);
    newCreasePattern.createPoint([loc, yPoint]);
    newCreasePattern.createArrow([1, 1], [loc, yPoint], [-0.05, -0.03], [0.02, 0.05], 'R');
    arr.push(newCreasePattern);
    return point;
}


function foldSecond(arr, point, size, svg) {
    let newCreasePattern = new CreasePattern(size, svg);
    newCreasePattern.createCrease([point, 1], [1, 0], 'E');
    const slope = 1 - point;
    const midPoint = (1 + point) / 2;
    const rPoint = slope * ((1 - point) / 2) + 0.5;

    x1 = midPoint - 0.1 / Math.sqrt(1 + slope ** 2);
    y1 = 0.5 - 0.1 * slope / Math.sqrt(1 + slope ** 2);
    newCreasePattern.createCrease([x1, y1], [1, rPoint], 'V', 'dashed');
    newCreasePattern.createPoint([1, 0]);
    newCreasePattern.createPoint([point, 1]);
    newCreasePattern.createArrow([1, 0], [point, 1], [-0.05, 0.02], [0, -0.05], 'L');
    arr.push(newCreasePattern);
    return [rPoint, [x1, y1], [1, rPoint]];
}

function fujimotoRight(arr, rPoint, right, l1, l2, size, svg) {
    let yPos = rPoint;

    for (let i = 0; i < right.length; i++) {
        let oldYPos = yPos;
        let newCreasePattern = new CreasePattern(size, svg);
        x = right[i];

        if (x === '0') {
            yPos /= 2;
        }
        else {
            yPos = (rPoint + yPos) / 2;
        }
        if (i !== 0) { newCreasePattern.createCrease([1, oldYPos], [0.8, oldYPos], 'E'); }
    
        newCreasePattern.createCrease(l1, l2, 'E');
        newCreasePattern.createHorizontalPinch(yPos, 'right', 0.2);
        newCreasePattern.createPoint([1, oldYPos]);
        newCreasePattern.createPoint([1, (x === '0' ? 0 : rPoint)]);
        newCreasePattern.createVerticalArrow(x === '0' ? 0 : rPoint, oldYPos, 'R');
        arr.push(newCreasePattern);
    }
    let lastCreasePattern = new CreasePattern(size, svg);
    lastCreasePattern.createCrease([0, yPos], [1, yPos], 'E');

    arr.push(lastCreasePattern);

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
    let p_a = p;

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