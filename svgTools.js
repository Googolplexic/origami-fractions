const map = new Map();

function setupSVG(svgDiv, event) {
    event.preventDefault();
    let a = parseInt(document.getElementById('a').value);
    let b = parseInt(document.getElementById('b').value);
    if (a >= b) {
        alert("Numerator must be less than the denominator");
        return [0, 0, 0];
    }
    let previous = svgDiv.getElementsByClassName('previous')[0];
    let next = svgDiv.getElementsByClassName('next')[0];
    let svg = svgDiv.getElementsByClassName('svgCanvas')[0];
    let notice = svgDiv.getElementsByClassName('notice')[0];
    svg.setAttribute('display', 'block');
    previous.style.display = "inline-block";
    next.style.display = "inline-block";
    var vBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const size = Math.min(vBox[2], vBox[3]) * 0.9;
    return [svg, a, b, previous, next, size, notice];
}

function crossingDiagonals(svgDiv, event) {
    console.log(svgDiv);
    event.preventDefault();
    const [svg, a, b, previous, next, size, notice] = setupSVG(svgDiv, event);
    if (a === 0) { return; }
    CP_array = generateCrossingDiagonals(svg, size, a, b, notice);
    map.set(svg.id, CP_array);
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
