/* =====================================================
   ELEMENTOS GERAIS
===================================================== */

const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.querySelector(".menu-lateral");

const botaoNotificacao =
    document.getElementById("botaoNotificacao");

const mensagemNotificacao =
    document.getElementById("mensagemNotificacao");

const dataAtual = document.getElementById("dataAtual");

const pesquisaChecklist =
    document.getElementById("pesquisaChecklist");

const filtroStatusChecklist =
    document.getElementById("filtroStatusChecklist");

const filtroProjetoChecklist =
    document.getElementById("filtroProjetoChecklist");

const botaoLimparFiltrosChecklist =
    document.getElementById(
        "botaoLimparFiltrosChecklist"
    );

const listaChecklists =
    document.getElementById("listaChecklists");

const mensagemSemChecklists =
    document.getElementById(
        "mensagemSemChecklists"
    );

let temporizadorAviso;

/* =====================================================
   DATA ATUAL
===================================================== */

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

/* =====================================================
   MENU RESPONSIVO
===================================================== */

botaoMenu.addEventListener("click", function () {
    menuLateral.classList.toggle("aberto");
});

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        menuLateral.classList.remove("aberto");

        if (modalChecklist.classList.contains("aberto")) {
            fecharModalChecklist();
        }
    }
});

/* =====================================================
   AVISOS
===================================================== */

function mostrarAviso(mensagem) {
    clearTimeout(temporizadorAviso);

    mensagemNotificacao.textContent = mensagem;
    mensagemNotificacao.classList.add("visivel");

    temporizadorAviso = setTimeout(function () {
        mensagemNotificacao.classList.remove("visivel");
    }, 3500);
}

botaoNotificacao.addEventListener("click", function () {
    mostrarAviso(
        "Você possui 3 notificações relacionadas aos checklists."
    );
});

/* =====================================================
   PESQUISA E FILTROS
===================================================== */

function aplicarFiltrosChecklist() {
    const termo =
        pesquisaChecklist.value.trim().toLowerCase();

    const statusSelecionado =
        filtroStatusChecklist.value;

    const projetoSelecionado =
        filtroProjetoChecklist.value;

    const cartoes =
        listaChecklists.querySelectorAll(
            ".cartao-checklist"
        );

    let encontrados = 0;

    cartoes.forEach(function (cartao) {
        const texto =
            cartao.textContent.toLowerCase();

        const correspondePesquisa =
            texto.includes(termo);

        const correspondeStatus =
            statusSelecionado === "todos"
            || cartao.dataset.status
                === statusSelecionado;

        const correspondeProjeto =
            projetoSelecionado === "todos"
            || cartao.dataset.projeto
                === projetoSelecionado;

        const deveAparecer =
            correspondePesquisa
            && correspondeStatus
            && correspondeProjeto;

        cartao.classList.toggle(
            "oculto",
            !deveAparecer
        );

        if (deveAparecer) {
            encontrados++;
        }
    });

    mensagemSemChecklists.classList.toggle(
        "visivel",
        encontrados === 0
    );
}

pesquisaChecklist.addEventListener(
    "input",
    aplicarFiltrosChecklist
);

filtroStatusChecklist.addEventListener(
    "change",
    aplicarFiltrosChecklist
);

filtroProjetoChecklist.addEventListener(
    "change",
    aplicarFiltrosChecklist
);

botaoLimparFiltrosChecklist.addEventListener(
    "click",
    function () {
        pesquisaChecklist.value = "";
        filtroStatusChecklist.value = "todos";
        filtroProjetoChecklist.value = "todos";

        aplicarFiltrosChecklist();

        mostrarAviso(
            "Os filtros foram removidos."
        );
    }
);

/* =====================================================
   INDICADORES
===================================================== */

