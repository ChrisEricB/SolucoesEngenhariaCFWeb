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

let auditoriasCarregadas = [];
let naoConformidadesCarregadas = [];
let projetosCarregados = [];

let auditoriaEmEdicaoId = null;
let naoConformidadeEmEdicaoId = null;
let temporizadorAviso;

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

const corpoTabelaAuditorias =
    obterElemento("corpoTabelaAuditorias");

const quantidadeAuditorias =
    obterElemento("quantidadeAuditorias");

const mensagemSemAuditorias =
    obterElemento("mensagemSemAuditorias");

const corpoTabelaNaoConformidades =
    obterElemento(
        "corpoTabelaNaoConformidades",
        "corpoTabelaNC"
    );

const quantidadeNaoConformidades =
    obterElemento(
        "quantidadeNaoConformidades",
        "quantidadeNC"
    );

const mensagemSemNaoConformidades =
    obterElemento(
        "mensagemSemNaoConformidades",
        "mensagemSemNC"
    );

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

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return partes[2]
        + "/"
        + partes[1]
        + "/"
        + partes[0];
}

function nomeTipoAuditoria(tipo) {
    const nomes = {
        interna: "Interna",
        externa: "Externa",
        qualidade: "Qualidade",
        seguranca: "Segurança",
        ambiental: "Ambiental"
    };

    return nomes[tipo] || tipo;
}

function nomeStatusAuditoria(status) {
    const nomes = {
        planejada: "Planejada",
        andamento: "Em andamento",
        concluida: "Concluída",
        cancelada: "Cancelada"
    };

    return nomes[status] || status;
}

function nomeGravidade(gravidade) {
    const nomes = {
        baixa: "Baixa",
        media: "Média",
        alta: "Alta",
        critica: "Crítica"
    };

    return nomes[gravidade] || gravidade;
}

function nomeStatusNaoConformidade(status) {
    const nomes = {
        aberta: "Aberta",
        analise: "Em análise",
        correcao: "Em correção",
        resolvida: "Resolvida",
        cancelada: "Cancelada"
    };

    return nomes[status] || status;
}

function obterAuditoriaPorId(id) {
    return auditoriasCarregadas.find(
        function (auditoria) {
            return auditoria.id === id;
        }
    );
}

/* =====================================================
   INDICADORES
===================================================== */

const indicadorAuditoriasPlanejadas =
    obterElemento(
        "indicadorAuditoriasPlanejadas"
    );

const indicadorAuditoriasAndamento =
    obterElemento(
        "indicadorAuditoriasAndamento"
    );

const indicadorAuditoriasConcluidas =
    obterElemento(
        "indicadorAuditoriasConcluidas"
    );

const indicadorNaoConformidadesAbertas =
    obterElemento(
        "indicadorNaoConformidadesAbertas"
    );

function atualizarIndicadores() {
    const planejadas =
        auditoriasCarregadas.filter(
            function (auditoria) {
                return auditoria.status
                    === "planejada";
            }
        ).length;

    const andamento =
        auditoriasCarregadas.filter(
            function (auditoria) {
                return auditoria.status
                    === "andamento";
            }
        ).length;

    const concluidas =
        auditoriasCarregadas.filter(
            function (auditoria) {
                return auditoria.status
                    === "concluida";
            }
        ).length;

    const pendencias =
        naoConformidadesCarregadas.filter(
            function (registro) {
                return registro.status
                    !== "resolvida"
                    && registro.status
                    !== "cancelada";
            }
        ).length;

    if (indicadorAuditoriasPlanejadas) {
        indicadorAuditoriasPlanejadas
            .textContent = planejadas;
    }

    if (indicadorAuditoriasAndamento) {
        indicadorAuditoriasAndamento
            .textContent = andamento;
    }

    if (indicadorAuditoriasConcluidas) {
        indicadorAuditoriasConcluidas
            .textContent = concluidas;
    }

    if (indicadorNaoConformidadesAbertas) {
        indicadorNaoConformidadesAbertas
            .textContent = pendencias;
    }
}

