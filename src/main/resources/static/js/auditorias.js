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

const pesquisaAuditoria =
    document.getElementById("pesquisaAuditoria");

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

const linksMenu = document.querySelectorAll(".menu-item");

linksMenu.forEach(function (link) {
    link.addEventListener("click", function () {
        menuLateral.classList.remove("aberto");
    });
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
        "Você possui 3 notificações relacionadas às auditorias e pendências."
    );
});

/* =====================================================
   ABAS
===================================================== */

const botoesAbas =
    document.querySelectorAll(".aba-botao");

const abaAuditorias =
    document.getElementById("abaAuditorias");

const abaNaoConformidades =
    document.getElementById("abaNaoConformidades");

const botaoNovaAuditoria =
    document.getElementById("botaoNovaAuditoria");

botoesAbas.forEach(function (botao) {
    botao.addEventListener("click", function () {
        botoesAbas.forEach(function (item) {
            item.classList.remove("ativa");
        });

        botao.classList.add("ativa");

        abaAuditorias.classList.remove("ativa");
        abaNaoConformidades.classList.remove("ativa");

        if (botao.dataset.aba === "auditorias") {
            abaAuditorias.classList.add("ativa");
            botaoNovaAuditoria.style.display = "";

            pesquisaAuditoria.placeholder =
                "Pesquisar auditorias...";

            aplicarFiltrosAuditoria();
        } else {
            abaNaoConformidades.classList.add("ativa");
            botaoNovaAuditoria.style.display = "none";

            pesquisaAuditoria.placeholder =
                "Pesquisar não conformidades...";

            aplicarFiltrosNc();
        }
    });
});

/* =====================================================
   FILTROS DAS AUDITORIAS
===================================================== */

const filtroStatusAuditoria =
    document.getElementById("filtroStatusAuditoria");

const filtroTipoAuditoria =
    document.getElementById("filtroTipoAuditoria");

const botaoLimparFiltrosAuditoria =
    document.getElementById(
        "botaoLimparFiltrosAuditoria"
    );

const corpoTabelaAuditorias =
    document.getElementById(
        "corpoTabelaAuditorias"
    );

const quantidadeAuditorias =
    document.getElementById(
        "quantidadeAuditorias"
    );

const mensagemSemAuditorias =
    document.getElementById(
        "mensagemSemAuditorias"
    );

function aplicarFiltrosAuditoria() {
    const termo =
        pesquisaAuditoria.value.trim().toLowerCase();

    const statusSelecionado =
        filtroStatusAuditoria.value;

    const tipoSelecionado =
        filtroTipoAuditoria.value;

    const linhas =
        corpoTabelaAuditorias.querySelectorAll("tr");

    let encontrados = 0;

    linhas.forEach(function (linha) {
        const textoLinha =
            linha.textContent.toLowerCase();

        const correspondePesquisa =
            textoLinha.includes(termo);

        const correspondeStatus =
            statusSelecionado === "todos"
            || linha.dataset.status === statusSelecionado;

        const correspondeTipo =
            tipoSelecionado === "todos"
            || linha.dataset.tipo === tipoSelecionado;

        const deveAparecer =
            correspondePesquisa
            && correspondeStatus
            && correspondeTipo;

        linha.style.display =
            deveAparecer ? "" : "none";

        if (deveAparecer) {
            encontrados++;
        }
    });

    quantidadeAuditorias.textContent =
        encontrados === 1
            ? "1 auditoria encontrada"
            : encontrados + " auditorias encontradas";

    mensagemSemAuditorias.classList.toggle(
        "visivel",
        encontrados === 0
    );
}

filtroStatusAuditoria.addEventListener(
    "change",
    aplicarFiltrosAuditoria
);

filtroTipoAuditoria.addEventListener(
    "change",
    aplicarFiltrosAuditoria
);

botaoLimparFiltrosAuditoria.addEventListener(
    "click",
    function () {
        pesquisaAuditoria.value = "";
        filtroStatusAuditoria.value = "todos";
        filtroTipoAuditoria.value = "todos";

        aplicarFiltrosAuditoria();

        mostrarAviso(
            "Os filtros de auditoria foram removidos."
        );
    }
);

/* =====================================================
   FILTROS DAS NÃO CONFORMIDADES
===================================================== */

