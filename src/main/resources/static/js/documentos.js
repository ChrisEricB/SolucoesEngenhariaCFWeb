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

const pesquisaDocumento =
    document.getElementById("pesquisaDocumento");

const filtroTipoDocumento =
    document.getElementById("filtroTipoDocumento");

const filtroProjetoDocumento =
    document.getElementById("filtroProjetoDocumento");

const botaoLimparFiltrosDocumento =
    document.getElementById(
        "botaoLimparFiltrosDocumento"
    );

const corpoTabelaDocumentos =
    document.getElementById(
        "corpoTabelaDocumentos"
    );

const quantidadeDocumentos =
    document.getElementById(
        "quantidadeDocumentos"
    );

const mensagemSemDocumentos =
    document.getElementById(
        "mensagemSemDocumentos"
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
        "Você possui 3 notificações relacionadas aos documentos."
    );
});

/* =====================================================
   PESQUISA E FILTROS
===================================================== */

function aplicarFiltrosDocumento() {
    const termo =
        pesquisaDocumento.value.trim().toLowerCase();

    const tipoSelecionado =
        filtroTipoDocumento.value;

    const projetoSelecionado =
        filtroProjetoDocumento.value;

    const linhas =
        corpoTabelaDocumentos.querySelectorAll("tr");

    let encontrados = 0;

    linhas.forEach(function (linha) {
        const textoLinha =
            linha.textContent.toLowerCase();

        const correspondePesquisa =
            textoLinha.includes(termo);

        const correspondeTipo =
            tipoSelecionado === "todos"
            || linha.dataset.tipo === tipoSelecionado;

        const correspondeProjeto =
            projetoSelecionado === "todos"
            || linha.dataset.projeto
                === projetoSelecionado;

        const deveAparecer =
            correspondePesquisa
            && correspondeTipo
            && correspondeProjeto;

        linha.style.display =
            deveAparecer ? "" : "none";

        if (deveAparecer) {
            encontrados++;
        }
    });

    quantidadeDocumentos.textContent =
        encontrados === 1
            ? "1 documento encontrado"
            : encontrados + " documentos encontrados";

    mensagemSemDocumentos.classList.toggle(
        "visivel",
        encontrados === 0
    );
}

pesquisaDocumento.addEventListener(
    "input",
    aplicarFiltrosDocumento
);

filtroTipoDocumento.addEventListener(
    "change",
    aplicarFiltrosDocumento
);

filtroProjetoDocumento.addEventListener(
    "change",
    aplicarFiltrosDocumento
);

botaoLimparFiltrosDocumento.addEventListener(
    "click",
    function () {
        pesquisaDocumento.value = "";
        filtroTipoDocumento.value = "todos";
        filtroProjetoDocumento.value = "todos";

        aplicarFiltrosDocumento();

        mostrarAviso(
            "Os filtros de documentos foram removidos."
        );
    }
);

/* =====================================================
   INDICADORES
===================================================== */

function atualizarIndicadores() {
    const linhas =
        corpoTabelaDocumentos.querySelectorAll("tr");

    let quantidadePdf = 0;
    let quantidadePlanilhas = 0;
    let quantidadeOutros = 0;

    linhas.forEach(function (linha) {
        if (linha.dataset.tipo === "pdf") {
            quantidadePdf++;
        } else if (
            linha.dataset.tipo === "planilha"
        ) {
            quantidadePlanilhas++;
        } else {
            quantidadeOutros++;
        }
    });

    document.getElementById(
        "totalDocumentos"
    ).textContent = linhas.length;

    document.getElementById(
        "totalPdf"
    ).textContent = quantidadePdf;

    document.getElementById(
        "totalPlanilhas"
    ).textContent = quantidadePlanilhas;

    document.getElementById(
        "totalOutros"
    ).textContent = quantidadeOutros;
}

/* =====================================================
   MODAL DE ENVIO
===================================================== */

const modalDocumento =
    document.getElementById("modalDocumento");