/* =====================================================
   CONSULTAR APIS
===================================================== */

async function carregarDados() {
    try {
        const respostas =
            await Promise.all([
                fetch("/api/projetos"),
                fetch("/api/auditorias"),
                fetch(
                    "/api/nao-conformidades"
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

        projetosCarregados =
            await respostas[0].json();

        auditoriasCarregadas =
            await respostas[1].json();

        naoConformidadesCarregadas =
            await respostas[2].json();

        preencherProjetos();
        preencherAuditorias();
        aplicarFiltrosAuditorias();
        aplicarFiltrosNaoConformidades();
        atualizarIndicadores();

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            "Erro ao consultar os dados no servidor."
        );
    }
}

/* =====================================================
   SELECTS DINÂMICOS
===================================================== */

const projetoAuditoria =
    obterElemento("projetoAuditoria");

const auditoriaNaoConformidade =
    obterElemento(
        "auditoriaNaoConformidade"
    );

function preencherProjetos() {
    if (!projetoAuditoria) {
        return;
    }

    const valorAtual =
        projetoAuditoria.value;

    projetoAuditoria.innerHTML =
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

            projetoAuditoria.appendChild(
                opcao
            );
        }
    );

    projetoAuditoria.value =
        valorAtual;
}

function preencherAuditorias() {
    if (!auditoriaNaoConformidade) {
        return;
    }

    const valorAtual =
        auditoriaNaoConformidade.value;

    auditoriaNaoConformidade.innerHTML =
        '<option value="">'
        + "Selecione a auditoria"
        + "</option>";

    auditoriasCarregadas.forEach(
        function (auditoria) {
            const opcao =
                document.createElement(
                    "option"
                );

            opcao.value = auditoria.id;

            opcao.textContent =
                auditoria.titulo
                + " — "
                + auditoria.nomeProjeto;

            auditoriaNaoConformidade
                .appendChild(opcao);
        }
    );

    auditoriaNaoConformidade.value =
        valorAtual;
}

/* =====================================================
   FILTROS DE AUDITORIA
===================================================== */

const pesquisaAuditoria =
    obterElemento(
        "pesquisaAuditoria",
        "campoPesquisaAuditoria"
    );

const filtroTipoAuditoria =
    obterElemento(
        "filtroTipoAuditoria",
        "filtroTipo"
    );

const filtroStatusAuditoria =
    obterElemento(
        "filtroStatusAuditoria",
        "filtroStatus"
    );

function aplicarFiltrosAuditorias() {
    const termo =
        pesquisaAuditoria
            ? normalizarTexto(
                pesquisaAuditoria.value
            )
            : "";

    const tipo =
        filtroTipoAuditoria
            ? filtroTipoAuditoria.value
            : "todos";

    const status =
        filtroStatusAuditoria
            ? filtroStatusAuditoria.value
            : "todos";
            
    const botaoLimparFiltrosAuditoria =
    obterElemento(
        "botaoLimparFiltrosAuditoria"
    );

    const filtradas =
        auditoriasCarregadas.filter(
            function (auditoria) {
                const texto =
                    normalizarTexto(
                        auditoria.titulo
                        + " "
                        + auditoria.nomeProjeto
                        + " "
                        + auditoria.responsavel
                    );

                const correspondeTexto =
                    texto.includes(termo);

                const correspondeTipo =
                    tipo === "todos"
                    || tipo === ""
                    || auditoria.tipo === tipo;

                const correspondeStatus =
                    status === "todos"
                    || status === ""
                    || auditoria.status
                        === status;

                return correspondeTexto
                    && correspondeTipo
                    && correspondeStatus;
            }
        );

    renderizarAuditorias(filtradas);
}

if (pesquisaAuditoria) {
    pesquisaAuditoria.addEventListener(
        "input",
        aplicarFiltrosAuditorias
    );
}