const filtroSituacaoNc =
    document.getElementById("filtroSituacaoNc");

const filtroGravidadeNc =
    document.getElementById("filtroGravidadeNc");

const botaoLimparFiltrosNc =
    document.getElementById(
        "botaoLimparFiltrosNc"
    );

const corpoTabelaNc =
    document.getElementById("corpoTabelaNc");

const quantidadeNc =
    document.getElementById("quantidadeNc");

const mensagemSemNc =
    document.getElementById("mensagemSemNc");

function aplicarFiltrosNc() {
    const termo =
        pesquisaAuditoria.value.trim().toLowerCase();

    const situacaoSelecionada =
        filtroSituacaoNc.value;

    const gravidadeSelecionada =
        filtroGravidadeNc.value;

    const linhas =
        corpoTabelaNc.querySelectorAll("tr");

    let encontrados = 0;

    linhas.forEach(function (linha) {
        const textoLinha =
            linha.textContent.toLowerCase();

        const correspondePesquisa =
            textoLinha.includes(termo);

        const correspondeSituacao =
            situacaoSelecionada === "todos"
            || linha.dataset.situacao
                === situacaoSelecionada;

        const correspondeGravidade =
            gravidadeSelecionada === "todos"
            || linha.dataset.gravidade
                === gravidadeSelecionada;

        const deveAparecer =
            correspondePesquisa
            && correspondeSituacao
            && correspondeGravidade;

        linha.style.display =
            deveAparecer ? "" : "none";

        if (deveAparecer) {
            encontrados++;
        }
    });

    quantidadeNc.textContent =
        encontrados === 1
            ? "1 ocorrência encontrada"
            : encontrados + " ocorrências encontradas";

    mensagemSemNc.classList.toggle(
        "visivel",
        encontrados === 0
    );
}

filtroSituacaoNc.addEventListener(
    "change",
    aplicarFiltrosNc
);

filtroGravidadeNc.addEventListener(
    "change",
    aplicarFiltrosNc
);

botaoLimparFiltrosNc.addEventListener(
    "click",
    function () {
        pesquisaAuditoria.value = "";
        filtroSituacaoNc.value = "todos";
        filtroGravidadeNc.value = "todos";

        aplicarFiltrosNc();

        mostrarAviso(
            "Os filtros de não conformidade foram removidos."
        );
    }
);

/* Pesquisa conforme a aba aberta */

pesquisaAuditoria.addEventListener(
    "input",
    function () {
        if (abaAuditorias.classList.contains("ativa")) {
            aplicarFiltrosAuditoria();
        } else {
            aplicarFiltrosNc();
        }
    }
);

/* =====================================================
   MODAL DE AUDITORIA
===================================================== */

const modalAuditoria =
    document.getElementById("modalAuditoria");

const fundoModalAuditoria =
    modalAuditoria.querySelector(".modal-fundo");

const botaoFecharAuditoria =
    document.getElementById(
        "botaoFecharAuditoria"
    );

const botaoCancelarAuditoria =
    document.getElementById(
        "botaoCancelarAuditoria"
    );

const formAuditoria =
    document.getElementById("formAuditoria");

const tituloModalAuditoria =
    document.getElementById(
        "tituloModalAuditoria"
    );

const nomeAuditoria =
    document.getElementById("nomeAuditoria");

const projetoAuditoria =
    document.getElementById("projetoAuditoria");

const tipoAuditoria =
    document.getElementById("tipoAuditoria");

const dataAuditoria =
    document.getElementById("dataAuditoria");

const statusAuditoria =
    document.getElementById("statusAuditoria");

const erroNomeAuditoria =
    document.getElementById(
        "erroNomeAuditoria"
    );

const erroProjetoAuditoria =
    document.getElementById(
        "erroProjetoAuditoria"
    );

const erroTipoAuditoria =
    document.getElementById(
        "erroTipoAuditoria"
    );

const erroDataAuditoria =
    document.getElementById(
        "erroDataAuditoria"
    );

const erroStatusAuditoria =
    document.getElementById(
        "erroStatusAuditoria"
    );

let linhaAuditoriaEmEdicao = null;

function abrirModalAuditoria() {
    linhaAuditoriaEmEdicao = null;

    tituloModalAuditoria.textContent =
        "Nova auditoria";

    formAuditoria.reset();
    limparErrosAuditoria();

    modalAuditoria.classList.add("aberto");
    modalAuditoria.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("modal-aberto");

    nomeAuditoria.focus();
}

