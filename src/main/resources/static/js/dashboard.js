const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.querySelector(".menu-lateral");

const botaoNotificacao =
    document.getElementById("botaoNotificacao");

const mensagemNotificacao =
    document.getElementById("mensagemNotificacao");

const dataAtual = document.getElementById("dataAtual");
const pesquisaGeral = document.getElementById("pesquisaGeral");

const linhasProjetos =
    document.querySelectorAll(".tabela-sistema tbody tr");

let temporizadorAviso;

/* Exibe a data atual */

function mostrarDataAtual() {
    const hoje = new Date();

    const dataFormatada = hoje.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

    dataAtual.textContent =
        dataFormatada.charAt(0).toUpperCase()
        + dataFormatada.slice(1);
}

mostrarDataAtual();

/* Abre e fecha o menu em telas menores */

botaoMenu.addEventListener("click", function () {
    menuLateral.classList.toggle("aberto");
});

/* Fecha o menu ao selecionar uma página */

const linksMenu =
    document.querySelectorAll(".menu-item");

linksMenu.forEach(function (link) {
    link.addEventListener("click", function () {
        menuLateral.classList.remove("aberto");
    });
});

/* Fecha o menu ao pressionar a tecla Escape */

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        menuLateral.classList.remove("aberto");
    }
});

/* Mostra mensagens flutuantes */

function mostrarAviso(mensagem) {
    clearTimeout(temporizadorAviso);

    mensagemNotificacao.textContent = mensagem;
    mensagemNotificacao.classList.add("visivel");

    temporizadorAviso = setTimeout(function () {
        mensagemNotificacao.classList.remove("visivel");
    }, 3500);
}

/* Simulação das notificações */

botaoNotificacao.addEventListener("click", function () {
    mostrarAviso(
        "Você possui 3 notificações: uma auditoria próxima e duas pendências de projeto."
    );
});

/* Pesquisa nos projetos recentes */

pesquisaGeral.addEventListener("input", function () {
    const termoPesquisa =
        pesquisaGeral.value.trim().toLowerCase();

    let quantidadeEncontrada = 0;

    linhasProjetos.forEach(function (linha) {
        const conteudoLinha =
            linha.textContent.toLowerCase();

        const correspondePesquisa =
            conteudoLinha.includes(termoPesquisa);

        linha.style.display =
            correspondePesquisa ? "" : "none";

        if (correspondePesquisa) {
            quantidadeEncontrada++;
        }
    });

    if (
        termoPesquisa !== ""
        && quantidadeEncontrada === 0
    ) {
        mostrarAviso(
            "Nenhum projeto recente foi encontrado."
        );
    }
});

/* Mensagem demonstrativa do botão Novo projeto */

const botaoNovoProjeto =
    document.querySelector(".botao-acao");

botaoNovoProjeto.addEventListener(
    "click",
    function (evento) {

        /*
         * O redirecionamento será liberado depois que
         * a página projetos.html estiver criada.
         */

        if (
            botaoNovoProjeto.getAttribute("href")
            === "projetos.html"
        ) {
            mostrarAviso(
                "Abrindo a página de projetos..."
            );
        }
    }
);