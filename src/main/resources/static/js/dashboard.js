/* =====================================================
   ELEMENTOS E ESTADO
===================================================== */

function obterElemento() {
    for (
        let indice = 0;
        indice < arguments.length;
        indice++
    ) {
        const elemento =
            document.getElementById(
                arguments[indice]
            );

        if (elemento) {
            return elemento;
        }
    }

    return null;
}

let documentosCarregados = [];
let projetosCarregados = [];
let documentoEmEdicaoId = null;
let temporizadorAviso = null;

const TAMANHO_MAXIMO_ARQUIVO =
    10 * 1024 * 1024;

const botaoMenu =
    obterElemento("botaoMenu");

const menuLateral =
    document.querySelector(".menu-lateral");

const botaoNotificacao =
    obterElemento("botaoNotificacao");

const mensagemNotificacao =
    obterElemento("mensagemNotificacao");

const dataAtual =
    obterElemento("dataAtual");

const pesquisaDocumento =
    obterElemento("pesquisaDocumento");

const filtroTipoDocumento =
    obterElemento("filtroTipoDocumento");

const filtroProjetoDocumento =
    obterElemento("filtroProjetoDocumento");

const botaoLimparFiltrosDocumento =
    obterElemento(
        "botaoLimparFiltrosDocumento"
    );

const corpoTabelaDocumentos =
    obterElemento("corpoTabelaDocumentos");

const quantidadeDocumentos =
    obterElemento("quantidadeDocumentos");

const mensagemSemDocumentos =
    obterElemento("mensagemSemDocumentos");

const totalDocumentos =
    obterElemento("totalDocumentos");

const totalPdf =
    obterElemento("totalPdf");

const totalPlanilhas =
    obterElemento("totalPlanilhas");

const totalOutros =
    obterElemento("totalOutros");

/* =====================================================
   DATA, MENU E AVISOS
===================================================== */

function mostrarDataAtual() {
    if (!dataAtual) {
        return;
    }

    const hoje = new Date();

    const texto =
        hoje.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    dataAtual.textContent =
        texto.charAt(0).toUpperCase()
        + texto.slice(1);
}

mostrarDataAtual();

if (botaoMenu && menuLateral) {
    botaoMenu.addEventListener(
        "click",
        function () {
            menuLateral.classList.toggle(
                "aberto"
            );
        }
    );
}

function mostrarAviso(mensagem) {
    if (!mensagemNotificacao) {
        window.alert(mensagem);
        return;
    }

    clearTimeout(temporizadorAviso);

    mensagemNotificacao.textContent =
        mensagem;

    mensagemNotificacao.classList.add(
        "visivel"
    );

    temporizadorAviso =
        setTimeout(
            function () {
                mensagemNotificacao
                    .classList.remove(
                        "visivel"
                    );
            },
            3500
        );
}

if (botaoNotificacao) {
    botaoNotificacao.addEventListener(
        "click",
        function () {
            mostrarAviso(
                "Não existem novas notificações."
            );
        }
    );
}

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function escaparHtml(texto) {
    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto === null
        || texto === undefined
            ? ""
            : String(texto);

    return elemento.innerHTML;
}

function normalizarTexto(texto) {
    return String(texto || "")
        .trim()
        .toLowerCase();
}

function obterExtensaoArquivo(
    nomeArquivo
) {
    const partes =
        String(nomeArquivo || "")
            .split(".");

    if (partes.length < 2) {
        return "";
    }

    return partes.pop().toLowerCase();
}

function tipoCompativelComArquivo(
    tipo,
    extensao
) {
    const extensoesPorTipo = {
        pdf: ["pdf"],
        planilha: ["xls", "xlsx"],
        documento: ["doc", "docx"]
    };

    const extensoes =
        extensoesPorTipo[tipo];

    return Array.isArray(extensoes)
        && extensoes.includes(extensao);
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

    return tipos[tipo] || {
        nome: tipo,
        sigla: "ARQ",
        classe: "texto"
    };
}

function formatarDataHora(dataHora) {
    if (!dataHora) {
        return "-";
    }

    const data = new Date(dataHora);

    if (
        Number.isNaN(
            data.getTime()
        )
    ) {
        return dataHora;
    }

    return data.toLocaleDateString(
        "pt-BR"
    );
}