function fecharModalAuditoria() {
    modalAuditoria.classList.remove("aberto");
    modalAuditoria.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    formAuditoria.reset();
    limparErrosAuditoria();

    linhaAuditoriaEmEdicao = null;
}

botaoNovaAuditoria.addEventListener(
    "click",
    abrirModalAuditoria
);

botaoFecharAuditoria.addEventListener(
    "click",
    fecharModalAuditoria
);

botaoCancelarAuditoria.addEventListener(
    "click",
    fecharModalAuditoria
);

fundoModalAuditoria.addEventListener(
    "click",
    fecharModalAuditoria
);

/* =====================================================
   VALIDAÇÃO DA AUDITORIA
===================================================== */

function limparErrosAuditoria() {
    const mensagens = [
        erroNomeAuditoria,
        erroProjetoAuditoria,
        erroTipoAuditoria,
        erroDataAuditoria,
        erroStatusAuditoria
    ];

    mensagens.forEach(function (mensagem) {
        mensagem.textContent = "";
    });

    const campos = [
        nomeAuditoria,
        projetoAuditoria,
        tipoAuditoria,
        dataAuditoria,
        statusAuditoria
    ];

    campos.forEach(function (campo) {
        campo.classList.remove("campo-invalido");
    });
}

function marcarErro(
    campo,
    elementoErro,
    mensagem
) {
    campo.classList.add("campo-invalido");
    elementoErro.textContent = mensagem;
}

function validarAuditoria() {
    limparErrosAuditoria();

    let formularioValido = true;

    if (nomeAuditoria.value.trim() === "") {
        marcarErro(
            nomeAuditoria,
            erroNomeAuditoria,
            "Informe o nome da auditoria."
        );

        formularioValido = false;
    } else if (
        nomeAuditoria.value.trim().length < 3
    ) {
        marcarErro(
            nomeAuditoria,
            erroNomeAuditoria,
            "O nome deve possuir pelo menos 3 caracteres."
        );

        formularioValido = false;
    }

    if (projetoAuditoria.value === "") {
        marcarErro(
            projetoAuditoria,
            erroProjetoAuditoria,
            "Selecione o projeto."
        );

        formularioValido = false;
    }

    if (tipoAuditoria.value === "") {
        marcarErro(
            tipoAuditoria,
            erroTipoAuditoria,
            "Selecione o tipo."
        );

        formularioValido = false;
    }

    if (dataAuditoria.value === "") {
        marcarErro(
            dataAuditoria,
            erroDataAuditoria,
            "Informe a data."
        );

        formularioValido = false;
    }

    if (statusAuditoria.value === "") {
        marcarErro(
            statusAuditoria,
            erroStatusAuditoria,
            "Selecione o status."
        );

        formularioValido = false;
    }

    return formularioValido;
}

const camposAuditoria = [
    nomeAuditoria,
    projetoAuditoria,
    tipoAuditoria,
    dataAuditoria,
    statusAuditoria
];