const fundoModalDocumento =
    modalDocumento.querySelector(".modal-fundo");

const botaoNovoDocumento =
    document.getElementById("botaoNovoDocumento");

const botaoFecharDocumento =
    document.getElementById(
        "botaoFecharDocumento"
    );

const botaoCancelarDocumento =
    document.getElementById(
        "botaoCancelarDocumento"
    );

const formDocumento =
    document.getElementById("formDocumento");

const tituloDocumento =
    document.getElementById("tituloDocumento");

const projetoDocumento =
    document.getElementById("projetoDocumento");

const tipoDocumento =
    document.getElementById("tipoDocumento");

const arquivoDocumento =
    document.getElementById("arquivoDocumento");

const erroTituloDocumento =
    document.getElementById(
        "erroTituloDocumento"
    );

const erroProjetoDocumento =
    document.getElementById(
        "erroProjetoDocumento"
    );

const erroTipoDocumento =
    document.getElementById(
        "erroTipoDocumento"
    );

const erroArquivoDocumento =
    document.getElementById(
        "erroArquivoDocumento"
    );

function abrirModalDocumento() {
    formDocumento.reset();
    limparErrosDocumento();

    modalDocumento.classList.add("aberto");

    modalDocumento.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );

    tituloDocumento.focus();
}

function fecharModalDocumento() {
    modalDocumento.classList.remove("aberto");

    modalDocumento.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    formDocumento.reset();
    limparErrosDocumento();
}

botaoNovoDocumento.addEventListener(
    "click",
    abrirModalDocumento
);

botaoFecharDocumento.addEventListener(
    "click",
    fecharModalDocumento
);

botaoCancelarDocumento.addEventListener(
    "click",
    fecharModalDocumento
);

fundoModalDocumento.addEventListener(
    "click",
    fecharModalDocumento
);

/* =====================================================
   VALIDAÇÕES
===================================================== */

function limparErrosDocumento() {
    const mensagens = [
        erroTituloDocumento,
        erroProjetoDocumento,
        erroTipoDocumento,
        erroArquivoDocumento
    ];

    mensagens.forEach(function (mensagem) {
        mensagem.textContent = "";
    });

    const campos = [
        tituloDocumento,
        projetoDocumento,
        tipoDocumento,
        arquivoDocumento
    ];

    campos.forEach(function (campo) {
        campo.classList.remove("campo-invalido");
    });
}

function marcarErro(campo, erro, mensagem) {
    campo.classList.add("campo-invalido");
    erro.textContent = mensagem;
}

function obterExtensaoArquivo(nomeArquivo) {
    const partes = nomeArquivo.split(".");

    if (partes.length < 2) {
        return "";
    }

    return partes.pop().toLowerCase();
}

function extensaoPermitida(extensao) {
    const extensoesPermitidas = [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx"
    ];

    return extensoesPermitidas.includes(extensao);
}

function tipoCompativelComArquivo(
    tipoSelecionado,
    extensao
) {
    const extensoesPorTipo = {
        pdf: ["pdf"],
        planilha: ["xls", "xlsx"],
        documento: ["doc", "docx"]
    };

    return extensoesPorTipo[
        tipoSelecionado
    ].includes(extensao);
}