if (filtroTipoAuditoria) {
    filtroTipoAuditoria.addEventListener(
        "change",
        aplicarFiltrosAuditorias
    );
}

if (filtroStatusAuditoria) {
    filtroStatusAuditoria.addEventListener(
        "change",
        aplicarFiltrosAuditorias
    );
}

/* =====================================================
   TABELA DE AUDITORIAS
===================================================== */

function renderizarAuditorias(auditorias) {
    if (!corpoTabelaAuditorias) {
        return;
    }

    corpoTabelaAuditorias.innerHTML = "";

    auditorias.forEach(
        function (auditoria) {
            const linha =
                document.createElement("tr");

            linha.innerHTML = `
                <td>
                    <strong>
                        ${escaparHtml(
                            auditoria.titulo
                        )}
                    </strong>
                </td>

                <td>
                    ${escaparHtml(
                        auditoria.nomeProjeto
                    )}
                </td>

                <td>
                    ${nomeTipoAuditoria(
                        auditoria.tipo
                    )}
                </td>

                <td>
                    ${formatarData(
                        auditoria.dataAuditoria
                    )}
                </td>

                <td>
                    <span
                        class="status-auditoria ${auditoria.status}"
                    >
                        ${nomeStatusAuditoria(
                            auditoria.status
                        )}
                    </span>
                </td>

                <td>
                    <div class="acoes-tabela">
                        <button
                            type="button"
                            class="botao-tabela visualizar-auditoria"
                            data-id="${auditoria.id}"
                        >
                            Visualizar
                        </button>

                        <button
                            type="button"
                            class="botao-tabela editar-auditoria"
                            data-id="${auditoria.id}"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="botao-tabela excluir-auditoria"
                            data-id="${auditoria.id}"
                        >
                            Excluir
                        </button>
                    </div>
                </td>
            `;

            corpoTabelaAuditorias
                .appendChild(linha);
        }
    );

    if (quantidadeAuditorias) {
        quantidadeAuditorias.textContent =
            auditorias.length === 1
                ? "1 auditoria encontrada"
                : auditorias.length
                    + " auditorias encontradas";
    }

    if (mensagemSemAuditorias) {
        mensagemSemAuditorias
            .classList.toggle(
                "visivel",
                auditorias.length === 0
            );
    }
}

/* =====================================================
   FILTROS DE NÃO CONFORMIDADES
===================================================== */

const pesquisaNaoConformidade =
    obterElemento(
        "pesquisaNaoConformidade",
        "pesquisaNC"
    );

const filtroGravidade =
    obterElemento(
        "filtroGravidade",
        "filtroGravidadeNaoConformidade"
    );

const filtroStatusNaoConformidade =
    obterElemento(
        "filtroStatusNaoConformidade",
        "filtroStatusNC"
    );

function aplicarFiltrosNaoConformidades() {
    const termo =
        pesquisaNaoConformidade
            ? normalizarTexto(
                pesquisaNaoConformidade.value
            )
            : "";

    const gravidade =
        filtroGravidade
            ? filtroGravidade.value
            : "todos";

    const status =
        filtroStatusNaoConformidade
            ? filtroStatusNaoConformidade.value
            : "todos";

    const filtradas =
        naoConformidadesCarregadas.filter(
            function (registro) {
                const texto =
                    normalizarTexto(
                        registro.titulo
                        + " "
                        + registro.descricao
                        + " "
                        + registro.responsavel
                    );

                const correspondeTexto =
                    texto.includes(termo);

                const correspondeGravidade =
                    gravidade === "todos"
                    || gravidade === ""
                    || registro.gravidade
                        === gravidade;

                const correspondeStatus =
                    status === "todos"
                    || status === ""
                    || registro.status
                        === status;

                return correspondeTexto
                    && correspondeGravidade
                    && correspondeStatus;
            }
        );

    renderizarNaoConformidades(
        filtradas
    );
}

if (pesquisaNaoConformidade) {
    pesquisaNaoConformidade.addEventListener(
        "input",
        aplicarFiltrosNaoConformidades
    );
}

