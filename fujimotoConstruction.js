function generateFujimotoConstruction(svg, size, numerator, denominator) {
    [leftBinary, rightBinary] = fujimotoBinary(numerator, denominator);
    leftBinary = leftBinary.split('').reverse().join('');
    rightBinary = rightBinary.split('').reverse().join('');

    const creasePatternArray = [];
    const [lastLeftFoldY, pointToFoldToX] = fujimotoLeft(creasePatternArray, leftBinary, size, svg);
    if (rightBinary !== '') {
        const firstPoint = foldOnLine(creasePatternArray, lastLeftFoldY, pointToFoldToX, size, svg);
        const [initialRightFoldY, linePoint1, linePoint2] = foldSecond(creasePatternArray, firstPoint, size, svg);
        fujimotoRight(creasePatternArray, initialRightFoldY, rightBinary, linePoint1, linePoint2, size, svg);
    }
    else {
        let newCreasePattern = new CreasePattern(size, svg);
        newCreasePattern.createCrease([0, lastLeftFoldY], [1, lastLeftFoldY], 'E');
        creasePatternArray.push(newCreasePattern);
    }

    return creasePatternArray;
}


function fujimotoLeft(creasePatternArray, leftBinary, size, svg) {

    let currentY = 1;
    let pointToFoldToX;
    if (leftBinary.length === 1) { currentY = 0; }
    for (let i = 0; i < leftBinary.length; i++) {
        let previousY = currentY;
        let newCreasePattern = new CreasePattern(size, svg);
        currentFoldDirection = leftBinary[i];

        if (currentFoldDirection === '0') {
            currentY /= 2;
        }
        else {
            currentY = (1 + currentY) / 2;
        }

        if (i + 1 === leftBinary.length) {
            const a = 1;
            const b = -2;
            const c = currentY ** 2;
            pointToFoldToX = quadraticEquation(a, b, c)[1];

            newCreasePattern.createHorizontalPinch(currentY, 'leftBinary', (pointToFoldToX <= 0.8) ? pointToFoldToX + 0.2 : 1);
        }
        else { newCreasePattern.createHorizontalPinch(currentY, 'leftBinary', 0.2); };

        newCreasePattern.createCrease([0, previousY], [0.2, previousY], 'E');

        newCreasePattern.createPoint([0, previousY]);
        newCreasePattern.createPoint([0, (currentFoldDirection === '0' ? 0 : 1)]);
        newCreasePattern.createVerticalArrow((currentFoldDirection === '0' ? 0 : 1), previousY, 'L');
        creasePatternArray.push(newCreasePattern);
    }
    return [currentY, pointToFoldToX];

}

function foldOnLine(creasePatternArray, lastLeftFoldY, pointToFoldToX, size, svg) {
    let newCreasePattern = new CreasePattern(size, svg);

    const topFoldX = (lastLeftFoldY - pointToFoldToX) / (1 - pointToFoldToX);
    newCreasePattern.createCrease([0, lastLeftFoldY], [(pointToFoldToX <= 0.8) ? pointToFoldToX + 0.2 : 1, lastLeftFoldY], 'E');

    newCreasePattern.createCrease([topFoldX, 1], [1, 0], 'V', 'dashed');
    newCreasePattern.createPoint([1, 1]);
    newCreasePattern.createPoint([pointToFoldToX, lastLeftFoldY]);
    newCreasePattern.createArrow([1, 1], [pointToFoldToX, lastLeftFoldY], [-0.05, -0.03], [0.02, 0.05], 'R');
    creasePatternArray.push(newCreasePattern);
    return topFoldX;
}


function foldSecond(creasePatternArray, topFoldX, size, svg) {
    let newCreasePattern = new CreasePattern(size, svg);
    newCreasePattern.createCrease([topFoldX, 1], [1, 0], 'E');
    const newFoldSlope = 1 - topFoldX;
    const oldFoldMidpoint = (1 + topFoldX) / 2;
    const initialRightFoldY = newFoldSlope * ((1 - topFoldX) / 2) + 0.5;

    pinchFoldX = oldFoldMidpoint - 0.1 / Math.sqrt(1 + newFoldSlope ** 2);
    pinchFoldY = 0.5 - 0.1 * newFoldSlope / Math.sqrt(1 + newFoldSlope ** 2);
    newCreasePattern.createCrease([pinchFoldX, pinchFoldY], [1, initialRightFoldY], 'V', 'dashed');
    newCreasePattern.createPoint([1, 0]);
    newCreasePattern.createPoint([topFoldX, 1]);
    newCreasePattern.createArrow([1, 0], [topFoldX, 1], [-0.05, 0.02], [0, -0.05], 'L');
    creasePatternArray.push(newCreasePattern);
    return [initialRightFoldY, [pinchFoldX, pinchFoldY], [1, initialRightFoldY]];
}

function fujimotoRight(creasePatternArray, initialRightFoldY, rightBinary, linePoint1, linePoint2, size, svg) {
    let currentY = initialRightFoldY;

    for (let i = 0; i < rightBinary.length; i++) {
        let previousY = currentY;
        let newCreasePattern = new CreasePattern(size, svg);
        currentFoldDirection = rightBinary[i];

        if (currentFoldDirection === '0') {
            currentY /= 2;
        }
        else {
            currentY = (initialRightFoldY + currentY) / 2;
        }
        if (i !== 0) { newCreasePattern.createCrease([1, previousY], [0.8, previousY], 'E'); }

        newCreasePattern.createCrease(linePoint1, linePoint2, 'E');
        newCreasePattern.createHorizontalPinch(currentY, 'rightBinary', 0.2);
        newCreasePattern.createPoint([1, previousY]);
        newCreasePattern.createPoint([1, (currentFoldDirection === '0' ? 0 : initialRightFoldY)]);
        newCreasePattern.createVerticalArrow(currentFoldDirection === '0' ? 0 : initialRightFoldY, previousY, 'R');
        creasePatternArray.push(newCreasePattern);
    }
    let lastCreasePattern = new CreasePattern(size, svg);
    lastCreasePattern.createCrease([0, currentY], [1, currentY], 'E');

    creasePatternArray.push(lastCreasePattern);

}


function quadraticEquation(a, b, c) {
    const determinant = b ** 2 - 4 * a * c;
    if (determinant < 0) { return [NaN, NaN]; }
    return [(-b + Math.sqrt(determinant)) / 2 * a, (-b - Math.sqrt(determinant)) / 2 * a];
}

function fujimotoBinary(numerator, denominator) {
    let power = 1;
    while (power < denominator) { power *= 2; }
    if (power > 1) { power /= 2; }

    let leftBinary, rightBinary;
    let left = parseInt(denominator - power);
    if (left === power) {
        let nBinary = power !== 1 ? numerator.toString(2).padStart(Math.log2(power) + 1, '0') : '0';
        nBinary = nBinary.slice(0, -1) + '0';

        return [nBinary, ''];

    }
    let right = parseInt(numerator);
    let leftPower = power;
    let rightPower = power;

    let leftGCD = findGCD(left, leftPower);

    left /= leftGCD;
    leftPower /= leftGCD;
    let rightGCD = findGCD(right, rightPower);
    right /= rightGCD;
    rightPower /= rightGCD;

    leftBinary = leftPower !== 1 ? left.toString(2).padStart(Math.log2(leftPower), '0') : "";
    if (leftBinary.length > 1) {
        leftBinary = leftBinary.slice(0, -1) + '0';
    }
    rightBinary = rightPower !== 1 ? right.toString(2).padStart(Math.log2(rightPower), '0').slice(0, -1) + '0' : "";

    return [leftBinary, rightBinary];
}