const map = new Map();

function setupSVG(svg, previous, next, event) {
    event.preventDefault();
    let a = parseInt(document.getElementById('a').value);
    let b = parseInt(document.getElementById('b').value);
    if (a >= b) {
        alert("Numerator must be less than the denominator");
        return [0, 0, 0];
    }
    svg.setAttribute('display', 'block');
    previous.style.display = "inline-block";
    next.style.display = "inline-block";
    var vBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const size = Math.min(vBox[2], vBox[3]) * 0.9;
    return [a, b, size];
}

function crossingDiagonals(svg, previous, next, event) {
    event.preventDefault();
    const [a, b, size] = setupSVG(svg, previous, next, event);
    if (a === 0) { return; }
    console.log("sdf");
    CP_array = generateCrossingDiagonals(svg, size, a, b);
    map.set(svg.id, CP_array);
    svg.innerHTML = "";
    CP_array[0].drawCP();
    svg.setAttribute('index', 0);

    function getPrevious() {
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

    function getNext() {
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

    previous.onclick = function (event) {
        event.preventDefault();
        getPrevious();
    };
    next.onclick = function (event) {
        event.preventDefault();
        getNext();
    };
}