camposAuditoria.forEach(function (campo) {
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

function nomeDoTipo(tipo) {
    return tipo === "interna"
        ? "Interna"
        : "Externa";
}

function nomeDoStatus(status) {
    const nomes = {
        planejada: "Planejada",
        andamento: "Em andamento",
        concluida: "Concluída"
    };

    return nomes[status];
}

function classeDoStatus(status) {
    const classes = {
        planejada: "planejamento",
        andamento: "andamento",
        concluida: "concluido"
    };

    return classes[status];
}

/* =====================================================
   CRIAR OU EDITAR AUDITORIA
===================================================== */

function preencherLinhaAuditoria(linha) {
    const nome = nomeAuditoria.value.trim();
    const projeto = projetoAuditoria.value;
    const tipo = tipoAuditoria.value;
    const data = dataAuditoria.value;
    const status = statusAuditoria.value;

    linha.dataset.status = status;
    linha.dataset.tipo = tipo;

    linha.innerHTML = `
        <td>
            <strong>${escaparHtml(nome)}</strong>
            <span>Auditoria cadastrada no sistema</span>
        </td>

        <td>${escaparHtml(projeto)}</td>

        <td>${nomeDoTipo(tipo)}</td>

        <td>${formatarData(data)}</td>

        <td>
            <span class="status ${classeDoStatus(status)}">
                ${nomeDoStatus(status)}
            </span>
        </td>

        <td>
            <div class="acoes-tabela">

                <button
                    type="button"
                    class="botao-tabela visualizar"
                >
                    Visualizar
                </button>

                <button
                    type="button"
                    class="botao-tabela editar"
                >
                    Editar
                </button>

            </div>
        </td>
    `;
}

formAuditoria.addEventListener(
    "submit",
    function (evento) {
        evento.preventDefault();

        if (!validarAuditoria()) {
            mostrarAviso(
                "Verifique os campos obrigatórios."
            );

            return;
        }

        if (linhaAuditoriaEmEdicao) {
            preencherLinhaAuditoria(
                linhaAuditoriaEmEdicao
            );

            mostrarAviso(
                "Auditoria atualizada com sucesso."
            );
        } else {
            const novaLinha =
                document.createElement("tr");

            preencherLinhaAuditoria(novaLinha);

            corpoTabelaAuditorias.appendChild(
                novaLinha
            );

            mostrarAviso(
                "Auditoria cadastrada com sucesso."
            );
        }

        fecharModalAuditoria();
        aplicarFiltrosAuditoria();
    }
);

/* =====================================================
   VISUALIZAR E EDITAR AUDITORIAS
===================================================== */

corpoTabelaAuditorias.addEventListener(
    "click",
    function (evento) {
        const botao = evento.target;

        if (
            !botao.classList.contains(
                "botao-tabela"
            )
        ) {
            return;
        }

        const linha = botao.closest("tr");

        const nome =
            linha.querySelector(
                "td strong"
            ).textContent.trim();

        const projeto =
            linha.children[1].textContent.trim();

        if (
            botao.classList.contains(
                "visualizar"
            )
        ) {
            mostrarAviso(
                nome
                + " — Projeto: "
                + projeto
                + "."
            );

            return;
        }

        if (
            botao.classList.contains("editar")
        ) {
            abrirEdicaoAuditoria(linha);
        }
    }
);

function abrirEdicaoAuditoria(linha) {
    linhaAuditoriaEmEdicao = linha;

    tituloModalAuditoria.textContent =
        "Editar auditoria";

    limparErrosAuditoria();

    nomeAuditoria.value =
        linha.querySelector(
            "td strong"
        ).textContent.trim();

    projetoAuditoria.value =
        linha.children[1].textContent.trim();

    tipoAuditoria.value =
        linha.dataset.tipo;

    dataAuditoria.value =
        converterDataParaCampo(
            linha.children[3].textContent.trim()
        );

    statusAuditoria.value =
        linha.dataset.status;

    modalAuditoria.classList.add("aberto");

    modalAuditoria.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );

    nomeAuditoria.focus();
}

/* =====================================================
   NÃO CONFORMIDADES
===================================================== */

const botaoNovaNaoConformidade =
    document.getElementById(
        "botaoNovaNaoConformidade"
    );

botaoNovaNaoConformidade.addEventListener(
    "click",
    function () {
        mostrarAviso(
            "O cadastro completo de não conformidades será integrado ao back-end posteriormente."
        );
    }
);

corpoTabelaNc.addEventListener(
    "click",
    function (evento) {
        const botao = evento.target;

        if (
            !botao.classList.contains(
                "visualizar"
            )
        ) {
            return;
        }

        const linha = botao.closest("tr");

        const nome =
            linha.querySelector(
                "td strong"
            ).textContent.trim();

        const origem =
            linha.children[1].textContent.trim();

        const gravidade =
            linha.querySelector(
                ".gravidade"
            ).textContent.trim();

        mostrarAviso(
            nome
            + " — Origem: "
            + origem
            + " — Gravidade: "
            + gravidade
            + "."
        );
    }
);

/* =====================================================
   TECLA ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    function (evento) {
        if (evento.key === "Escape") {
            menuLateral.classList.remove("aberto");

            if (
                modalAuditoria.classList.contains(
                    "aberto"
                )
            ) {
                fecharModalAuditoria();
            }
        }
    }
);

/* Quantidades iniciais */

aplicarFiltrosAuditoria();
aplicarFiltrosNc();