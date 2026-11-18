const canvasPrecos = document.getElementById('grafico-precos');

if (canvasPrecos) {
    const ctxPrecos = canvasPrecos.getContext('2d');

    const dadosPrecos = [
        { rotulo: 'Digital', valor: 7 },
        { rotulo: 'Vertical', valor: 35 },
        { rotulo: 'Híbrido', valor: 40 },
        { rotulo: 'Meia cauda', valor: 150 },
    ];

    const larguraCanvas = canvasPrecos.width;
    const alturaCanvas = canvasPrecos.height;
    const margemBase = 40;
    const margemTopo = 30;
    const alturaUtil = alturaCanvas - margemBase - margemTopo;
    const larguraBarra = 80;
    const espacoEntreBarras = (larguraCanvas - larguraBarra * dadosPrecos.length) / (dadosPrecos.length + 1);
    const maiorValor = Math.max(...dadosPrecos.map((item) => item.valor));

    let progresso = 0;

    function desenharGrafico() {
        ctxPrecos.clearRect(0, 0, larguraCanvas, alturaCanvas);
        ctxPrecos.strokeStyle = '#2e2e33';
        ctxPrecos.lineWidth = 2;
        ctxPrecos.beginPath();
        ctxPrecos.moveTo(0, alturaCanvas - margemBase);
        ctxPrecos.lineTo(larguraCanvas, alturaCanvas - margemBase);
        ctxPrecos.stroke();
        ctxPrecos.font = '16px Arial, sans-serif';
        ctxPrecos.textAlign = 'center';

        dadosPrecos.forEach((item, indice) => {
            const x = espacoEntreBarras + indice * (larguraBarra + espacoEntreBarras);
            const alturaFinal = (item.valor / maiorValor) * alturaUtil;
            const alturaAtual = alturaFinal * progresso;
            const y = alturaCanvas - margemBase - alturaAtual;

            ctxPrecos.fillStyle = '#c9a227';
            ctxPrecos.fillRect(x, y, larguraBarra, alturaAtual);

            ctxPrecos.fillStyle = '#f5f1e8';
            ctxPrecos.fillText(`R$ ${item.valor} mil`, x + larguraBarra / 2, y - 8);

            ctxPrecos.fillStyle = '#b9b3a6';
            ctxPrecos.fillText(item.rotulo, x + larguraBarra / 2, alturaCanvas - 14);
        });
    }

    function animarGrafico() {
        progresso = Math.min(progresso + 0.02, 1);
        desenharGrafico();
        if (progresso < 1) {
            requestAnimationFrame(animarGrafico);
        }
    }

    animarGrafico();
}
