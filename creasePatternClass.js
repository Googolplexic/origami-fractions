class CP {
    #ns = 'http://www.w3.org/2000/svg';
    #square;
    #svg;
    #shapeArray = [];
    constructor(size, svg) {
        this.#svg = svg;
        this.size = size;
        this.#square = this.#createCentredSquare(size);
    }

    drawCP() {
        this.#shapeArray.push(this.#square);
        this.#shapeArray.sort(this.#sort);
        for (const shape of this.#shapeArray) {
            this.#svg.appendChild(shape);
        }
    }

    createCornerDiagonal() {
        this.#createLineInSquare([0, 0], [1, 1], this.#square, 'grey', 'solid');
    }
    createPoint(loc) {
        this.#createCircleInSquare(loc, this.#square, '0.7%', 'black');

    }
    createCrease(a, b, dir, type) {
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
            default:
                colour = 'grey';
                break;
        }
        this.#createLineInSquare(a, b, this.#square, colour, type);
    }

    createHorizontalPinch(y, side) {
        if (side === 'left') {
            this.createCrease([0, y], [0.2, y], 'V', 'dashed');
        }
        else {
            this.createCrease([1, y], [0.8, y], 'V', 'dashed');
        }

    }
    #sort(a, b) {
        const order = {
            'line': 1,
            'rect': 2,
            'circle': 3
        };
        let orderA = order[a.tagName] || Infinity;
        let orderB = order[b.tagName] || Infinity;

        return orderA - orderB;
    }

    #createCentredSquare(size) {
        const square = document.createElementNS(this.#ns, 'rect');
        const vBox = this.#svg.getAttribute('viewBox').split(' ').map(Number);
        const vBoxSize = Math.min(vBox[2], vBox[3]);
        square.setAttribute('width', size);
        square.setAttribute('height', size);
        square.setAttribute('x', (vBoxSize - size) / 2);
        square.setAttribute('y', (vBoxSize - size) / 2);
        square.setAttribute('fill', 'none');
        square.setAttribute('stroke', 'gray');
        square.setAttribute('size', size);
        return square;
    }

    #createLineInSquare(a, b, square, colour, type) {
        const line = document.createElementNS(this.#ns, 'line');
        const size = parseFloat(square.getAttribute('size'));

        let x1 = parseFloat(square.getAttribute('x')) + a[0] * size;
        let y1 = parseFloat(square.getAttribute('y')) + size - a[1] * size;
        let x2 = parseFloat(square.getAttribute('x')) + b[0] * size;
        let y2 = parseFloat(square.getAttribute('y')) + size - b[1] * size;

        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', colour);
        if (type === 'dashed') {
            line.setAttribute('stroke-dasharray', '2%');
        }
        this.#shapeArray.push(line);
    }

    #createCircleInSquare(loc, square, radius, colour) {
        const circle = document.createElementNS(this.#ns, 'circle');
        const size = parseFloat(square.getAttribute('size'));

        let x = parseFloat(square.getAttribute('x')) + loc[0] * size;
        let y = parseFloat(square.getAttribute('y')) + size - loc[1] * size;
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', colour);
        circle.setAttribute('stroke', colour);
        this.#shapeArray.push(circle);
    }
}

