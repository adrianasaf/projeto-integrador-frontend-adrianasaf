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

function filtrarPianos(pianos, filtro) {
    return pianos.filter((piano) => {
        const passaBusca = piano.nome.toLowerCase().includes(filtro.busca);
        const passaCategoria = filtro.categoria === 'todas' || piano.categoria === filtro.categoria;
        const passaFavorito = !filtro.soFavoritos || piano.favorito === true;
        return passaBusca && passaCategoria && passaFavorito;
    });
}

function calcularResumo(visiveis, todos) {
    return {
        exibidos: visiveis.length,
        total: todos.length,
        favoritos: todos.filter((piano) => piano.favorito === true).length,
        precoMedio: calcularPrecoMedio(visiveis),
    };
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

    const botaoFavoritar = document.createElement('button');
    botaoFavoritar.type = 'button';
    botaoFavoritar.classList.add('botao-favoritar');
    botaoFavoritar.dataset.id = piano.id;
    botaoFavoritar.setAttribute('aria-pressed', String(piano.favorito === true));
    botaoFavoritar.textContent = piano.favorito ? '★ Favorito' : '☆ Favoritar';
    item.append(botaoFavoritar);

    return item;
}

const filtroAtual = {
    busca: '',
    categoria: 'todas',
    soFavoritos: false,
};

const listaPianos = document.querySelector('#lista-pianos');
const resumoCatalogo = document.querySelector('#resumo-catalogo');
const campoBusca = document.querySelector('#busca');
const seletorCategoria = document.querySelector('#filtro-categoria');
const botaoFavoritos = document.querySelector('#botao-favoritos');
const formNovoPiano = document.querySelector('#form-novo-piano');
const botaoMenu = document.querySelector('.menu-hamburguer');
const menuPrincipal = document.querySelector('#menu-principal');

let proximoId = catalogoPianos.length + 1;

function escreverResumo(resumo) {
    resumoCatalogo.textContent = `Mostrando ${resumo.exibidos} de ${resumo.total} pianos, ${resumo.favoritos} favorito(s), preço médio de ${formatarPreco(resumo.precoMedio)}`;
}

function desenhar() {
    const processados = processarPianos(catalogoPianos);
    const visiveis = filtrarPianos(processados, filtroAtual);
    const ordenados = [...visiveis].sort((a, b) => a.preco - b.preco);

    listaPianos.replaceChildren(...ordenados.map(criarCardPiano));
    escreverResumo(calcularResumo(visiveis, catalogoPianos));
}

function tratarCliqueNaLista(evento) {
    const botao = evento.target.closest('.botao-favoritar');
    if (botao === null) {
        return;
    }

    const id = Number(botao.dataset.id);
    const piano = catalogoPianos.find((item) => item.id === id);
    piano.favorito = !piano.favorito;
    desenhar();

    const botaoNovo = listaPianos.querySelector(`[data-id="${id}"]`);
    if (botaoNovo !== null) {
        botaoNovo.focus();
    } else {
        botaoFavoritos.focus();
    }
}

function tratarBusca(evento) {
    filtroAtual.busca = evento.target.value.trim().toLowerCase();
    desenhar();
}

function tratarCategoria(evento) {
    filtroAtual.categoria = evento.target.value;
    desenhar();
}

function alternarFavoritos() {
    filtroAtual.soFavoritos = !filtroAtual.soFavoritos;
    botaoFavoritos.setAttribute('aria-pressed', String(filtroAtual.soFavoritos));
    desenhar();
}

function tratarNovoPiano(evento) {
    evento.preventDefault();

    const nome = document.querySelector('#novo-nome').value.trim();
    const preco = Number(document.querySelector('#novo-preco').value);
    const categoria = document.querySelector('#novo-categoria').value;

    if (nome === '' || Number.isNaN(preco) || preco <= 0 || categoria === '') {
        return;
    }

    catalogoPianos.push({ id: proximoId, nome: nome, categoria: categoria, preco: preco, favorito: false });
    proximoId++;

    formNovoPiano.reset();
    desenhar();
}

function alternarMenu() {
    const aberto = botaoMenu.getAttribute('aria-expanded') === 'true';
    botaoMenu.setAttribute('aria-expanded', String(!aberto));
    menuPrincipal.classList.toggle('aberto', !aberto);
}

function fecharMenuComEsc(evento) {
    if (evento.key === 'Escape' && botaoMenu.getAttribute('aria-expanded') === 'true') {
        botaoMenu.setAttribute('aria-expanded', 'false');
        menuPrincipal.classList.remove('aberto');
        botaoMenu.focus();
    }
}

function iniciarCatalogo() {
    if (listaPianos === null || resumoCatalogo === null) {
        console.log('Não achei a lista ou o resumo no HTML');
        return;
    }
    listaPianos.addEventListener('click', tratarCliqueNaLista);
    campoBusca.addEventListener('input', tratarBusca);
    seletorCategoria.addEventListener('change', tratarCategoria);
    botaoFavoritos.addEventListener('click', alternarFavoritos);
    formNovoPiano.addEventListener('submit', tratarNovoPiano);
    desenhar();
}

function iniciarMenu() {
    botaoMenu.addEventListener('click', alternarMenu);
    document.addEventListener('keydown', fecharMenuComEsc);
}

iniciarCatalogo();
iniciarMenu();