function formatarTamanho(bytes) {
    const tamanho =
        Number(bytes) || 0;

    if (tamanho < 1024) {
        return tamanho + " B";
    }

    if (tamanho < 1024 * 1024) {
        return (
            tamanho / 1024
        ).toFixed(1) + " KB";
    }

    return (
        tamanho / 1024 / 1024
    ).toFixed(1) + " MB";
}

function obterDocumentoPorId(id) {
    return documentosCarregados.find(
        function (documento) {
            return Number(documento.id)
                === Number(id);
        }
    );
}

async function obterMensagemErro(
    resposta,
    mensagemPadrao
) {
    try {
        const dados =
            await resposta.json();

        return dados.erro
            || dados.mensagem
            || mensagemPadrao;

    } catch (erro) {
        return mensagemPadrao;
    }
}

/* =====================================================
   CONSULTAR APIS
===================================================== */

async function carregarDados() {
    try {
        const respostas =
            await Promise.all([
                fetch(
                    "/api/documentos",
                    {
                        credentials:
                            "same-origin"
                    }
                ),

                fetch(
                    "/api/projetos",
                    {
                        credentials:
                            "same-origin"
                    }
                )
            ]);

        for (
            let indice = 0;
            indice < respostas.length;
            indice++
        ) {
            if (!respostas[indice].ok) {
                throw new Error(
                    "Não foi possível consultar os dados."
                );
            }
        }

        documentosCarregados =
            await respostas[0].json();

        projetosCarregados =
            await respostas[1].json();

        preencherProjetos();
        atualizarIndicadores();
        aplicarFiltrosDocumento();

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            "Erro ao consultar os documentos."
        );
    }
}

/* =====================================================
   SELECTS DINÂMICOS
===================================================== */

const projetoDocumento =
    obterElemento("projetoDocumento");

function preencherProjetos() {
    const valorFormulario =
        projetoDocumento
            ? projetoDocumento.value
            : "";

    const valorFiltro =
        filtroProjetoDocumento
            ? filtroProjetoDocumento.value
            : "todos";

    if (projetoDocumento) {
        projetoDocumento.innerHTML =
            '<option value="">'
            + "Selecione o projeto"
            + "</option>";

        projetosCarregados.forEach(
            function (projeto) {
                const opcao =
                    document.createElement(
                        "option"
                    );

                opcao.value = projeto.id;
                opcao.textContent =
                    projeto.nome;

                projetoDocumento.appendChild(
                    opcao
                );
            }
        );

        projetoDocumento.value =
            valorFormulario;
    }

    if (filtroProjetoDocumento) {
        filtroProjetoDocumento.innerHTML =
            '<option value="todos">'
            + "Todos os projetos"
            + "</option>";

        projetosCarregados.forEach(
            function (projeto) {
                const opcao =
                    document.createElement(
                        "option"
                    );

                opcao.value = projeto.id;
                opcao.textContent =
                    projeto.nome;

                filtroProjetoDocumento
                    .appendChild(opcao);
            }
        );

        filtroProjetoDocumento.value =
            valorFiltro;
    }
}

/* =====================================================
   INDICADORES E FILTROS
===================================================== */

function atualizarIndicadores() {
    const quantidadePdf =
        documentosCarregados.filter(
            function (documento) {
                return documento.tipo
                    === "pdf";
            }
        ).length;

    const quantidadePlanilhas =
        documentosCarregados.filter(
            function (documento) {
                return documento.tipo
                    === "planilha";
            }
        ).length;

    const quantidadeOutros =
        documentosCarregados.filter(
            function (documento) {
                return documento.tipo
                    !== "pdf"
                    && documento.tipo
                        !== "planilha";
            }
        ).length;

    if (totalDocumentos) {
        totalDocumentos.textContent =
            documentosCarregados.length;
    }

    if (totalPdf) {
        totalPdf.textContent =
            quantidadePdf;
    }

    if (totalPlanilhas) {
        totalPlanilhas.textContent =
            quantidadePlanilhas;
    }

    if (totalOutros) {
        totalOutros.textContent =
            quantidadeOutros;
    }
}