if (filtroGravidade) {
    filtroGravidade.addEventListener(
        "change",
        aplicarFiltrosNaoConformidades
    );
}

if (filtroStatusNaoConformidade) {
    filtroStatusNaoConformidade
        .addEventListener(
            "change",
            aplicarFiltrosNaoConformidades
        );
}

/* =====================================================
   TABELA DE NÃO CONFORMIDADES
===================================================== */

function renderizarNaoConformidades(
    registros
) {
    if (!corpoTabelaNaoConformidades) {
        return;
    }

    corpoTabelaNaoConformidades.innerHTML =
        "";

    registros.forEach(
        function (registro) {
            const auditoria =
                obterAuditoriaPorId(
                    registro.idAuditoria
                );

            const linha =
                document.createElement("tr");

            linha.innerHTML = `
                <td>
                    <strong>
                        ${escaparHtml(
                            registro.titulo
                        )}
                    </strong>
                </td>

                <td>
                    ${escaparHtml(
                        auditoria
                            ? auditoria.titulo
                            : "Auditoria "
                                + registro.idAuditoria
                    )}
                </td>

                <td>
                    <span
                        class="gravidade ${registro.gravidade}"
                    >
                        ${nomeGravidade(
                            registro.gravidade
                        )}
                    </span>
                </td>

                <td>
                    <span
                        class="status-nao-conformidade ${registro.status}"
                    >
                        ${nomeStatusNaoConformidade(
                            registro.status
                        )}
                    </span>
                </td>

                <td>
                    ${escaparHtml(
                        registro.responsavel
                    )}
                </td>

                <td>
                    <div class="acoes-tabela">
                        <button
                            type="button"
                            class="botao-tabela visualizar-nc"
                            data-id="${registro.id}"
                        >
                            Visualizar
                        </button>

                        <button
                            type="button"
                            class="botao-tabela editar-nc"
                            data-id="${registro.id}"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="botao-tabela excluir-nc"
                            data-id="${registro.id}"
                        >
                            Excluir
                        </button>
                    </div>
                </td>
            `;

            corpoTabelaNaoConformidades
                .appendChild(linha);
        }
    );

    if (quantidadeNaoConformidades) {
        quantidadeNaoConformidades
            .textContent =
                registros.length === 1
                    ? "1 não conformidade encontrada"
                    : registros.length
                        + " não conformidades encontradas";
    }

    if (mensagemSemNaoConformidades) {
        mensagemSemNaoConformidades
            .classList.toggle(
                "visivel",
                registros.length === 0
            );
    }
}

/* =====================================================
   MODAL DE AUDITORIA
===================================================== */

const modalAuditoria =
    obterElemento("modalAuditoria");

const formAuditoria =
    obterElemento("formAuditoria");

const botaoNovaAuditoria =
    obterElemento(
        "botaoNovaAuditoria",
        "botaoAbrirFormulario"
    );

const botaoFecharModalAuditoria =
    obterElemento(
        "botaoFecharModalAuditoria",
        "botaoFecharModal"
    );

const botaoCancelarAuditoria =
    obterElemento(
        "botaoCancelarAuditoria"
    );

const tituloModalAuditoria =
    obterElemento(
        "tituloModalAuditoria"
    );

const tituloAuditoria =
    obterElemento("tituloAuditoria");

const tipoAuditoria =
    obterElemento("tipoAuditoria");

const responsavelAuditoria =
    obterElemento(
        "responsavelAuditoria"
    );

const dataAuditoriaCampo =
    obterElemento("dataAuditoria");

const statusAuditoria =
    obterElemento("statusAuditoria");

const observacoesAuditoria =
    obterElemento(
        "observacoesAuditoria"
    );

