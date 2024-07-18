const map = new Map();


function setupSVG(svgDiv) {

    let a = parseInt(document.getElementById('a').value);
    let b = parseInt(document.getElementById('b').value);
    let previous = svgDiv.getElementsByClassName('previous')[0];
    let next = svgDiv.getElementsByClassName('next')[0];
    let svg = svgDiv.getElementsByClassName('svgCanvas')[0];
    let title = svgDiv.getElementsByClassName('title')[0];
    svgDiv.style.display = "flex";
    var vBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const size = Math.min(vBox[2], vBox[3]) * 0.9;
    return [svg, a, b, previous, next, size, notice, title];
}

function crossingDiagonals(svgDiv) {
    const [svg, a, b, previous, next, size, title] = setupSVG(svgDiv);
    if (a === 0) { return; }
    CP_array = generateCrossingDiagonals(svg, size, a, b);
    map.set(svg.id, CP_array);
    title.textContent = `Crossing Diagonals: ${CP_array.length - 1} folds`;
    svg.innerHTML = "";
    CP_array[0].drawCP();
    svg.setAttribute('index', 0);


    previous.onclick = function () {
        getPrevious(svg);
    };
    next.onclick = function () {
        getNext(svg);
    };
}

function fujimotoConstruction(svgDiv) {

    const [svg, a, b, previous, next, size, title] = setupSVG(svgDiv);
    if (a === 0) { return; }
    CP_array = generateFujimotoConstruction(svg, size, a, b);
    map.set(svg.id, CP_array);
    title.textContent = `Fujimoto's Construction: ${CP_array.length - 1} folds`;
    svg.innerHTML = "";
    CP_array[0].drawCP();
    svg.setAttribute('index', 0);


    previous.onclick = function () {
        getPrevious(svg);
    };
    next.onclick = function () {
        getNext(svg);
    };
}


function getPrevious(svg) {
    let array = map.get(svg.id);

    let idx = (svg.getAttribute('index'));
    if (idx > 0) {
        idx--;
        svg.setAttribute('index', idx);
    }
    if (idx >= 0 && array.length > 0) {
        svg.innerHTML = "";
        array[idx].drawCP();
    }
}

function getNext(svg) {
    let array = map.get(svg.id);
    let idx = svg.getAttribute('index');

    if (idx < array.length - 1) {
        idx++;
        svg.setAttribute('index', idx);
    }
    if (idx >= 0 && array.length > 0) {
        svg.innerHTML = "";
        array[idx].drawCP();
    }
}


