/*
TEMA: estoque de uma loja de pianos (Piano | Comparativo)
ENTRADA: orcamento maximo (prompt) e depois as categorias que a pessoa digitar ate escrever "sair"
PROCESSAMENTO: classificar o estoque de cada piano, ver o setor pela categoria, somar o valor do estoque, achar o mais caro e contar quantos cabem no orcamento
SAIDA: frases no console e um console.table com o relatorio

PSEUDOCODIGO:
1. ler o orcamento e validar
2. para cada piano: classificar estoque, ver o setor, somar valor, ver se e o mais caro, contar se cabe no orcamento
3. mostrar o relatorio e o resumo
4. repetir: ler categoria e contar os pianos dela ate digitar sair
*/

const estoquePianos = [
    { nome: 'Piano digital portátil', preco: 4500, estoque: 8, categoria: 'digital' },
    { nome: 'Piano digital de móvel', preco: 9000, estoque: 2, categoria: 'digital' },
    { nome: 'Piano híbrido', preco: 40000, estoque: 1, categoria: 'hibrido' },
    { nome: 'Piano acústico vertical', preco: 35000, estoque: 0, categoria: 'acustico' },
    { nome: 'Piano de meia cauda', preco: 150000, estoque: 1, categoria: 'acustico' },
    { nome: 'Piano de cauda inteira', preco: 1200000, estoque: 0, categoria: 'acustico' },
];

const entrada = prompt('Qual o seu orçamento máximo em reais? (entre 1000 e 2000000)');
let orcamento = null;

if (entrada === null) {
    console.log('Você cancelou.');
} else if (entrada.trim() === '') {
    console.log('Orçamento vazio.');
} else {
    const valorDigitado = Number(entrada);

    if (Number.isNaN(valorDigitado)) {
        console.log(`"${entrada}" não é um número.`);
    } else if (valorDigitado < 1000 || valorDigitado > 2000000) {
        console.log('O orçamento tem que ser entre 1000 e 2000000.');
    } else {
        orcamento = valorDigitado;
    }
}

if (orcamento !== null) {
    let valorTotalEstoque = 0;
    let maisCaro = estoquePianos[0];
    let cabemNoOrcamento = 0;
    const relatorio = [];

    for (const piano of estoquePianos) {
        let situacao;
        if (piano.estoque === 0) {
            situacao = 'Esgotado';
        } else if (piano.estoque <= 2) {
            situacao = 'Baixo';
        } else {
            situacao = 'Normal';
        }

        let setor;
        switch (piano.categoria) {
            case 'digital':
                setor = 'Vitrine de digitais';
                break;
            case 'acustico':
                setor = 'Salão de acústicos';
                break;
            case 'hibrido':
                setor = 'Sala de híbridos';
                break;
            default:
                setor = 'Sem setor';
                break;
        }

        valorTotalEstoque = valorTotalEstoque + piano.preco * piano.estoque;

        if (piano.preco > maisCaro.preco) {
            maisCaro = piano;
        }

        if (piano.preco <= orcamento) {
            cabemNoOrcamento++;
        }

        relatorio.push({ nome: piano.nome, preco: piano.preco, estoque: piano.estoque, situacao: situacao, setor: setor });
    }

    console.table(relatorio);
    console.log(`Valor total em estoque: R$ ${valorTotalEstoque}`);
    console.log(`Piano mais caro: ${maisCaro.nome} (R$ ${maisCaro.preco})`);
    console.log(`Com R$ ${orcamento} dá pra comprar ${cabemNoOrcamento} de ${estoquePianos.length} pianos.`);

    let comando;
    do {
        const resposta = prompt('Digite uma categoria (digital, acustico ou hibrido) ou "sair"');
        if (resposta === null) {
            comando = 'sair';
        } else {
            comando = resposta.trim().toLowerCase();
        }

        if (comando !== 'sair') {
            let quantidade = 0;
            for (let i = 0; i < estoquePianos.length; i++) {
                if (estoquePianos[i].categoria === comando) {
                    quantidade++;
                }
            }
            console.log(`Categoria ${comando}: ${quantidade} piano(s)`);
        }
    } while (comando !== 'sair');

    console.log('Fim.');
}

/*
TESTE DE MESA (orcamento = 10000)

volta | piano                  | estoque | situacao | valorTotalEstoque | maisCaro               | cabemNoOrcamento
1     | Piano digital portatil | 8       | Normal   | 36000             | Piano digital portatil | 1
2     | Piano digital de movel | 2       | Baixo    | 54000             | Piano digital de movel | 2
3     | Piano hibrido          | 1       | Baixo    | 94000             | Piano hibrido          | 2

no final deu 244000 no console, mais caro = Piano de cauda inteira, 2 cabem no orcamento
*/