function abrirModalAuditoria(auditoria) {
    if (!modalAuditoria) {
        mostrarAviso(
            "O formulário de auditoria não foi encontrado."
        );

        return;
    }

    if (formAuditoria) {
        formAuditoria.reset();
    }

    if (auditoria) {
        auditoriaEmEdicaoId =
            auditoria.id;

        if (tituloModalAuditoria) {
            tituloModalAuditoria.textContent =
                "Editar auditoria";
        }

        tituloAuditoria.value =
            auditoria.titulo || "";

        tipoAuditoria.value =
            auditoria.tipo || "";

        projetoAuditoria.value =
            auditoria.idProjeto || "";

        responsavelAuditoria.value =
            auditoria.responsavel || "";

        dataAuditoriaCampo.value =
            auditoria.dataAuditoria || "";

        statusAuditoria.value =
            auditoria.status || "";

        observacoesAuditoria.value =
            auditoria.observacoes || "";

    } else {
        auditoriaEmEdicaoId = null;

        if (tituloModalAuditoria) {
            tituloModalAuditoria.textContent =
                "Nova auditoria";
        }
    }

    modalAuditoria.classList.add(
        "aberto"
    );

    modalAuditoria.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );
}

function fecharModalAuditoria() {
    if (!modalAuditoria) {
        return;
    }

    modalAuditoria.classList.remove(
        "aberto"
    );

    modalAuditoria.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    auditoriaEmEdicaoId = null;
}

if (botaoNovaAuditoria) {
    botaoNovaAuditoria.addEventListener(
        "click",
        function () {
            abrirModalAuditoria(null);
        }
    );
}

if (botaoFecharModalAuditoria) {
    botaoFecharModalAuditoria
        .addEventListener(
            "click",
            fecharModalAuditoria
        );
}

if (botaoCancelarAuditoria) {
    botaoCancelarAuditoria.addEventListener(
        "click",
        fecharModalAuditoria
    );
}

if (modalAuditoria) {
    const fundo =
        modalAuditoria.querySelector(
            ".modal-fundo"
        );

    if (fundo) {
        fundo.addEventListener(
            "click",
            fecharModalAuditoria
        );
    }
}

/* =====================================================
   SALVAR AUDITORIA
===================================================== */

if (formAuditoria) {
    formAuditoria.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            if (
                tituloAuditoria.value
                    .trim().length < 3
                || tipoAuditoria.value === ""
                || projetoAuditoria.value === ""
                || responsavelAuditoria.value
                    .trim().length < 3
                || dataAuditoriaCampo.value === ""
                || statusAuditoria.value === ""
            ) {
                mostrarAviso(
                    "Preencha os campos obrigatórios da auditoria."
                );

                return;
            }

            const auditoria = {
                titulo:
                    tituloAuditoria.value
                        .trim(),

                tipo:
                    tipoAuditoria.value,

                idProjeto:
                    Number(
                        projetoAuditoria.value
                    ),

                nomeProjeto: null,

                responsavel:
                    responsavelAuditoria.value
                        .trim(),

                dataAuditoria:
                    dataAuditoriaCampo.value,

                status:
                    statusAuditoria.value,

                observacoes:
                    observacoesAuditoria
                        ? observacoesAuditoria
                            .value.trim()
                        : ""
            };

            const editando =
                auditoriaEmEdicaoId !== null;

            const endereco =
                editando
                    ? "/api/auditorias/"
                        + auditoriaEmEdicaoId
                    : "/api/auditorias";

            try {
                const resposta =
                    await fetch(
                        endereco,
                        {
                            method:
                                editando
                                    ? "PUT"
                                    : "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    auditoria
                                )
                        }
                    );

                if (!resposta.ok) {
                    const erroApi =
                        await resposta.json();

                    throw new Error(
                        erroApi.erro
                        || "Não foi possível salvar a auditoria."
                    );
                }

                fecharModalAuditoria();

                await carregarDados();

                mostrarAviso(
                    editando
                        ? "Auditoria atualizada com sucesso."
                        : "Auditoria cadastrada com sucesso."
                );

            } catch (erro) {
                console.error(erro);

                mostrarAviso(
                    erro.message
                );
            }
        }
    );
}

