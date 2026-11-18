const catalogoPianos = [
    { id: 1, nome: 'Piano digital portátil 88 teclas', categoria: 'digital', preco: 4500 },
    { id: 2, nome: 'Piano digital de móvel', categoria: 'digital', preco: 9000 },
    { id: 3, nome: 'Piano acústico vertical', categoria: 'acustico', preco: 35000 },
    { id: 4, nome: 'Piano híbrido', categoria: 'hibrido', preco: 40000 },
    { id: 5, nome: 'Piano de meia cauda', categoria: 'acustico', preco: 150000 },
    { id: 6, nome: 'Piano de cauda inteira', categoria: 'acustico', preco: 1200000 },
];

const nomesCategoria = {
    digital: 'Digital',
    acustico: 'Acústico',
    hibrido: 'Híbrido',
};

function calcularParcela(preco, parcelas = 12) {
    return preco / parcelas;
}

function classificarFaixa(preco) {
    if (preco < 10000) {
        return 'acessivel';
    } else if (preco < 100000) {
        return 'intermediaria';
    } else {
        return 'premium';
    }
}

function nomeDaFaixa(faixa) {
    if (faixa === 'acessivel') {
        return 'Acessível';
    } else if (faixa === 'intermediaria') {
        return 'Intermediária';
    } else {
        return 'Premium';
    }
}

function formatarPreco(valor) {
    return 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function processarPianos(pianos) {
    return pianos.map((piano) => ({
        ...piano,
        parcela: calcularParcela(piano.preco),
        faixa: classificarFaixa(piano.preco),
    }));
}

function calcularPrecoMedio(pianos) {
    if (pianos.length === 0) {
        return 0;
    }
    const soma = pianos.reduce((total, piano) => total + piano.preco, 0);
    return soma / pianos.length;
}

function criarCardPiano(piano) {
    const item = document.createElement('li');
    item.classList.add('card', 'card-piano', 'faixa-' + piano.faixa);

    const etiqueta = document.createElement('span');
    etiqueta.classList.add('etiqueta');
    etiqueta.textContent = nomeDaFaixa(piano.faixa);

    const titulo = document.createElement('h3');
    titulo.textContent = piano.nome;

    const categoria = document.createElement('p');
    categoria.classList.add('categoria');
    categoria.textContent = nomesCategoria[piano.categoria];

    const preco = document.createElement('p');
    preco.classList.add('preco');
    preco.textContent = formatarPreco(piano.preco);

    const parcela = document.createElement('p');
    parcela.classList.add('parcela');
    parcela.textContent = `ou 12x de ${formatarPreco(piano.parcela)}`;

    item.append(etiqueta, titulo, categoria, preco, parcela);

    return item;
}

const listaPianos = document.querySelector('#lista-pianos');
const resumoCatalogo = document.querySelector('#resumo-catalogo');

if (listaPianos === null || resumoCatalogo === null) {
    console.log('Não achei a lista ou o resumo no HTML');
} else {
    const pianosProcessados = processarPianos(catalogoPianos);
    const ordenados = [...pianosProcessados].sort((a, b) => a.preco - b.preco);

    for (const piano of ordenados) {
        listaPianos.append(criarCardPiano(piano));
    }

    const acessiveis = pianosProcessados.filter((piano) => piano.faixa === 'acessivel');
    const precoMedio = calcularPrecoMedio(pianosProcessados);

    resumoCatalogo.textContent = `${pianosProcessados.length} pianos no catálogo, ${acessiveis.length} na faixa acessível, preço médio de ${formatarPreco(precoMedio)}`;
}
