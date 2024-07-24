const map = new Map();


function setupSVG(svgDiv) {

    let previous = svgDiv.getElementsByClassName('previous')[0];
    let next = svgDiv.getElementsByClassName('next')[0];
    let svg = svgDiv.getElementsByClassName('svgCanvas')[0];
    let title = svgDiv.getElementsByClassName('title')[0];
    svgDiv.style.display = "flex";
    var vBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const size = Math.min(vBox[2], vBox[3]) * 0.9;
    return [svg, previous, next, size, title];
}

function crossingDiagonals(svgDiv, numerator, denominator) {
    const [svg, previous, next, size, title] = setupSVG(svgDiv);
    if (numerator === 0) { return; }
    creasePatternArray = generateCrossingDiagonals(svg, size, numerator, denominator);
    map.set(svg.id, creasePatternArray);
    title.textContent = `Crossing Diagonals: ${creasePatternArray.length - 1} folds`;
    svg.innerHTML = "";
    creasePatternArray[0].drawCreasePattern();
    svg.setAttribute('index', 0);


    previous.onclick = function () {
        getPrevious(svg);
    };
    next.onclick = function () {
        getNext(svg);
    };
}

function fujimotoConstruction(svgDiv, numerator, denominator) {

    const [svg, previous, next, size, title] = setupSVG(svgDiv);
    if (numerator === 0) { return; }
    creasePatternArray = generateFujimotoConstruction(svg, size, numerator, denominator);
    map.set(svg.id, creasePatternArray);
    title.textContent = `Fujimoto's Construction: ${creasePatternArray.length - 1} folds`;
    svg.innerHTML = "";
    creasePatternArray[0].drawCreasePattern();
    svg.setAttribute('index', 0);


    previous.onclick = function () {
        getPrevious(svg);
    };
    next.onclick = function () {
        getNext(svg);
    };
}


function getPrevious(svg) {
    let creasePatternArray = map.get(svg.id);

    let idx = (svg.getAttribute('index'));
    if (idx > 0) {
        idx--;
        svg.setAttribute('index', idx);
    }
    if (idx >= 0 && creasePatternArray.length > 0) {
        svg.innerHTML = "";
        creasePatternArray[idx].drawCreasePattern();
    }
}

function getNext(svg) {
    let creasePatternArray = map.get(svg.id);
    let idx = svg.getAttribute('index');

    if (idx < creasePatternArray.length - 1) {
        idx++;
        svg.setAttribute('index', idx);
    }
    if (idx >= 0 && creasePatternArray.length > 0) {
        svg.innerHTML = "";
        creasePatternArray[idx].drawCreasePattern();
    }
}


