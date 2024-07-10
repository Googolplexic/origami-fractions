function calculate(svg) {
    svg.setAttribute('display', 'block');
    var vBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const size = Math.min(vBox[2], vBox[3])*0.9;
    fractCP = new CP(size, svg);
    fractCP.createCornerDiagonal();
    fractCP.createCrease([0, 1 / 3], [0.3, 0.8], 'M', 'Solid');
    fractCP.drawCP();
    generateCP(svg);
    
}