function atualizarIndicadores() {
    const cartoes =
        listaChecklists.querySelectorAll(
            ".cartao-checklist"
        );

    let andamento = 0;
    let concluidos = 0;
    let atrasados = 0;

    cartoes.forEach(function (cartao) {
        if (cartao.dataset.status === "andamento") {
            andamento++;
        }

        if (cartao.dataset.status === "concluido") {
            concluidos++;
        }

        if (cartao.dataset.status === "atrasado") {
            atrasados++;
        }
    });

    document.getElementById(
        "totalChecklists"
    ).textContent = cartoes.length;

    document.getElementById(
        "checklistsAndamento"
    ).textContent = andamento;

    document.getElementById(
        "checklistsConcluidos"
    ).textContent = concluidos;

    document.getElementById(
        "checklistsAtrasados"
    ).textContent = atrasados;
}

/* =====================================================
   MODAL E FORMULÁRIO
===================================================== */

const modalChecklist =
    document.getElementById("modalChecklist");

const fundoModalChecklist =
    modalChecklist.querySelector(".modal-fundo");

const botaoNovoChecklist =
    document.getElementById("botaoNovoChecklist");

const botaoFecharChecklist =
    document.getElementById("botaoFecharChecklist");

const botaoCancelarChecklist =
    document.getElementById(
        "botaoCancelarChecklist"
    );

const formChecklist =
    document.getElementById("formChecklist");

const tituloModalChecklist =
    document.getElementById(
        "tituloModalChecklist"
    );

const tituloChecklist =
    document.getElementById("tituloChecklist");

const projetoChecklist =
    document.getElementById("projetoChecklist");

const responsavelChecklist =
    document.getElementById(
        "responsavelChecklist"
    );

const prazoChecklist =
    document.getElementById("prazoChecklist");

const statusChecklist =
    document.getElementById("statusChecklist");

const descricaoChecklist =
    document.getElementById(
        "descricaoChecklist"
    );

const erroTituloChecklist =
    document.getElementById(
        "erroTituloChecklist"
    );

const erroProjetoChecklist =
    document.getElementById(
        "erroProjetoChecklist"
    );

const erroResponsavelChecklist =
    document.getElementById(
        "erroResponsavelChecklist"
    );

const erroPrazoChecklist =
    document.getElementById(
        "erroPrazoChecklist"
    );

const erroStatusChecklist =
    document.getElementById(
        "erroStatusChecklist"
    );

const erroDescricaoChecklist =
    document.getElementById(
        "erroDescricaoChecklist"
    );

let cartaoEmEdicao = null;

function abrirModalNovoChecklist() {
    cartaoEmEdicao = null;

    tituloModalChecklist.textContent =
        "Novo checklist";

    formChecklist.reset();
    limparErrosChecklist();

    modalChecklist.classList.add("aberto");

    modalChecklist.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );

    tituloChecklist.focus();
}

function fecharModalChecklist() {
    modalChecklist.classList.remove("aberto");

    modalChecklist.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    formChecklist.reset();
    limparErrosChecklist();

    cartaoEmEdicao = null;
}

botaoNovoChecklist.addEventListener(
    "click",
    abrirModalNovoChecklist
);

botaoFecharChecklist.addEventListener(
    "click",
    fecharModalChecklist
);

botaoCancelarChecklist.addEventListener(
    "click",
    fecharModalChecklist
);

fundoModalChecklist.addEventListener(
    "click",
    fecharModalChecklist
);

/* =====================================================
   VALIDAÇÕES
===================================================== */

function limparErrosChecklist() {
    const mensagens = [
        erroTituloChecklist,
        erroProjetoChecklist,
        erroResponsavelChecklist,
        erroPrazoChecklist,
        erroStatusChecklist,
        erroDescricaoChecklist
    ];

    mensagens.forEach(function (mensagem) {
        mensagem.textContent = "";
    });

    const campos = [
        tituloChecklist,
        projetoChecklist,
        responsavelChecklist,
        prazoChecklist,
        statusChecklist,
        descricaoChecklist
    ];

    campos.forEach(function (campo) {
        campo.classList.remove("campo-invalido");
    });
}

function marcarErro(campo, erro, mensagem) {
    campo.classList.add("campo-invalido");
    erro.textContent = mensagem;
}

