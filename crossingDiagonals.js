function generateCrossingDiagonals(svg, size, numerator, denominator) {
    [leftBinary, rightBinary] = crossingDiagonalsBinary(numerator, denominator);
    leftBinary = leftBinary.split('').reverse().join('');
    rightBinary = rightBinary.split('').reverse().join('');
    const creasePatternArray = [];
    const lastLeftFoldY = crossingDiagonalsLeft(creasePatternArray, leftBinary, size, svg);
    if (leftBinary !== rightBinary) {
        const lastRightFoldY = crossingDiagonalsRight(creasePatternArray, rightBinary, lastLeftFoldY, size, svg);
        crossingDiagonalsDiagonals(creasePatternArray, lastLeftFoldY, lastRightFoldY, size, svg);
    }
    else {
        let newCreasePattern = new CreasePattern(size, svg);
        newCreasePattern.createCrease([0, lastLeftFoldY], [1, lastLeftFoldY], 'E');
        creasePatternArray.push(newCreasePattern);
    }
    return creasePatternArray;
}

function crossingDiagonalsLeft(creasePatternArray, leftBinary, size, svg) {
    let currentY = 1;
    if (leftBinary === '1') { currentY = 0; }
    for (let i = 0; i < leftBinary.length; i++) {
        let previousY = currentY;
        let newCreasePattern = new CreasePattern(size, svg);
        x = leftBinary[i];

        if (x === '0') {
            currentY /= 2;
        }
        else {
            currentY = (1 + currentY) / 2;
        }

        newCreasePattern.createHorizontalPinch(currentY, 'left', 0.2);
        if (previousY !== 1) { newCreasePattern.createCrease([0, previousY], [0.2, previousY], 'E'); }
        newCreasePattern.createPoint([0, previousY]);
        newCreasePattern.createPoint([0, (x === '0' ? 0 : 1)]);
        newCreasePattern.createVerticalArrow((x === '0' ? 0 : 1), previousY, 'L');
        creasePatternArray.push(newCreasePattern);
    }
    return currentY;

}

function crossingDiagonalsRight(creasePatternArray, rightBinary, lastLeftFoldY, size, svg) {
    let currentY = 1;
    if (rightBinary.length === 1) { currentY = 0; }
    for (let i = 0; i < rightBinary.length; i++) {
        let previousY = currentY;
        let newCreasePattern = new CreasePattern(size, svg);
        x = rightBinary[i];

        if (x === '0') {
            currentY /= 2;
        }
        else {
            currentY = (1 + currentY) / 2;
        }

        newCreasePattern.createHorizontalPinch(currentY, 'rightBinary', 0.2);
        if (lastLeftFoldY !== 1) { newCreasePattern.createCrease([0, lastLeftFoldY], [0.2, lastLeftFoldY], 'E'); }
        if (previousY !== 1) { newCreasePattern.createCrease([1, previousY], [0.8, previousY], 'E'); }
        newCreasePattern.createPoint([1, previousY]);
        newCreasePattern.createPoint([1, (x === '0' ? 0 : 1)]);
        newCreasePattern.createVerticalArrow(x === '0' ? 0 : 1, previousY, 'R');
        creasePatternArray.push(newCreasePattern);
    }
    return currentY == 1 ? 0 : currentY;

}

function crossingDiagonalsDiagonals(creasePatternArray, lastLeftFoldY, lastRightFoldY, size, svg) {
    let newCreasePattern1 = new CreasePattern(size, svg);
    if (lastLeftFoldY !== 1) { newCreasePattern1.createCrease([0, lastLeftFoldY], [0.2, lastLeftFoldY], 'E'); }
    if (lastRightFoldY !== 0) { newCreasePattern1.createCrease([1, lastRightFoldY], [0.8, lastRightFoldY], 'E'); };
    newCreasePattern1.createCrease([0, lastLeftFoldY], [1, lastRightFoldY], 'V', 'dashed');
    newCreasePattern1.createPoint([0, lastLeftFoldY]);
    newCreasePattern1.createPoint([1, lastRightFoldY]);
    creasePatternArray.push(newCreasePattern1);

    let newCreasePattern2 = new CreasePattern(size, svg);
    newCreasePattern2.createCrease([0, lastLeftFoldY], [1, lastRightFoldY], 'E');
    newCreasePattern2.createCrease([0, 0], [1, 1], 'V', 'dashed');
    creasePatternArray.push(newCreasePattern2);

    let newCreasePattern3 = new CreasePattern(size, svg);
    newCreasePattern3.createCrease([0, lastLeftFoldY], [1, lastRightFoldY], 'E');
    newCreasePattern3.createCornerDiagonal();
    newCreasePattern3.createPoint(findIntersection([[0, lastLeftFoldY], [1, lastRightFoldY]], [[0, 0], [1, 1]]));
    creasePatternArray.push(newCreasePattern3);
}




function crossingDiagonalsBinary(numerator, denominator) {
    if (numerator / denominator === 0.5) {
        return ['0', '0'];
    }
    let power = 1;
    while (power < numerator || power < denominator - numerator) { power *= 2; }

    let leftBinary, rightBinary;
    let left = numerator;
    let right = power + numerator - denominator;
    let leftPower = power;
    let rightPower = right === 0 ? 1 : power;
    const leftGCD = findGCD(left, leftPower);
    left /= leftGCD;
    leftPower /= leftGCD;
    const rightGCD = findGCD(right, rightPower);
    right /= rightGCD;
    rightPower /= rightGCD;

    leftBinary = leftPower !== 1 ? left.toString(2).padStart(Math.log2(leftPower), '0') : "";
    if (leftBinary.length > 1) {
        leftBinary = leftBinary.slice(0, -1) + '0';
    }
    rightBinary = right !== 0 ? right.toString(2).padStart(Math.log2(rightPower), '0') : "";

    if (rightBinary.length > 1) {
        rightBinary = rightBinary.slice(0, -1) + '0';
    }

    return [leftBinary, rightBinary];
}