function aplicarFiltrosDocumento() {
    const termo =
        pesquisaDocumento
            ? normalizarTexto(
                pesquisaDocumento.value
            )
            : "";

    const tipoSelecionado =
        filtroTipoDocumento
            ? filtroTipoDocumento.value
            : "todos";

    const projetoSelecionado =
        filtroProjetoDocumento
            ? filtroProjetoDocumento.value
            : "todos";

    const filtrados =
        documentosCarregados.filter(
            function (documento) {
                const texto =
                    normalizarTexto(
                        documento.titulo
                        + " "
                        + documento.nomeProjeto
                        + " "
                        + documento.nomeArquivo
                        + " "
                        + documento.enviadoPor
                    );

                const correspondePesquisa =
                    texto.includes(termo);

                const correspondeTipo =
                    tipoSelecionado
                        === "todos"
                    || tipoSelecionado
                        === ""
                    || documento.tipo
                        === tipoSelecionado;

                const correspondeProjeto =
                    projetoSelecionado
                        === "todos"
                    || projetoSelecionado
                        === ""
                    || String(
                        documento.idProjeto
                    ) === String(
                        projetoSelecionado
                    );

                return correspondePesquisa
                    && correspondeTipo
                    && correspondeProjeto;
            }
        );

    renderizarDocumentos(filtrados);
}

if (pesquisaDocumento) {
    pesquisaDocumento.addEventListener(
        "input",
        aplicarFiltrosDocumento
    );
}

if (filtroTipoDocumento) {
    filtroTipoDocumento.addEventListener(
        "change",
        aplicarFiltrosDocumento
    );
}

if (filtroProjetoDocumento) {
    filtroProjetoDocumento.addEventListener(
        "change",
        aplicarFiltrosDocumento
    );
}

if (botaoLimparFiltrosDocumento) {
    botaoLimparFiltrosDocumento
        .addEventListener(
            "click",
            function () {
                if (pesquisaDocumento) {
                    pesquisaDocumento.value =
                        "";
                }

                if (filtroTipoDocumento) {
                    filtroTipoDocumento.value =
                        "todos";
                }

                if (filtroProjetoDocumento) {
                    filtroProjetoDocumento.value =
                        "todos";
                }

                aplicarFiltrosDocumento();

                mostrarAviso(
                    "Os filtros foram removidos."
                );
            }
        );
}

/* =====================================================
   TABELA DE DOCUMENTOS
===================================================== */

function renderizarDocumentos(
    documentos
) {
    if (!corpoTabelaDocumentos) {
        return;
    }

    corpoTabelaDocumentos.innerHTML = "";

    documentos.forEach(
        function (documento) {
            const informacoesTipo =
                obterInformacoesTipo(
                    documento.tipo
                );

            const linha =
                document.createElement("tr");

            linha.innerHTML = `
                <td>
                    <div
                        class="documento-identificacao"
                    >
                        <span
                            class="documento-icone ${informacoesTipo.classe}"
                        >
                            ${informacoesTipo.sigla}
                        </span>

                        <div>
                            <strong>
                                ${escaparHtml(
                                    documento.titulo
                                )}
                            </strong>

                            <span>
                                ${escaparHtml(
                                    documento.nomeArquivo
                                )}
                                ·
                                ${formatarTamanho(
                                    documento.tamanhoArquivo
                                )}
                            </span>
                        </div>
                    </div>
                </td>

                <td>
                    ${escaparHtml(
                        documento.nomeProjeto
                    )}
                </td>

                <td>
                    ${escaparHtml(
                        informacoesTipo.nome
                    )}
                </td>

                <td>
                    ${escaparHtml(
                        documento.enviadoPor
                    )}
                </td>

                <td>
                    ${formatarDataHora(
                        documento.enviadoEm
                    )}
                </td>

                <td>
                    <div class="acoes-tabela">

                        <button
                            type="button"
                            class="botao-tabela visualizar-documento"
                            data-id="${documento.id}"
                        >
                            Visualizar
                        </button>

                        <button
                            type="button"
                            class="botao-tabela editar-documento"
                            data-id="${documento.id}"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="botao-tabela excluir-documento"
                            data-id="${documento.id}"
                        >
                            Excluir
                        </button>

                    </div>
                </td>
            `;

            corpoTabelaDocumentos
                .appendChild(linha);
        }
    );

    if (quantidadeDocumentos) {
        quantidadeDocumentos.textContent =
            documentos.length === 1
                ? "1 documento encontrado"
                : documentos.length
                    + " documentos encontrados";
    }

    if (mensagemSemDocumentos) {
        mensagemSemDocumentos
            .classList.toggle(
                "visivel",
                documentos.length === 0
            );
    }
}

