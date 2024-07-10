function calculate() {
    var div = document.getElementById('svgCanvas');
    var vBox = div.getAttribute('viewBox').split(' ').map(Number);
    const size = Math.min(vBox[2], vBox[3]) * 0.8;
    fractCP = new CP(size, div);
    fractCP.drawCornerDiagonal();
    fractCP.drawCrease([0, 1 / 3], [0.3, 0.8], 'M', 'Solid');
    
}