/* =====================================================
   AÇÕES DE AUDITORIA
===================================================== */

if (corpoTabelaAuditorias) {
    corpoTabelaAuditorias.addEventListener(
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
                Number(botao.dataset.id);

            const auditoria =
                obterAuditoriaPorId(id);

            if (!auditoria) {
                mostrarAviso(
                    "Auditoria não encontrada."
                );

                return;
            }

            if (
                botao.classList.contains(
                    "visualizar-auditoria"
                )
            ) {
                mostrarAviso(
                    auditoria.titulo
                    + " — Projeto: "
                    + auditoria.nomeProjeto
                    + " — Responsável: "
                    + auditoria.responsavel
                );

                return;
            }

            if (
                botao.classList.contains(
                    "editar-auditoria"
                )
            ) {
                abrirModalAuditoria(
                    auditoria
                );

                return;
            }

            if (
                botao.classList.contains(
                    "excluir-auditoria"
                )
            ) {
                await excluirAuditoria(
                    auditoria
                );
            }
        }
    );
}

async function excluirAuditoria(auditoria) {
    const confirmou =
        window.confirm(
            'Deseja excluir a auditoria "'
            + auditoria.titulo
            + '"?'
        );

    if (!confirmou) {
        return;
    }

    try {
        const resposta =
            await fetch(
                "/api/auditorias/"
                + auditoria.id,
                {
                    method: "DELETE"
                }
            );

        if (!resposta.ok) {
            const erroApi =
                await resposta.json();

            throw new Error(
                erroApi.erro
                || "Não foi possível excluir a auditoria."
            );
        }

        await carregarDados();

        mostrarAviso(
            "Auditoria excluída com sucesso."
        );

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            erro.message
        );
    }
}

/* =====================================================
   MODAL DE NÃO CONFORMIDADE
===================================================== */

const modalNaoConformidade =
    obterElemento(
        "modalNaoConformidade"
    );

const formNaoConformidade =
    obterElemento(
        "formNaoConformidade"
    );

const botaoNovaNaoConformidade =
    obterElemento(
        "botaoNovaNaoConformidade",
        "botaoNovaNC"
    );

const botaoFecharModalNaoConformidade =
    obterElemento(
        "botaoFecharModalNaoConformidade"
    );

const botaoCancelarNaoConformidade =
    obterElemento(
        "botaoCancelarNaoConformidade"
    );

const tituloModalNaoConformidade =
    obterElemento(
        "tituloModalNaoConformidade"
    );

const tituloNaoConformidade =
    obterElemento(
        "tituloNaoConformidade"
    );

const descricaoNaoConformidade =
    obterElemento(
        "descricaoNaoConformidade"
    );

const gravidadeNaoConformidade =
    obterElemento(
        "gravidadeNaoConformidade"
    );

const statusNaoConformidade =
    obterElemento(
        "statusNaoConformidade"
    );

const responsavelNaoConformidade =
    obterElemento(
        "responsavelNaoConformidade"
    );

const dataIdentificacaoNaoConformidade =
    obterElemento(
        "dataIdentificacaoNaoConformidade"
    );

const prazoCorrecaoNaoConformidade =
    obterElemento(
        "prazoCorrecaoNaoConformidade"
    );

const acaoCorretivaNaoConformidade =
    obterElemento(
        "acaoCorretivaNaoConformidade"
    );