/* =====================================================
   MODAL E FORMULÁRIO
===================================================== */

const modalDocumento =
    obterElemento("modalDocumento");

const formDocumento =
    obterElemento("formDocumento");

const botaoNovoDocumento =
    obterElemento("botaoNovoDocumento");

const botaoFecharDocumento =
    obterElemento("botaoFecharDocumento");

const botaoCancelarDocumento =
    obterElemento("botaoCancelarDocumento");

const tituloModalDocumento =
    obterElemento("tituloModalDocumento");

const tituloDocumento =
    obterElemento("tituloDocumento");

const tipoDocumento =
    obterElemento("tipoDocumento");

const arquivoDocumento =
    obterElemento("arquivoDocumento");

const arquivoAtualDocumento =
    obterElemento("arquivoAtualDocumento");

function abrirModalDocumento(
    documento
) {
    if (
        !modalDocumento
        || !formDocumento
        || !tituloDocumento
        || !projetoDocumento
        || !tipoDocumento
        || !arquivoDocumento
    ) {
        mostrarAviso(
            "O formulário de documento está incompleto."
        );

        return;
    }

    formDocumento.reset();

    if (documento) {
        documentoEmEdicaoId =
            documento.id;

        if (tituloModalDocumento) {
            tituloModalDocumento.textContent =
                "Editar documento";
        }

        tituloDocumento.value =
            documento.titulo || "";

        projetoDocumento.value =
            documento.idProjeto || "";

        tipoDocumento.value =
            documento.tipo || "";

        if (arquivoAtualDocumento) {
            arquivoAtualDocumento.textContent =
                "Arquivo atual: "
                + documento.nomeArquivo
                + ". Selecione outro somente para substituí-lo.";
        }

    } else {
        documentoEmEdicaoId = null;

        if (tituloModalDocumento) {
            tituloModalDocumento.textContent =
                "Enviar documento";
        }

        if (arquivoAtualDocumento) {
            arquivoAtualDocumento.textContent =
                "O arquivo é obrigatório para um novo documento.";
        }
    }

    modalDocumento.classList.add(
        "aberto"
    );

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
    if (!modalDocumento) {
        return;
    }

    modalDocumento.classList.remove(
        "aberto"
    );

    modalDocumento.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    documentoEmEdicaoId = null;

    if (arquivoAtualDocumento) {
        arquivoAtualDocumento.textContent =
            "";
    }
}

if (botaoNovoDocumento) {
    botaoNovoDocumento.addEventListener(
        "click",
        function () {
            abrirModalDocumento(null);
        }
    );
}

if (botaoFecharDocumento) {
    botaoFecharDocumento.addEventListener(
        "click",
        fecharModalDocumento
    );
}

if (botaoCancelarDocumento) {
    botaoCancelarDocumento
        .addEventListener(
            "click",
            fecharModalDocumento
        );
}

if (modalDocumento) {
    const fundo =
        modalDocumento.querySelector(
            ".modal-fundo"
        );

    if (fundo) {
        fundo.addEventListener(
            "click",
            fecharModalDocumento
        );
    }
}

/* =====================================================
   SALVAR DOCUMENTO
===================================================== */

