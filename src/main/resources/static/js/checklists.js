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

let checklistsCarregados = [];
let projetosCarregados = [];
let usuariosCarregados = [];
let checklistEmEdicaoId = null;
let temporizadorAviso = null;

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

const pesquisaChecklist =
    obterElemento("pesquisaChecklist");

const filtroStatusChecklist =
    obterElemento("filtroStatusChecklist");

const filtroProjetoChecklist =
    obterElemento("filtroProjetoChecklist");

const botaoLimparFiltrosChecklist =
    obterElemento(
        "botaoLimparFiltrosChecklist"
    );

const listaChecklists =
    obterElemento("listaChecklists");

const mensagemSemChecklists =
    obterElemento("mensagemSemChecklists");

const totalChecklists =
    obterElemento("totalChecklists");

const checklistsAndamento =
    obterElemento("checklistsAndamento");

const checklistsConcluidos =
    obterElemento("checklistsConcluidos");

const checklistsAtrasados =
    obterElemento("checklistsAtrasados");

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

function nomeStatus(status) {
    const nomes = {
        planejado: "Planejado",
        andamento: "Em andamento",
        concluido: "Concluído",
        atrasado: "Atrasado"
    };

    return nomes[status] || status;
}

function classeStatus(status) {
    const classes = {
        planejado: "planejamento",
        andamento: "andamento",
        concluido: "concluido",
        atrasado: "pendente"
    };

    return classes[status] || "";
}

function calcularProgresso(checklist) {
    const total =
        Number(checklist.totalItens) || 0;

    const concluidos =
        Number(checklist.itensConcluidos) || 0;

    if (total <= 0) {
        return 0;
    }

    const percentual =
        Math.round(
            concluidos / total * 100
        );

    return Math.max(
        0,
        Math.min(100, percentual)
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

function obterChecklistPorId(id) {
    return checklistsCarregados.find(
        function (checklist) {
            return Number(checklist.id)
                === Number(id);
        }
    );
}

/* =====================================================
   CONSULTAR APIS
===================================================== */

async function carregarDados() {
    try {
        const respostas =
            await Promise.all([
                fetch(
                    "/api/checklists",
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
                ),
                fetch(
                    "/api/usuarios",
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

        checklistsCarregados =
            await respostas[0].json();

        projetosCarregados =
            await respostas[1].json();

        usuariosCarregados =
            await respostas[2].json();

        preencherProjetos();
        preencherResponsaveis();
        atualizarIndicadores();
        aplicarFiltrosChecklist();

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            "Erro ao consultar os checklists."
        );
    }
}

/* =====================================================
   SELECTS DINÂMICOS
===================================================== */

const projetoChecklist =
    obterElemento("projetoChecklist");

const responsavelChecklist =
    obterElemento("responsavelChecklist");

function preencherProjetos() {
    const valorFormulario =
        projetoChecklist
            ? projetoChecklist.value
            : "";

    const valorFiltro =
        filtroProjetoChecklist
            ? filtroProjetoChecklist.value
            : "todos";

    if (projetoChecklist) {
        projetoChecklist.innerHTML =
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

                projetoChecklist.appendChild(
                    opcao
                );
            }
        );

        projetoChecklist.value =
            valorFormulario;
    }

    if (filtroProjetoChecklist) {
        filtroProjetoChecklist.innerHTML =
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

                filtroProjetoChecklist
                    .appendChild(opcao);
            }
        );

        filtroProjetoChecklist.value =
            valorFiltro;
    }
}

function preencherResponsaveis() {
    if (!responsavelChecklist) {
        return;
    }

    const valorAtual =
        responsavelChecklist.value;

    responsavelChecklist.innerHTML =
        '<option value="">'
        + "Selecione o responsável"
        + "</option>";

    usuariosCarregados
        .filter(
            function (usuario) {
                return usuario.ativo !== false;
            }
        )
        .forEach(
            function (usuario) {
                const opcao =
                    document.createElement(
                        "option"
                    );

                opcao.value = usuario.nome;
                opcao.textContent =
                    usuario.nome;

                responsavelChecklist
                    .appendChild(opcao);
            }
        );

    responsavelChecklist.value =
        valorAtual;
}

/* =====================================================
   INDICADORES E FILTROS
===================================================== */

