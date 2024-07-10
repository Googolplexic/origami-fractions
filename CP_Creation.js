class CP {
    #ns = 'http://www.w3.org/2000/svg';
    #square;
    #svg;
    constructor(size, svg) {
        this.#svg = svg;
        this.size = size;
        this.#square = this.#createCentredSquare(size);
        this.#svg.appendChild(this.#square);
        console.log("done");
    }

    drawCornerDiagonal() {
        this.#drawDiagonalInSquare([0, 0], [1, 1], this.#square, 'grey', 'solid');
    }

    drawCrease(a, b, dir, type) {
        let colour;
        switch (dir) {
            case 'M':
                colour = 'red';
                break;
            case 'V':
                colour = 'blue';
                break;
            case 'E':
                colour = 'grey';
                break;
        }
        this.#drawDiagonalInSquare(a, b, this.#square, colour, type);
    }

    #createCentredSquare(size) {
        const square = document.createElementNS(this.#ns, 'rect');
        const vBox = this.#svg.getAttribute('viewBox').split(' ').map(Number);
        const vBoxSize = Math.min(vBox[2], vBox[3]);
        square.setAttribute('width', size);
        square.setAttribute('height', size);
        square.setAttribute('x', (vBoxSize - size) / 2);  // Centering within the viewBox
        square.setAttribute('y', (vBoxSize - size) / 2);  // Centering within the viewBox
        square.setAttribute('fill', 'none');
        square.setAttribute('stroke', 'gray');
        square.setAttribute('size', size);
        return square;
    }

    #drawDiagonalInSquare(a, b, square, colour, type) {
        const line = document.createElementNS(this.#ns, 'line');
        const size = parseFloat(square.getAttribute('size'));

        // Calculate relative coordinates within the viewBox
        let x1 = parseFloat(square.getAttribute('x')) + a[0] * size;
        let y1 = parseFloat(square.getAttribute('y')) + a[1] * size;
        let x2 = parseFloat(square.getAttribute('x')) + b[0] * size;
        let y2 = parseFloat(square.getAttribute('y')) + b[1] * size;

        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', colour);
        if (type === 'dashed') {
            line.setAttribute('stroke-dasharray', '5,5');
        }
        this.#svg.appendChild(line);
    }
}