function abrirModalNaoConformidade(
    registro
) {
    if (!modalNaoConformidade) {
        mostrarAviso(
            "O formulário de não conformidade não foi encontrado."
        );

        return;
    }

    formNaoConformidade.reset();

    if (registro) {
        naoConformidadeEmEdicaoId =
            registro.id;

        tituloModalNaoConformidade
            .textContent =
                "Editar não conformidade";

        auditoriaNaoConformidade.value =
            registro.idAuditoria || "";

        tituloNaoConformidade.value =
            registro.titulo || "";

        descricaoNaoConformidade.value =
            registro.descricao || "";

        gravidadeNaoConformidade.value =
            registro.gravidade || "";

        statusNaoConformidade.value =
            registro.status || "";

        responsavelNaoConformidade.value =
            registro.responsavel || "";

        dataIdentificacaoNaoConformidade
            .value =
                registro.dataIdentificacao
                || "";

        prazoCorrecaoNaoConformidade
            .value =
                registro.prazoCorrecao
                || "";

        acaoCorretivaNaoConformidade
            .value =
                registro.acaoCorretiva
                || "";

    } else {
        naoConformidadeEmEdicaoId =
            null;

        tituloModalNaoConformidade
            .textContent =
                "Nova não conformidade";

        const hoje =
            new Date()
                .toISOString()
                .substring(0, 10);

        dataIdentificacaoNaoConformidade
            .value = hoje;
    }

    modalNaoConformidade.classList.add(
        "aberto"
    );

    modalNaoConformidade.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );
}

function fecharModalNaoConformidade() {
    if (!modalNaoConformidade) {
        return;
    }

    modalNaoConformidade.classList.remove(
        "aberto"
    );

    modalNaoConformidade.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    naoConformidadeEmEdicaoId = null;
}

if (botaoNovaNaoConformidade) {
    botaoNovaNaoConformidade
        .addEventListener(
            "click",
            function () {
                abrirModalNaoConformidade(
                    null
                );
            }
        );
}

if (botaoFecharModalNaoConformidade) {
    botaoFecharModalNaoConformidade
        .addEventListener(
            "click",
            fecharModalNaoConformidade
        );
}

if (botaoCancelarNaoConformidade) {
    botaoCancelarNaoConformidade
        .addEventListener(
            "click",
            fecharModalNaoConformidade
        );
}

if (modalNaoConformidade) {
    const fundo =
        modalNaoConformidade.querySelector(
            ".modal-fundo"
        );

    if (fundo) {
        fundo.addEventListener(
            "click",
            fecharModalNaoConformidade
        );
    }
}

/* =====================================================
   SALVAR NÃO CONFORMIDADE
===================================================== */

if (formNaoConformidade) {
    formNaoConformidade.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            if (
                auditoriaNaoConformidade.value
                    === ""
                || tituloNaoConformidade.value
                    .trim().length < 3
                || descricaoNaoConformidade
                    .value.trim().length < 10
                || gravidadeNaoConformidade
                    .value === ""
                || statusNaoConformidade
                    .value === ""
                || responsavelNaoConformidade
                    .value.trim().length < 3
            ) {
                mostrarAviso(
                    "Preencha os campos obrigatórios da não conformidade."
                );

                return;
            }

            const registro = {
                idAuditoria:
                    Number(
                        auditoriaNaoConformidade
                            .value
                    ),

                titulo:
                    tituloNaoConformidade
                        .value.trim(),

                descricao:
                    descricaoNaoConformidade
                        .value.trim(),

                gravidade:
                    gravidadeNaoConformidade
                        .value,

                status:
                    statusNaoConformidade
                        .value,

                responsavel:
                    responsavelNaoConformidade
                        .value.trim(),

                dataIdentificacao:
                    dataIdentificacaoNaoConformidade
                        .value || null,

                prazoCorrecao:
                    prazoCorrecaoNaoConformidade
                        .value || null,

                acaoCorretiva:
                    acaoCorretivaNaoConformidade
                        .value.trim()
            };

            const editando =
                naoConformidadeEmEdicaoId
                    !== null;

            const endereco =
                editando
                    ? "/api/nao-conformidades/"
                        + naoConformidadeEmEdicaoId
                    : "/api/nao-conformidades";

            try {
                const resposta =
                    await fetch(
                        endereco,
                        {
                            method:
                                editando
                                    ? "PUT"
                                    : "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    registro
                                )
                        }
                    );

                if (!resposta.ok) {
                    const erroApi =
                        await resposta.json();

                    throw new Error(
                        erroApi.erro
                        || "Não foi possível salvar a não conformidade."
                    );
                }

                fecharModalNaoConformidade();

                await carregarDados();

                mostrarAviso(
                    editando
                        ? "Não conformidade atualizada com sucesso."
                        : "Não conformidade cadastrada com sucesso."
                );

            } catch (erro) {
                console.error(erro);

                mostrarAviso(
                    erro.message
                );
            }
        }
    );
}