function atualizarIndicadores() {
    const andamento =
        checklistsCarregados.filter(
            function (checklist) {
                return checklist.status
                    === "andamento";
            }
        ).length;

    const concluidos =
        checklistsCarregados.filter(
            function (checklist) {
                return checklist.status
                    === "concluido";
            }
        ).length;

    const atrasados =
        checklistsCarregados.filter(
            function (checklist) {
                return checklist.status
                    === "atrasado";
            }
        ).length;

    if (totalChecklists) {
        totalChecklists.textContent =
            checklistsCarregados.length;
    }

    if (checklistsAndamento) {
        checklistsAndamento.textContent =
            andamento;
    }

    if (checklistsConcluidos) {
        checklistsConcluidos.textContent =
            concluidos;
    }

    if (checklistsAtrasados) {
        checklistsAtrasados.textContent =
            atrasados;
    }
}

function aplicarFiltrosChecklist() {
    const termo =
        pesquisaChecklist
            ? normalizarTexto(
                pesquisaChecklist.value
            )
            : "";

    const statusSelecionado =
        filtroStatusChecklist
            ? filtroStatusChecklist.value
            : "todos";

    const projetoSelecionado =
        filtroProjetoChecklist
            ? filtroProjetoChecklist.value
            : "todos";

    const filtrados =
        checklistsCarregados.filter(
            function (checklist) {
                const texto =
                    normalizarTexto(
                        checklist.titulo
                        + " "
                        + checklist.nomeProjeto
                        + " "
                        + checklist.responsavel
                        + " "
                        + checklist.descricao
                    );

                const correspondePesquisa =
                    texto.includes(termo);

                const correspondeStatus =
                    statusSelecionado
                        === "todos"
                    || statusSelecionado
                        === ""
                    || checklist.status
                        === statusSelecionado;

                const correspondeProjeto =
                    projetoSelecionado
                        === "todos"
                    || projetoSelecionado
                        === ""
                    || String(
                        checklist.idProjeto
                    ) === String(
                        projetoSelecionado
                    );

                return correspondePesquisa
                    && correspondeStatus
                    && correspondeProjeto;
            }
        );

    renderizarChecklists(filtrados);
}

if (pesquisaChecklist) {
    pesquisaChecklist.addEventListener(
        "input",
        aplicarFiltrosChecklist
    );
}

if (filtroStatusChecklist) {
    filtroStatusChecklist.addEventListener(
        "change",
        aplicarFiltrosChecklist
    );
}

if (filtroProjetoChecklist) {
    filtroProjetoChecklist.addEventListener(
        "change",
        aplicarFiltrosChecklist
    );
}

if (botaoLimparFiltrosChecklist) {
    botaoLimparFiltrosChecklist
        .addEventListener(
            "click",
            function () {
                if (pesquisaChecklist) {
                    pesquisaChecklist.value =
                        "";
                }

                if (filtroStatusChecklist) {
                    filtroStatusChecklist.value =
                        "todos";
                }

                if (filtroProjetoChecklist) {
                    filtroProjetoChecklist.value =
                        "todos";
                }

                aplicarFiltrosChecklist();

                mostrarAviso(
                    "Os filtros foram removidos."
                );
            }
        );
}

/* =====================================================
   RENDERIZAÇÃO DOS CARTÕES
===================================================== */

