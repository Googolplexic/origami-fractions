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

function simplifyFraction(n, d, notice) {
    let simplified = false;
    let gcd = findGCD(n, d);
    if (gcd !== 1) {
        simplified = true;
        n /= gcd;
        d /= gcd;
    }
    if (d - n < n) {
        n = d - n;
        simplified = true;
    }
    if (simplified === true) {
        notice.textContent = "Fraction changed to " + n + "/" + d;
        notice.style.display = 'block';
    }
    else { notice.textContent = ""; notice.style.display = 'none'; }
    return [n, d];
}