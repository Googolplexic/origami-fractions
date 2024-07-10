function calculate() {
    var div = document.getElementById('svgCanvas');
    const size = Math.max(div.getAttribute('width'), div.getAttribute('height')) * 0.8;
    fractCP = new CP(size, div);
    fractCP.drawCornerDiagonal();
    fractCP.drawCrease([0, 1 / 3], [0.3, 0.8], 'M', 'Solid');
}