function validarDocumento() {
    limparErrosDocumento();

    let formularioValido = true;

    const titulo =
        tituloDocumento.value.trim();

    const projeto =
        projetoDocumento.value;

    const tipo =
        tipoDocumento.value;

    const arquivo =
        arquivoDocumento.files[0];

    if (titulo === "") {
        marcarErro(
            tituloDocumento,
            erroTituloDocumento,
            "Informe o título do documento."
        );

        formularioValido = false;

    } else if (titulo.length < 3) {
        marcarErro(
            tituloDocumento,
            erroTituloDocumento,
            "O título deve possuir pelo menos 3 caracteres."
        );

        formularioValido = false;
    }

    if (projeto === "") {
        marcarErro(
            projetoDocumento,
            erroProjetoDocumento,
            "Selecione o projeto."
        );

        formularioValido = false;
    }

    if (tipo === "") {
        marcarErro(
            tipoDocumento,
            erroTipoDocumento,
            "Selecione o tipo do documento."
        );

        formularioValido = false;
    }

    if (!arquivo) {
        marcarErro(
            arquivoDocumento,
            erroArquivoDocumento,
            "Selecione um arquivo."
        );

        formularioValido = false;

    } else {
        const extensao =
            obterExtensaoArquivo(arquivo.name);

        if (!extensaoPermitida(extensao)) {
            marcarErro(
                arquivoDocumento,
                erroArquivoDocumento,
                "O formato selecionado não é permitido."
            );

            formularioValido = false;

        } else if (
            tipo !== ""
            && !tipoCompativelComArquivo(
                tipo,
                extensao
            )
        ) {
            marcarErro(
                arquivoDocumento,
                erroArquivoDocumento,
                "O arquivo não corresponde ao tipo selecionado."
            );

            formularioValido = false;
        }
    }

    return formularioValido;
}

const camposDocumento = [
    tituloDocumento,
    projetoDocumento,
    tipoDocumento,
    arquivoDocumento
];

