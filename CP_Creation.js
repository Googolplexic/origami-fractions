
class CP {
    #ns = 'http://www.w3.org/2000/svg';
    #square;
    constructor(size, div) {
        this.div = div;
        this.size = size;
        this.#square = this.#createCentredSquare(size);
        div.appendChild(this.#square);
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
        square.setAttribute('width', size);
        square.setAttribute('height', size);
        square.setAttribute('x', div.getAttribute('width') / 2 - square.getAttribute('width') / 2);
        square.setAttribute('y', div.getAttribute('height') / 2 - square.getAttribute('height') / 2);
        square.setAttribute('fill', 'none');
        square.setAttribute('stroke', 'gray');
        square.setAttribute('size', size);
        return square;
    }

    #getCornerCoords(quadrant, square) {

        const width = parseInt(div.getAttribute('width'), 10);
        const height = parseInt(div.getAttribute('height'), 10);

        switch (quadrant) {
            case 1:
                return [(width + square.getAttribute('size')) / 2, (height - square.getAttribute('size')) / 2];
            case 2:
                return [(width - square.getAttribute('size')) / 2, (height - square.getAttribute('size')) / 2];
            case 3:
                return [(width - square.getAttribute('size')) / 2, (height + square.getAttribute('size')) / 2];
            case 4:
                return [(width + square.getAttribute('size')) / 2, (height + square.getAttribute('size')) / 2];
        }
    }

    #getCoordsInSquare(a, square) {
        let x = this.#getCornerCoords(3, square)[0] + a[0] * square.getAttribute('size');
        let y = this.#getCornerCoords(2, square)[1] + (1 - a[1]) * square.getAttribute('size');
        console.log(this.#getCornerCoords(2, square)[1]);
        return [x, y];
    }

    #drawDiagonalInSquare(a, b, square, colour, type) {
        const line = document.createElementNS(this.#ns, 'line');
        let [x1, y1] = this.#getCoordsInSquare(a, square);
        let [x2, y2] = this.#getCoordsInSquare(b, square);
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        console.log(x1, " ", y1, " ", x2, " ", y2);
        line.setAttribute('stroke', colour);
        line.setAttribute('stroke-width', 2);
        if (type == 'dashed') { line.setAttribute('stroke-dasharray', '5,5'); }
        div.appendChild(line);

    }

}