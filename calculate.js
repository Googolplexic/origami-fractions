function generateCP(svg, size) {
    let a = parseInt(document.getElementById('a').value);
    let b = parseInt(document.getElementById('b').value);
    [a, b] = generateBinary(a, b);
    a = a.split('').reverse().join('');
    b = b.split('').reverse().join('');
    console.log(a, b);
    const CP_Array = [];
    CP_Array.push(new CP(size, svg));
    let lastPoint = generateLeft(CP_Array, a, size, svg);
    console.log(CP_Array.length);
}

function generateLeft(arr, left, size, svg) {
    let yPos = 1;
    for (let i = 0; i < left.length; i++) {
        let oldYPos = yPos;
        let newCP = new CP(size, svg);
        x = left[i];
        if (x === 0) {
            yPos /= 2;
        }
        else {
            yPos = (1 + yPos) / 2;
        }
        newCP.createHorizontalPinch(yPos);

    }

}

function simplifyFraction(n, d) {
    let simplified = false;
    for (let i = n; i > 1; i--) {
        if (d % i == 0 && n % i == 0) {
            n = Math.floor(n / i);
            d = Math.floor(d / i);
            simplified = true;
        }
    }
    if (simplified === true) {
        notice = document.getElementById('notice');
        notice.textContent = "Fraction simplified to " + n + "/" + d;
    }
    return [n, d];
}

function generateBinary(a, b) {
    [a, b] = simplifyFraction(a, b);
    console.log(a, b);
    let p = 2;
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
    mBin = m.toString(2).padStart(Math.log2(p_m), '0').slice(0, -1) + '0';
    nBin = n !== 0 ? n.toString(2).padStart(Math.log2(p_n), '0').slice(0, -1) + '0' : "";
    console.log("m:", m, p_m, mBin);
    console.log("n:", n, p_n, nBin);
    return [mBin, nBin];
}