if (formDocumento) {
    formDocumento.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            const arquivo =
                arquivoDocumento
                    .files[0];

            const editando =
                documentoEmEdicaoId !== null;

            if (
                tituloDocumento.value
                    .trim().length < 3
                || projetoDocumento.value
                    === ""
                || tipoDocumento.value === ""
            ) {
                mostrarAviso(
                    "Preencha corretamente os campos obrigatórios."
                );

                return;
            }

            if (
                !editando
                && !arquivo
            ) {
                mostrarAviso(
                    "Selecione um arquivo."
                );

                return;
            }

            if (arquivo) {
                const extensao =
                    obterExtensaoArquivo(
                        arquivo.name
                    );

                if (
                    !tipoCompativelComArquivo(
                        tipoDocumento.value,
                        extensao
                    )
                ) {
                    mostrarAviso(
                        "O arquivo não corresponde ao tipo selecionado."
                    );

                    return;
                }

                if (
                    arquivo.size
                        > TAMANHO_MAXIMO_ARQUIVO
                ) {
                    mostrarAviso(
                        "O arquivo deve possuir no máximo 10 MB."
                    );

                    return;
                }
            }

            const dados =
                new FormData();

            dados.append(
                "titulo",
                tituloDocumento.value.trim()
            );

            dados.append(
                "idProjeto",
                projetoDocumento.value
            );

            dados.append(
                "tipo",
                tipoDocumento.value
            );

            if (arquivo) {
                dados.append(
                    "arquivo",
                    arquivo
                );
            }

            const endereco =
                editando
                    ? "/api/documentos/"
                        + documentoEmEdicaoId
                    : "/api/documentos";

            try {
                const resposta =
                    await fetch(
                        endereco,
                        {
                            method:
                                editando
                                    ? "PUT"
                                    : "POST",

                            credentials:
                                "same-origin",

                            body: dados
                        }
                    );

                if (!resposta.ok) {
                    const mensagem =
                        await obterMensagemErro(
                            resposta,
                            "Não foi possível salvar o documento."
                        );

                    throw new Error(
                        mensagem
                    );
                }

                fecharModalDocumento();
                await carregarDados();

                mostrarAviso(
                    editando
                        ? "Documento atualizado com sucesso."
                        : "Documento enviado com sucesso."
                );

            } catch (erro) {
                console.error(erro);
                mostrarAviso(erro.message);
            }
        }
    );
}

/* =====================================================
   AÇÕES DA TABELA
===================================================== */

if (corpoTabelaDocumentos) {
    corpoTabelaDocumentos
        .addEventListener(
            "click",
            async function (evento) {
                const botao =
                    evento.target.closest(
                        "button"
                    );

                if (!botao) {
                    return;
                }

                const id =
                    Number(
                        botao.dataset.id
                    );

                const documento =
                    obterDocumentoPorId(id);

                if (!documento) {
                    mostrarAviso(
                        "Documento não encontrado."
                    );

                    return;
                }

                if (
                    botao.classList.contains(
                        "visualizar-documento"
                    )
                ) {
                    window.open(
                        "/api/documentos/"
                        + documento.id
                        + "/arquivo",
                        "_blank",
                        "noopener"
                    );

                    return;
                }

                if (
                    botao.classList.contains(
                        "editar-documento"
                    )
                ) {
                    abrirModalDocumento(
                        documento
                    );

                    return;
                }

                if (
                    botao.classList.contains(
                        "excluir-documento"
                    )
                ) {
                    await excluirDocumento(
                        documento
                    );
                }
            }
        );
}

async function excluirDocumento(
    documento
) {
    const confirmou =
        window.confirm(
            'Deseja excluir o documento "'
            + documento.titulo
            + '"?'
        );

    if (!confirmou) {
        return;
    }

    try {
        const resposta =
            await fetch(
                "/api/documentos/"
                + documento.id,
                {
                    method: "DELETE",
                    credentials:
                        "same-origin"
                }
            );

        if (!resposta.ok) {
            const mensagem =
                await obterMensagemErro(
                    resposta,
                    "Não foi possível excluir o documento."
                );

            throw new Error(mensagem);
        }

        await carregarDados();

        mostrarAviso(
            "Documento excluído com sucesso."
        );

    } catch (erro) {
        console.error(erro);
        mostrarAviso(erro.message);
    }
}

/* =====================================================
   TECLA ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    function (evento) {
        if (evento.key !== "Escape") {
            return;
        }

        if (menuLateral) {
            menuLateral.classList.remove(
                "aberto"
            );
        }

        if (
            modalDocumento
            && modalDocumento.classList
                .contains("aberto")
        ) {
            fecharModalDocumento();
        }
    }
);

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

carregarDados();
