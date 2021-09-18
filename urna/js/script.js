//funções de controle de interface
const tela = document.querySelector(".tela");
const seuVotoPara = document.querySelector(".texto span");
const cargo = document.querySelector(".cargo span");
const descricao = document.querySelector(".descricao");
const aviso = document.querySelector(".divisao2");
const lateral = document.querySelector(".divisao-direita");
const quadradoNumero = document.querySelector(".quadrado-numero");
const tecladoBotao = document.querySelectorAll(".teclado-botao");
const botaoBranco = document.querySelector(".teclado-botao-branco");
const botaoCorrige = document.querySelector(".teclado-botao-corrige");
const botaoConfirma = document.querySelector(".teclado-botao-confirma");
const botaoReiniciar = document.querySelector(".botao-reiniciar");

//var de controles de ambiente
let etapaAtual = 0;

let numero = "";
let etapa = null;
let isBranco = false;
let votos = [];

tecladoBotao.forEach((botoes, valor) => {
    botoes.addEventListener("click", () => clicou(valor + 1));
});

botaoBranco.addEventListener("click", clicouBotaoBranco);
botaoCorrige.addEventListener("click", clicouBotaoCorrige);
botaoConfirma.addEventListener("click", clicouBotaoConfirma);

comecarEtapa();

function comecarEtapa() {
    etapa = etapas[etapaAtual];

    // quantidade de quadradinhos de acordo com a etapa
    let numeroHtml = "";
    numero = "";
    isBbranco = false;

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHtml += '<div class="numero pisca"></div>';
        } else {
            numeroHtml += '<div class="numero"></div>';
        }
    }

    seuVotoPara.style.display = "none";
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = "";
    aviso.style.display = "none";
    lateral.innerHTML = "";
    quadradoNumero.innerHTML = numeroHtml;
}

//encontra o candidato ao digitar numero relacionado a ele
function atualizaInterface() {
    etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((numeroCandidato) => {
        if (numeroCandidato.numero === parseInt(numero)) {
            return true;
        } else {
            return false;
        }
    });

    if (candidato.length > 0) {
        //primeiro candidato encontrado
        candidato = candidato[0];

        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        descricao.innerHTML = `
            Nome candidato(a): ${candidato.nome}<br>
            Partido: ${candidato.partido}`;


        let fotos = "";
        for (let i in candidato.fotos) {
            if (candidato.fotos[i].isPequeno) {
                fotos += `<div class="imagem pequeno">
                    <img src="./img/${candidato.fotos[i].url}" 
                      alt="${candidato.fotos[i].legenda}">
                    <span>${candidato.fotos[i].legenda}</span>
                  </div>`;
            } else {
                fotos += `<div class="imagem">
                    <img src="./img/${candidato.fotos[i].url}"
                       alt="${candidato.fotos[i].legenda}">
                    <span>${candidato.fotos[i].legenda}</span>
                  </div>`;
            }
        }

        lateral.innerHTML = fotos;
    } else {
        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        descricao.innerHTML = '<div class="voto-nulo-branco pisca">VOTO NULO</div>';
    }
}

function clicou(valor) {
    const numeroPisca = document.querySelector(".numero.pisca");

    if (numeroPisca != null) {
        numeroPisca.innerHTML = valor;

        if (valor === 10) {
            numeroPisca.innerHTML = 0;
        }

        numero = `${numero}${valor}`;

        numeroPisca.classList.remove("pisca");

        /* nexElementSibling passa para o proximo quadradinho */
        if (numeroPisca.nextElementSibling != null) {
            numeroPisca.nextElementSibling.classList.add("pisca");
        } else {
            atualizaInterface();
        }
    }
}

function clicouBotaoBranco() {
    if (numero === "") {
        isBranco = true;
        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        quadradoNumero.innerHTML = "";
        descricao.innerHTML =
            '<div class="voto-nulo-branco pisca">VOTO EM BRANCO</div>';
    }
}

function clicouBotaoCorrige() {
    comecarEtapa();
}

function clicouBotaoConfirma() {
    etapa = etapas[etapaAtual];

    let isConfirmado = false;

    if (isBranco === true) {
        isConfirmado = true;

        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: "BRANCO",
        });

    } else if (numero.length === etapa.numeros) {
        isConfirmado = true;

        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero,
        });
    }

    if (isConfirmado) {
        etapaAtual++;
        if (etapas[etapaAtual] != undefined) {
            comecarEtapa();
        } else {
            tela.innerHTML = '<div class="fim pisca">Fim</div>';

            /* remove os eventos de cick para impossibilitar a ação em 
            uma etapa inexistente */
            botaoCorrige.removeEventListener("click", clicouBotaoCorrige);
            botaoConfirma.removeEventListener("click", clicouBotaoConfirma);
            botaoReiniciar.addEventListener("click", reiniciarVotacao);

            console.log(votos);
        }
    }
}

function reiniciarVotacao() {
    location.reload();
}