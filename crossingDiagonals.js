function generateCP(svg, size) {
    let a = parseInt(document.getElementById('a').value);
    let b = parseInt(document.getElementById('b').value);
    [a, b] = generateBinary(a, b);
    a = a.split('').reverse().join('');
    b = b.split('').reverse().join('');
    console.log(a, b);
    const CP_Array = [];
    let lPoint = generateLeft(CP_Array, a, size, svg);
    if (!(a === b)) {
        let rPoint = generateRight(CP_Array, b, lPoint, size, svg);
        generateDiagonals(CP_Array, lPoint, rPoint, size, svg);
    }
    else {
        let newCP = new CP(size, svg);
        newCP.createCrease([0, lPoint], [1, lPoint], 'E');
        CP_Array.push(newCP);
    }
    console.log(CP_Array.length);
    return CP_Array;
}

function generateLeft(arr, left, size, svg) {

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
        arr.push(newCP);
    }
    return yPos;

}

function generateRight(arr, right, lPos, size, svg) {
    let yPos = 1;
    if (right.length === 1) { yPos = 0; }
    for (let i = 0; i < right.length; i++) {
        let oldYPos = yPos;
        let newCP = new CP(size, svg);
        x = right[i];
        console.log("Reading x", x);
        if (x === '0') {
            yPos /= 2;
        }
        else {
            yPos = (1 + yPos) / 2;
        }
        console.log("YPos: ", yPos);
        newCP.createHorizontalPinch(yPos, 'right');
        if (lPos !== 1) { newCP.createCrease([0, lPos], [0.2, lPos], 'E'); };
        if (oldYPos !== 1) { newCP.createCrease([1, oldYPos], [0.8, oldYPos], 'E'); }
        newCP.createPoint([1, oldYPos]);
        newCP.createPoint([1, (x === '0' ? 0 : 1)]);
        arr.push(newCP);
    }
    return yPos == 1 ? 0 : yPos;

}

function generateDiagonals(arr, lPos, rPos, size, svg) {
    let newCP1 = new CP(size, svg);
    if (lPos !== 1) { newCP1.createCrease([0, lPos], [0.2, lPos], 'E'); }
    if (rPos !== 0) { newCP1.createCrease([1, rPos], [0.8, rPos], 'E'); };
    newCP1.createCrease([0, lPos], [1, rPos], 'V', 'dashed');
    newCP1.createPoint([0, lPos]);
    newCP1.createPoint([1, rPos]);
    arr.push(newCP1);

    let newCP2 = new CP(size, svg);
    newCP2.createCrease([0, lPos], [1, rPos], 'E');
    newCP2.createCrease([0, 0], [1, 1], 'V', 'dashed');
    arr.push(newCP2);

    let newCP3 = new CP(size, svg);
    newCP3.createCrease([0, lPos], [1, rPos], 'E');
    newCP3.createCornerDiagonal();
    newCP3.createPoint(findIntersection([[0, lPos], [1, rPos]], [[0, 0], [1, 1]]));
    arr.push(newCP3);
}

function findIntersection(a, b) {
    const [[x1, y1], [x2, y2]] = a;
    const [[x3, y3], [x4, y4]] = b;
    const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const n_A = (x1 * y2 - y1 * x2);
    const n_B = (x3 * y4 - y3 * x4);
    const x = (n_A * (x3 - x4) - (x1 - x2) * n_B) / d;
    const y = (n_A * (y3 - y4) - (y1 - y2) * n_B) / d;
    return [x, y];
}

function findGCD(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
function simplifyFraction(n, d) {
    let simplified = false;
    let gcd = findGCD(n, d);
    if (gcd !== 1) {
        simplified = true;
        n /= gcd;
        d /= gcd;
    }
    notice = document.getElementById('notice');
    if (simplified === true) {
        notice.textContent = "Fraction simplified to " + n + "/" + d;
    }
    else { notice.textContent = ""; }
    return [n, d];
}

function generateBinary(a, b) {
    [a, b] = simplifyFraction(a, b);
    console.log(a, b);
    if (a / b === 0.5) {
        return ['0', '0'];
    }
    let p = 1;
    while (p < a || p < b - a) { p *= 2; }
    console.log(p);
    let mBin, nBin;
    let m = a;
    let n = p + a - b;
    let p_m = p;
    let p_n = n === 0 ? 1 : p;
    while (m % 2 === 0 && m > 0) {
        m = Math.floor(m / 2);
        p_m = Math.floor(p_m / 2);
    }
    while (n % 2 === 0 && n > 0) {
        n = Math.floor(n / 2);
        p_n = Math.floor(p_n / 2);
    }
    console.log(p_m, p_n);
    console.log(n);
    mBin = p_m !== 1 ? m.toString(2).padStart(Math.log2(p_m), '0') : "";
    if (mBin.length > 1) {
        mBin = mBin.slice(0, -1) + '0';
    }
    nBin = n !== 0 ? n.toString(2).padStart(Math.log2(p_n), '0') : "";

    if (nBin.length > 1) {
        nBin = nBin.slice(0, -1) + '0';
    }
    console.log("m:", m, p_m, mBin);
    console.log("n:", n, p_n, nBin);
    return [mBin, nBin];
}