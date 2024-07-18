function generateCrossingDiagonals(svg, size, n, d, notice) {
    [a, b] = crossingDiagonalsBinary(n, d, notice);
    a = a.split('').reverse().join('');
    b = b.split('').reverse().join('');
    console.log(a, b);
    const CP_Array = [];
    let lPoint = crossingDiagonalsLeft(CP_Array, a, size, svg);
    if (a !== b) {
        let rPoint = crossingDiagonalsRight(CP_Array, b, lPoint, size, svg);
        crossingDiagonalsDiagonals(CP_Array, lPoint, rPoint, size, svg);
    }
    else {
        let newCP = new CP(size, svg);
        newCP.createCrease([0, lPoint], [1, lPoint], 'E');
        CP_Array.push(newCP);
    }
    console.log(CP_Array.length);
    return CP_Array;
}

function crossingDiagonalsLeft(arr, left, size, svg) {
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

function crossingDiagonalsRight(arr, right, lPos, size, svg) {
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
        if (lPos !== 1) { newCP.createCrease([0, lPos], [0.2, lPos], 'E'); }
        if (oldYPos !== 1) { newCP.createCrease([1, oldYPos], [0.8, oldYPos], 'E'); }
        newCP.createPoint([1, oldYPos]);
        newCP.createPoint([1, (x === '0' ? 0 : 1)]);
        newCP.createArrow((x === '0' ? 0 : 1), oldYPos, 1);
        arr.push(newCP);
    }
    return yPos == 1 ? 0 : yPos;

}

function crossingDiagonalsDiagonals(arr, lPos, rPos, size, svg) {
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




function crossingDiagonalsBinary(a, b) {
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
    let mGCD = findGCD(m, p_m);
    m /= mGCD;
    p_m /= mGCD;
    let nGCD = findGCD(n, p_n);
    n /= nGCD;
    p_n /= nGCD;
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