/* =====================================================
   AÇÕES DE NÃO CONFORMIDADE
===================================================== */

if (corpoTabelaNaoConformidades) {
    corpoTabelaNaoConformidades
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

                const registro =
                    naoConformidadesCarregadas
                        .find(
                            function (item) {
                                return item.id
                                    === id;
                            }
                        );

                if (!registro) {
                    mostrarAviso(
                        "Não conformidade não encontrada."
                    );

                    return;
                }

                if (
                    botao.classList.contains(
                        "visualizar-nc"
                    )
                ) {
                    mostrarAviso(
                        registro.titulo
                        + " — Gravidade: "
                        + nomeGravidade(
                            registro.gravidade
                        )
                        + " — Status: "
                        + nomeStatusNaoConformidade(
                            registro.status
                        )
                    );

                    return;
                }

                if (
                    botao.classList.contains(
                        "editar-nc"
                    )
                ) {
                    abrirModalNaoConformidade(
                        registro
                    );

                    return;
                }

                if (
                    botao.classList.contains(
                        "excluir-nc"
                    )
                ) {
                    await excluirNaoConformidade(
                        registro
                    );
                }
            }
        );
}

async function excluirNaoConformidade(
    registro
) {
    const confirmou =
        window.confirm(
            'Deseja excluir a não conformidade "'
            + registro.titulo
            + '"?'
        );

    if (!confirmou) {
        return;
    }

    try {
        const resposta =
            await fetch(
                "/api/nao-conformidades/"
                + registro.id,
                {
                    method: "DELETE"
                }
            );

        if (!resposta.ok) {
            const erroApi =
                await resposta.json();

            throw new Error(
                erroApi.erro
                || "Não foi possível excluir a não conformidade."
            );
        }

        await carregarDados();

        mostrarAviso(
            "Não conformidade excluída com sucesso."
        );

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            erro.message
        );
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
            modalAuditoria
            && modalAuditoria.classList
                .contains("aberto")
        ) {
            fecharModalAuditoria();
        }

        if (
            modalNaoConformidade
            && modalNaoConformidade
                .classList.contains(
                    "aberto"
                )
        ) {
            fecharModalNaoConformidade();
        }
    }
);

/* =====================================================
   CONTROLE DAS ABAS
===================================================== */

const botoesAbas =
    document.querySelectorAll(
        ".aba-botao"
    );

const secoesAbas =
    document.querySelectorAll(
        ".secao-aba"
    );

function abrirAba(nomeAba) {
    botoesAbas.forEach(
        function (botao) {
            const abaDoBotao =
                botao.dataset.aba;

            const botaoAtivo =
                abaDoBotao === nomeAba;

            botao.classList.toggle(
                "ativa",
                botaoAtivo
            );

            botao.setAttribute(
                "aria-selected",
                String(botaoAtivo)
            );
        }
    );

    secoesAbas.forEach(
        function (secao) {
            let secaoAtiva = false;

            if (
                nomeAba === "auditorias"
                && secao.id === "abaAuditorias"
            ) {
                secaoAtiva = true;
            }

            if (
                nomeAba === "naoConformidades"
                && secao.id
                    === "abaNaoConformidades"
            ) {
                secaoAtiva = true;
            }

            secao.classList.toggle(
                "ativa",
                secaoAtiva
            );
        }
    );
}

botoesAbas.forEach(
    function (botao) {
        botao.addEventListener(
            "click",
            function () {
                abrirAba(
                    botao.dataset.aba
                );
            }
        );
    }
);



/* =====================================================
   INICIALIZAÇÃO
===================================================== */

carregarDados();