function validarChecklist() {
    limparErrosChecklist();

    let formularioValido = true;

    if (tituloChecklist.value.trim() === "") {
        marcarErro(
            tituloChecklist,
            erroTituloChecklist,
            "Informe o título do checklist."
        );

        formularioValido = false;

    } else if (
        tituloChecklist.value.trim().length < 3
    ) {
        marcarErro(
            tituloChecklist,
            erroTituloChecklist,
            "O título deve possuir pelo menos 3 caracteres."
        );

        formularioValido = false;
    }

    if (projetoChecklist.value === "") {
        marcarErro(
            projetoChecklist,
            erroProjetoChecklist,
            "Selecione o projeto."
        );

        formularioValido = false;
    }

    if (responsavelChecklist.value === "") {
        marcarErro(
            responsavelChecklist,
            erroResponsavelChecklist,
            "Selecione o responsável."
        );

        formularioValido = false;
    }

    if (prazoChecklist.value === "") {
        marcarErro(
            prazoChecklist,
            erroPrazoChecklist,
            "Informe o prazo."
        );

        formularioValido = false;
    }

    if (statusChecklist.value === "") {
        marcarErro(
            statusChecklist,
            erroStatusChecklist,
            "Selecione o status."
        );

        formularioValido = false;
    }

    if (descricaoChecklist.value.trim() === "") {
        marcarErro(
            descricaoChecklist,
            erroDescricaoChecklist,
            "Informe uma descrição."
        );

        formularioValido = false;

    } else if (
        descricaoChecklist.value.trim().length < 10
    ) {
        marcarErro(
            descricaoChecklist,
            erroDescricaoChecklist,
            "A descrição deve possuir pelo menos 10 caracteres."
        );

        formularioValido = false;
    }

    return formularioValido;
}

const camposChecklist = [
    tituloChecklist,
    projetoChecklist,
    responsavelChecklist,
    prazoChecklist,
    statusChecklist,
    descricaoChecklist
];

camposChecklist.forEach(function (campo) {
    campo.addEventListener("input", function () {
        campo.classList.remove("campo-invalido");
    });

    campo.addEventListener("change", function () {
        campo.classList.remove("campo-invalido");
    });
});

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function formatarData(data) {
    const partes = data.split("-");

    return partes[2]
        + "/"
        + partes[1]
        + "/"
        + partes[0];
}

function converterDataParaCampo(data) {
    const partes = data.split("/");

    return partes[2]
        + "-"
        + partes[1]
        + "-"
        + partes[0];
}

function escaparHtml(texto) {
    const elemento = document.createElement("div");

    elemento.textContent = texto;

    return elemento.innerHTML;
}

function obterNomeProjeto(chave) {
    const projetos = {
        solar: "Projeto Solar",
        ampliacao: "Ampliação industrial",
        modernizacao: "Modernização da fábrica"
    };

    return projetos[chave];
}

function obterNomeStatus(status) {
    const statusNomes = {
        planejado: "Planejado",
        andamento: "Em andamento",
        concluido: "Concluído",
        atrasado: "Atrasado"
    };

    return statusNomes[status];
}

function obterClasseStatus(status) {
    const classes = {
        planejado: "planejamento",
        andamento: "andamento",
        concluido: "concluido",
        atrasado: "pendente"
    };

    return classes[status];
}

/* =====================================================
   CRIAR OU ATUALIZAR CARTÃO
===================================================== */

