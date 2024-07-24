function findIntersection(lineA, lineB) {
    const [[x1, y1], [x2, y2]] = lineA;
    const [[x3, y3], [x4, y4]] = lineB;
    const constant = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const constantA = (x1 * y2 - y1 * x2);
    const constantB = (x3 * y4 - y3 * x4);
    const x = (constantA * (x3 - x4) - (x1 - x2) * constantB) / constant;
    const y = (constantA * (y3 - y4) - (y1 - y2) * constantB) / constant;
    return [x, y];
}

function findGCD(numerator, denominator) {
    while (denominator) {
        let temp = denominator;
        denominator = numerator % denominator;
        numerator = temp;
    }
    return numerator;
}

function simplifyFraction(numerator, denominator, notice) {
    let changed = false;
    let gcd = findGCD(numerator, denominator);
    if (gcd !== 1) {
        changed = true;
        numerator /= gcd;
        denominator /= gcd;
    }
    if (denominator - numerator < numerator) {
        numerator = denominator - numerator;
        changed = true;
    }
    if (changed) {
        notice.textContent = "Fraction changed to " + numerator + "/" + denominator;
        notice.style.display = 'block';
    }
    else { notice.textContent = ""; notice.style.display = 'none'; }
    return [numerator, denominator];
}