function renderizarChecklists(checklists) {
    if (!listaChecklists) {
        return;
    }

    listaChecklists.innerHTML = "";

    checklists.forEach(
        function (checklist) {
            const progresso =
                calcularProgresso(checklist);

            const cartao =
                document.createElement(
                    "article"
                );

            cartao.className =
                "cartao-checklist";

            cartao.dataset.status =
                checklist.status;

            cartao.dataset.projeto =
                checklist.idProjeto;

            const textoPrazo =
                checklist.status === "atrasado"
                    ? "Prazo vencido: "
                    : "Prazo: ";

            const classePrazo =
                checklist.status === "atrasado"
                    ? "texto-erro"
                    : "";

            cartao.innerHTML = `
                <div class="checklist-cabecalho">

                    <div>
                        <span
                            class="status ${classeStatus(
                                checklist.status
                            )}"
                        >
                            ${escaparHtml(
                                nomeStatus(
                                    checklist.status
                                )
                            )}
                        </span>

                        <h2>
                            ${escaparHtml(
                                checklist.titulo
                            )}
                        </h2>

                        <p>
                            ${escaparHtml(
                                checklist.nomeProjeto
                            )}
                        </p>
                    </div>

                </div>

                <div class="checklist-progresso">

                    <div
                        class="checklist-progresso-texto"
                    >
                        <span>Progresso</span>

                        <strong>
                            ${progresso}%
                        </strong>
                    </div>

                    <div
                        class="progresso-linha checklist-barra"
                    >
                        <div
                            class="progresso-barra"
                            style="width: ${progresso}%;"
                        ></div>
                    </div>

                    <small>
                        ${checklist.itensConcluidos}
                        de
                        ${checklist.totalItens}
                        itens concluídos
                    </small>

                </div>

                <div class="checklist-informacoes">

                    <span>
                        Responsável:
                        ${escaparHtml(
                            checklist.responsavel
                        )}
                    </span>

                    <span class="${classePrazo}">
                        ${textoPrazo}
                        ${formatarData(
                            checklist.prazo
                        )}
                    </span>

                </div>

                <div class="checklist-acoes">

                    <button
                        type="button"
                        class="botao-secundario abrir-checklist"
                        data-id="${checklist.id}"
                    >
                        Abrir checklist
                    </button>

                    <button
                        type="button"
                        class="botao-tabela editar-checklist"
                        data-id="${checklist.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="botao-tabela excluir-checklist"
                        data-id="${checklist.id}"
                    >
                        Excluir
                    </button>

                </div>
            `;

            listaChecklists.appendChild(
                cartao
            );
        }
    );

    if (mensagemSemChecklists) {
        mensagemSemChecklists
            .classList.toggle(
                "visivel",
                checklists.length === 0
            );
    }
}

/* =====================================================
   MODAL E FORMULÁRIO
===================================================== */

const modalChecklist =
    obterElemento("modalChecklist");

const formChecklist =
    obterElemento("formChecklist");

const botaoNovoChecklist =
    obterElemento("botaoNovoChecklist");

const botaoFecharChecklist =
    obterElemento("botaoFecharChecklist");

const botaoCancelarChecklist =
    obterElemento("botaoCancelarChecklist");

const tituloModalChecklist =
    obterElemento("tituloModalChecklist");

const tituloChecklist =
    obterElemento("tituloChecklist");

const prazoChecklist =
    obterElemento("prazoChecklist");

const statusChecklist =
    obterElemento("statusChecklist");

const totalItensChecklist =
    obterElemento("totalItensChecklist");

const itensConcluidosChecklist =
    obterElemento(
        "itensConcluidosChecklist"
    );

const descricaoChecklist =
    obterElemento("descricaoChecklist");

function abrirModalChecklist(checklist) {
    if (
        !modalChecklist
        || !formChecklist
        || !tituloChecklist
        || !projetoChecklist
        || !responsavelChecklist
        || !prazoChecklist
        || !statusChecklist
        || !totalItensChecklist
        || !itensConcluidosChecklist
        || !descricaoChecklist
    ) {
        mostrarAviso(
            "O formulário de checklist está incompleto."
        );

        return;
    }

    formChecklist.reset();

    if (checklist) {
        checklistEmEdicaoId =
            checklist.id;

        if (tituloModalChecklist) {
            tituloModalChecklist.textContent =
                "Editar checklist";
        }

        tituloChecklist.value =
            checklist.titulo || "";

        projetoChecklist.value =
            checklist.idProjeto || "";

        responsavelChecklist.value =
            checklist.responsavel || "";

        prazoChecklist.value =
            checklist.prazo || "";

        statusChecklist.value =
            checklist.status || "";

        totalItensChecklist.value =
            checklist.totalItens || 1;

        itensConcluidosChecklist.value =
            checklist.itensConcluidos || 0;

        descricaoChecklist.value =
            checklist.descricao || "";

    } else {
        checklistEmEdicaoId = null;

        if (tituloModalChecklist) {
            tituloModalChecklist.textContent =
                "Novo checklist";
        }

        statusChecklist.value =
            "planejado";

        totalItensChecklist.value = 1;
        itensConcluidosChecklist.value = 0;
    }

    modalChecklist.classList.add(
        "aberto"
    );

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
    if (!modalChecklist) {
        return;
    }

    modalChecklist.classList.remove(
        "aberto"
    );

    modalChecklist.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    checklistEmEdicaoId = null;
}

