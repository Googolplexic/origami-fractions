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

    createHorizontalPinch(y, side, length) {
        if (side === 'left') {
            this.createCrease([0, y], [length, y], 'V', 'dashed');
        }
        else {
            this.createCrease([1, y], [1 - length, y], 'V', 'dashed');
        }

    }

    createVerticalArrow(y1, y2, curveDir) {
        if (curveDir === 'L') {
            if (y2 > y1) {
                this.#createVerticalCurvedArrow([0, y1], [0, y2], this.#square, [0.05, 0.05], [0.05, -0.05], 'L');
            }
            else {
                this.#createVerticalCurvedArrow([0, y1], [0, y2], this.#square, [0.05, -0.05], [0.05, 0.05], 'L');
            }
        }
        else {
            if (y2 > y1) {
                this.#createVerticalCurvedArrow([1, y1], [1, y2], this.#square, [-0.05, 0.05], [-0.05, -0.05], 'R');
            }
            else {
                this.#createVerticalCurvedArrow([1, y1], [1, y2], this.#square, [-0.05, -0.05], [-0.05, 0.05], 'R');
            }

        }
    }


    createArrow(a, b, aOffset, bOffset, dir) {
        this.#createVerticalCurvedArrow(a, b, this.#square, aOffset, bOffset, dir);
    }
    distance(a, b) {
        return this.#distanceInSquare(this.#square, this.#squareSize(this.#square), a, b);
    }

    #squareSize(square) {
        return parseFloat(square.getAttribute('size'));
    }
    #findY(square, size, y) {
        return parseFloat(square.getAttribute('y')) + size - y * size;
    }

    #findX(square, size, x) {
        return parseFloat(square.getAttribute('y')) + x * size;
    }

    #distanceInSquare(square, size, a, b) {

        let x1 = this.#findX(square, size, a[0]);
        let y1 = this.#findY(square, size, a[1]);
        let x2 = this.#findX(square, size, b[0]);
        let y2 = this.#findY(square, size, b[1]);

        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    }

    #sort(a, b) {
        const order = {
            'line': 1,
            'rect': 2,
            'circle': 3,
            'path': 4,
            'marker': 5
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
        const size = this.#squareSize(this.#square);

        let x1 = this.#findX(square, size, a[0]);
        let y1 = this.#findY(square, size, a[1]);
        let x2 = this.#findX(square, size, b[0]);
        let y2 = this.#findY(square, size, b[1]);

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
        const size = this.#squareSize(this.#square);

        let x = this.#findX(square, size, loc[0]);
        let y = this.#findY(square, size, loc[1]);
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', colour);
        circle.setAttribute('stroke', colour);
        this.#shapeArray.push(circle);
    }

    #createVerticalCurvedArrow(a, b, square, aOffset, bOffset, dir) {
        const size = this.#squareSize(this.#square);
    
        let x1 = this.#findX(square, size, a[0]);
        let y1 = this.#findY(square, size, a[1]);
        let x2 = this.#findX(square, size, b[0]);
        let y2 = this.#findY(square, size, b[1]);
        x1 += size * aOffset[0];
        y1 -= size * aOffset[1];
        x2 += size * bOffset[0];
        y2 -= size * bOffset[1];

        const marker = document.createElementNS(this.#ns, 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', size * 0.1);
        marker.setAttribute('markerHeight', size * 0.07);
        marker.setAttribute('refX', size * 0.03);
        marker.setAttribute('refY', size * 0.028);
        marker.setAttribute('orient', 'auto');

        const arrowhead = document.createElementNS(this.#ns, 'polygon');
        arrowhead.setAttribute('points', `0 0, ${size * 0.05} ${size * 0.025}, 0 ${size * 0.05}`);
        arrowhead.setAttribute('fill', '#444444');

        marker.appendChild(arrowhead);

        this.#shapeArray.push(marker);
        const distance = this.distance(a, b);
        const slope = -(b[0] - a[0]) / (b[1] - a[1]);
        let xq, yq;

        if (slope > 0) {
            xq = (x1 + x2) / 2 + (dir === 'L' ? -distance * 0.2 : distance * 0.2) / Math.sqrt(1 + slope ** 2);
            yq = (y1 + y2) / 2 - (dir === 'L' ? -distance * 0.2 : distance * 0.2) * slope / Math.sqrt(1 + slope ** 2);
        }
        else {
            xq = (x1 + x2) / 2 - (dir === 'L' ? -distance * 0.2 : distance * 0.2) / Math.sqrt(1 + slope ** 2);
            yq = (y1 + y2) / 2 + (dir === 'L' ? -distance * 0.2 : distance * 0.2) * slope / Math.sqrt(1 + slope ** 2);
        }
        const path = document.createElementNS(this.#ns, 'path');
        const pathdata = `M ${x1} ${y1} Q ${xq} ${yq}, ${x2} ${y2}`;
        path.setAttribute('d', pathdata);
        path.setAttribute('stroke', '#444444');
        path.setAttribute('stroke-width', '0.8%');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#arrowhead)');


        this.#shapeArray.push(path);

    }
}