camposDocumento.forEach(function (campo) {
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

function escaparHtml(texto) {
    const elemento =
        document.createElement("div");

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

function obterInformacoesTipo(tipo) {
    const tipos = {
        pdf: {
            nome: "PDF",
            sigla: "PDF",
            classe: "pdf"
        },

        planilha: {
            nome: "Planilha",
            sigla: "XLS",
            classe: "planilha"
        },

        documento: {
            nome: "Documento",
            sigla: "DOC",
            classe: "texto"
        }
    };

    return tipos[tipo];
}

function obterDataAtualCurta() {
    return new Date().toLocaleDateString("pt-BR");
}

/* =====================================================
   ENVIAR DOCUMENTO
===================================================== */

formDocumento.addEventListener(
    "submit",
    function (evento) {
        evento.preventDefault();

        if (!validarDocumento()) {
            mostrarAviso(
                "Verifique os campos obrigatórios."
            );

            return;
        }

        const titulo =
            tituloDocumento.value.trim();

        const projeto =
            projetoDocumento.value;

        const tipo =
            tipoDocumento.value;

        const arquivo =
            arquivoDocumento.files[0];

        const informacoesTipo =
            obterInformacoesTipo(tipo);

        const novaLinha =
            document.createElement("tr");

        novaLinha.dataset.tipo = tipo;
        novaLinha.dataset.projeto = projeto;

        novaLinha.innerHTML = `
            <td>
                <div class="documento-identificacao">

                    <span
                        class="documento-icone ${informacoesTipo.classe}"
                    >
                        ${informacoesTipo.sigla}
                    </span>

                    <div>
                        <strong>
                            ${escaparHtml(titulo)}
                        </strong>

                        <span>
                            ${escaparHtml(arquivo.name)}
                        </span>
                    </div>

                </div>
            </td>

            <td>
                ${obterNomeProjeto(projeto)}
            </td>

            <td>
                ${informacoesTipo.nome}
            </td>

            <td>
                Christian Barrantes
            </td>

            <td>
                ${obterDataAtualCurta()}
            </td>

            <td>
                <div class="acoes-tabela">

                    <button
                        type="button"
                        class="botao-tabela visualizar-documento"
                    >
                        Visualizar
                    </button>

                    <button
                        type="button"
                        class="botao-tabela excluir-documento"
                    >
                        Excluir
                    </button>

                </div>
            </td>
        `;

        corpoTabelaDocumentos.appendChild(
            novaLinha
        );

        fecharModalDocumento();
        atualizarIndicadores();
        aplicarFiltrosDocumento();

        mostrarAviso(
            "Documento enviado com sucesso."
        );
    }
);

/* =====================================================
   VISUALIZAR E EXCLUIR
===================================================== */

let linhaDocumentoParaExcluir = null;

corpoTabelaDocumentos.addEventListener(
    "click",
    function (evento) {
        const botao = evento.target;

        const linha = botao.closest("tr");

        if (!linha) {
            return;
        }

        const titulo =
            linha.querySelector(
                ".documento-identificacao strong"
            ).textContent.trim();

        if (
            botao.classList.contains(
                "visualizar-documento"
            )
        ) {
            const nomeArquivo =
                linha.querySelector(
                    ".documento-identificacao div span"
                ).textContent.trim();

            mostrarAviso(
                "Visualização simulada: "
                + titulo
                + " — Arquivo: "
                + nomeArquivo
                + "."
            );

            return;
        }

        if (
            botao.classList.contains(
                "excluir-documento"
            )
        ) {
            linhaDocumentoParaExcluir = linha;

            abrirConfirmacaoExclusao(titulo);
        }
    }
);

/* =====================================================
   CONFIRMAÇÃO DE EXCLUSÃO
===================================================== */

const confirmacaoExclusao =
    document.createElement("div");

confirmacaoExclusao.className =
    "confirmacao-exclusao";

confirmacaoExclusao.innerHTML = `
    <div class="confirmacao-fundo"></div>

    <section class="confirmacao-conteudo">

        <div class="confirmacao-icone">
            !
        </div>

        <h2>Excluir documento?</h2>

        <p id="textoConfirmacaoExclusao">
            Esta ação removerá o documento da listagem.
        </p>

        <div class="confirmacao-acoes">

            <button
                type="button"
                class="botao-secundario"
                id="botaoCancelarExclusao"
            >
                Cancelar
            </button>

            <button
                type="button"
                class="botao-excluir-confirmacao"
                id="botaoConfirmarExclusao"
            >
                Excluir documento
            </button>

        </div>

    </section>
`;

document.body.appendChild(confirmacaoExclusao);

const textoConfirmacaoExclusao =
    document.getElementById(
        "textoConfirmacaoExclusao"
    );

const botaoCancelarExclusao =
    document.getElementById(
        "botaoCancelarExclusao"
    );

const botaoConfirmarExclusao =
    document.getElementById(
        "botaoConfirmarExclusao"
    );

const confirmacaoFundo =
    confirmacaoExclusao.querySelector(
        ".confirmacao-fundo"
    );

function abrirConfirmacaoExclusao(titulo) {
    textoConfirmacaoExclusao.textContent =
        'O documento "'
        + titulo
        + '" será removido da listagem.';

    confirmacaoExclusao.classList.add(
        "aberta"
    );

    document.body.classList.add(
        "modal-aberto"
    );
}

function fecharConfirmacaoExclusao() {
    confirmacaoExclusao.classList.remove(
        "aberta"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    linhaDocumentoParaExcluir = null;
}

botaoCancelarExclusao.addEventListener(
    "click",
    fecharConfirmacaoExclusao
);

confirmacaoFundo.addEventListener(
    "click",
    fecharConfirmacaoExclusao
);

botaoConfirmarExclusao.addEventListener(
    "click",
    function () {
        if (!linhaDocumentoParaExcluir) {
            return;
        }

        linhaDocumentoParaExcluir.remove();

        linhaDocumentoParaExcluir = null;

        confirmacaoExclusao.classList.remove(
            "aberta"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        atualizarIndicadores();
        aplicarFiltrosDocumento();

        mostrarAviso(
            "Documento excluído com sucesso."
        );
    }
);

/* =====================================================
   TECLA ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    function (evento) {
        if (evento.key !== "Escape") {
            return;
        }

        menuLateral.classList.remove("aberto");

        if (
            modalDocumento.classList.contains(
                "aberto"
            )
        ) {
            fecharModalDocumento();
        }

        if (
            confirmacaoExclusao.classList.contains(
                "aberta"
            )
        ) {
            fecharConfirmacaoExclusao();
        }
    }
);

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

atualizarIndicadores();
aplicarFiltrosDocumento();