if (botaoNovoChecklist) {
    botaoNovoChecklist.addEventListener(
        "click",
        function () {
            abrirModalChecklist(null);
        }
    );
}

if (botaoFecharChecklist) {
    botaoFecharChecklist.addEventListener(
        "click",
        fecharModalChecklist
    );
}

if (botaoCancelarChecklist) {
    botaoCancelarChecklist.addEventListener(
        "click",
        fecharModalChecklist
    );
}

if (modalChecklist) {
    const fundo =
        modalChecklist.querySelector(
            ".modal-fundo"
        );

    if (fundo) {
        fundo.addEventListener(
            "click",
            fecharModalChecklist
        );
    }
}

/* =====================================================
   SALVAR CHECKLIST
===================================================== */

if (formChecklist) {
    formChecklist.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            const total =
                Number(
                    totalItensChecklist.value
                );

            const concluidos =
                Number(
                    itensConcluidosChecklist.value
                );

            if (
                tituloChecklist.value
                    .trim().length < 3
                || projetoChecklist.value === ""
                || responsavelChecklist.value
                    === ""
                || prazoChecklist.value === ""
                || statusChecklist.value === ""
                || !Number.isInteger(total)
                || total < 1
                || !Number.isInteger(concluidos)
                || concluidos < 0
                || concluidos > total
                || descricaoChecklist.value
                    .trim().length < 10
            ) {
                mostrarAviso(
                    "Preencha corretamente os campos obrigatórios."
                );

                return;
            }

            const checklist = {
                titulo:
                    tituloChecklist.value
                        .trim(),

                idProjeto:
                    Number(
                        projetoChecklist.value
                    ),

                nomeProjeto: null,

                responsavel:
                    responsavelChecklist.value,

                prazo:
                    prazoChecklist.value,

                status:
                    statusChecklist.value,

                descricao:
                    descricaoChecklist.value
                        .trim(),

                totalItens:
                    total,

                itensConcluidos:
                    concluidos
            };

            const editando =
                checklistEmEdicaoId !== null;

            const endereco =
                editando
                    ? "/api/checklists/"
                        + checklistEmEdicaoId
                    : "/api/checklists";

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

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    checklist
                                )
                        }
                    );

                if (!resposta.ok) {
                    const mensagem =
                        await obterMensagemErro(
                            resposta,
                            "Não foi possível salvar o checklist."
                        );

                    throw new Error(
                        mensagem
                    );
                }

                fecharModalChecklist();
                await carregarDados();

                mostrarAviso(
                    editando
                        ? "Checklist atualizado com sucesso."
                        : "Checklist cadastrado com sucesso."
                );

            } catch (erro) {
                console.error(erro);
                mostrarAviso(erro.message);
            }
        }
    );
}

/* =====================================================
   AÇÕES DOS CARTÕES
===================================================== */

if (listaChecklists) {
    listaChecklists.addEventListener(
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

            const checklist =
                obterChecklistPorId(id);

            if (!checklist) {
                mostrarAviso(
                    "Checklist não encontrado."
                );

                return;
            }

            if (
                botao.classList.contains(
                    "abrir-checklist"
                )
                || botao.classList.contains(
                    "editar-checklist"
                )
            ) {
                abrirModalChecklist(
                    checklist
                );

                return;
            }

            if (
                botao.classList.contains(
                    "excluir-checklist"
                )
            ) {
                await excluirChecklist(
                    checklist
                );
            }
        }
    );
}

async function excluirChecklist(checklist) {
    const confirmou =
        window.confirm(
            'Deseja excluir o checklist "'
            + checklist.titulo
            + '"?'
        );

    if (!confirmou) {
        return;
    }

    try {
        const resposta =
            await fetch(
                "/api/checklists/"
                + checklist.id,
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
                    "Não foi possível excluir o checklist."
                );

            throw new Error(mensagem);
        }

        await carregarDados();

        mostrarAviso(
            "Checklist excluído com sucesso."
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
            modalChecklist
            && modalChecklist.classList
                .contains("aberto")
        ) {
            fecharModalChecklist();
        }
    }
);

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

carregarDados();