function preencherCartaoChecklist(cartao) {
    const titulo = tituloChecklist.value.trim();

    const projeto = projetoChecklist.value;

    const responsavel =
        responsavelChecklist.value;

    const prazo = prazoChecklist.value;

    const status = statusChecklist.value;

    const descricao =
        descricaoChecklist.value.trim();

    const progresso =
        status === "concluido" ? 100 : 0;

    cartao.className = "cartao-checklist";

    cartao.dataset.status = status;
    cartao.dataset.projeto = projeto;
    cartao.dataset.descricao = descricao;

    cartao.innerHTML = `
        <div class="checklist-cabecalho">

            <div>
                <span class="status ${obterClasseStatus(status)}">
                    ${obterNomeStatus(status)}
                </span>

                <h2>${escaparHtml(titulo)}</h2>

                <p>${obterNomeProjeto(projeto)}</p>
            </div>

            <button
                type="button"
                class="botao-opcoes-checklist"
                aria-label="Opções do checklist"
            >
                ⋮
            </button>

        </div>

        <div class="checklist-progresso">

            <div class="checklist-progresso-texto">
                <span>Progresso</span>
                <strong>${progresso}%</strong>
            </div>

            <div class="progresso-linha checklist-barra">

                <div
                    class="progresso-barra"
                    style="width: ${progresso}%;"
                ></div>

            </div>

            <small>
                ${
                    status === "concluido"
                        ? "Todos os itens concluídos"
                        : "Nenhum item concluído"
                }
            </small>

        </div>

        <div class="checklist-informacoes">

            <span>
                Responsável: ${escaparHtml(responsavel)}
            </span>

            <span>
                Prazo: ${formatarData(prazo)}
            </span>

        </div>

        <div class="checklist-acoes">

            <button
                type="button"
                class="botao-secundario botao-abrir-checklist"
            >
                Abrir checklist
            </button>

            <button
                type="button"
                class="botao-tabela editar-checklist"
            >
                Editar
            </button>

        </div>
    `;
}

/* =====================================================
   SALVAR CHECKLIST
===================================================== */

formChecklist.addEventListener(
    "submit",
    function (evento) {
        evento.preventDefault();

        if (!validarChecklist()) {
            mostrarAviso(
                "Verifique os campos obrigatórios."
            );

            return;
        }

        if (cartaoEmEdicao) {
            preencherCartaoChecklist(
                cartaoEmEdicao
            );

            mostrarAviso(
                "Checklist atualizado com sucesso."
            );

        } else {
            const novoCartao =
                document.createElement("article");

            preencherCartaoChecklist(novoCartao);

            listaChecklists.appendChild(
                novoCartao
            );

            mostrarAviso(
                "Checklist cadastrado com sucesso."
            );
        }

        fecharModalChecklist();
        atualizarIndicadores();
        aplicarFiltrosChecklist();
    }
);

/* =====================================================
   BOTÕES DOS CARTÕES
===================================================== */

listaChecklists.addEventListener(
    "click",
    function (evento) {
        const botao = evento.target;

        const cartao =
            botao.closest(".cartao-checklist");

        if (!cartao) {
            return;
        }

        const titulo =
            cartao.querySelector("h2").textContent.trim();

        if (
            botao.classList.contains(
                "botao-abrir-checklist"
            )
        ) {
            mostrarAviso(
                "Abrindo o checklist: " + titulo + "."
            );

            return;
        }

        if (
            botao.classList.contains(
                "editar-checklist"
            )
        ) {
            abrirEdicaoChecklist(cartao);

            return;
        }

        if (
            botao.classList.contains(
                "botao-opcoes-checklist"
            )
        ) {
            mostrarAviso(
                "Opções disponíveis para: "
                + titulo
                + "."
            );
        }
    }
);

/* =====================================================
   EDITAR CHECKLIST
===================================================== */

function abrirEdicaoChecklist(cartao) {
    cartaoEmEdicao = cartao;

    tituloModalChecklist.textContent =
        "Editar checklist";

    limparErrosChecklist();

    tituloChecklist.value =
        cartao.querySelector("h2").textContent.trim();

    projetoChecklist.value =
        cartao.dataset.projeto;

    statusChecklist.value =
        cartao.dataset.status;

    const informacoes =
        cartao.querySelectorAll(
            ".checklist-informacoes span"
        );

    responsavelChecklist.value =
        informacoes[0].textContent
            .replace("Responsável:", "")
            .trim();

    const textoPrazo =
        informacoes[1].textContent
            .replace("Prazo:", "")
            .replace("Prazo vencido:", "")
            .replace("Concluído em:", "")
            .trim();

    prazoChecklist.value =
        converterDataParaCampo(textoPrazo);

    descricaoChecklist.value =
        cartao.dataset.descricao
        || "Checklist de verificação do projeto.";

    modalChecklist.classList.add("aberto");

    modalChecklist.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );

    tituloChecklist.focus();
}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

atualizarIndicadores();
aplicarFiltrosChecklist();