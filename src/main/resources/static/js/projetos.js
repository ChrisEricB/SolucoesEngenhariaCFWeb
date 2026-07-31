/* =====================================================
   ELEMENTOS GERAIS
===================================================== */

const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.querySelector(".menu-lateral");

const botaoNotificacao =
    document.getElementById("botaoNotificacao");

const mensagemNotificacao =
    document.getElementById("mensagemNotificacao");

const dataAtual =
    document.getElementById("dataAtual");

const pesquisaProjeto =
    document.getElementById("pesquisaProjeto");

const filtroStatus =
    document.getElementById("filtroStatus");

const filtroResponsavel =
    document.getElementById("filtroResponsavel");

const botaoLimparFiltros =
    document.getElementById("botaoLimparFiltros");

const corpoTabelaProjetos =
    document.getElementById("corpoTabelaProjetos");

const quantidadeProjetos =
    document.getElementById("quantidadeProjetos");

const mensagemSemProjetos =
    document.getElementById("mensagemSemProjetos");

let temporizadorAviso;
let projetosCarregados = [];
let projetoEmEdicaoId = null;

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
        "Você possui 3 notificações relacionadas aos projetos."
    );
});

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function escaparHtml(texto) {
    const elemento = document.createElement("div");

    elemento.textContent =
        texto === null || texto === undefined
            ? ""
            : texto;

    return elemento.innerHTML;
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

function obterNomeStatus(status) {
    const nomes = {
        planejamento: "Planejamento",
        andamento: "Em andamento",
        concluido: "Concluído"
    };

    return nomes[status] || status;
}

function obterClasseStatus(status) {
    const classes = {
        planejamento: "planejamento",
        andamento: "andamento",
        concluido: "concluido"
    };

    return classes[status] || "planejamento";
}

function obterChaveResponsavel(responsavel) {
    const chaves = {
        "Christian Barrantes": "christian",
        "Fihama Santos": "fihama",
        "Carlos Barrantes": "carlos"
    };

    return chaves[responsavel]
        || responsavel.toLowerCase();
}

/* =====================================================
   CONSULTAR A API
===================================================== */

async function carregarProjetos() {
    quantidadeProjetos.textContent =
        "Carregando projetos...";

    try {
        const resposta = await fetch("/api/projetos");

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível consultar os projetos."
            );
        }

        projetosCarregados =
            await resposta.json();

        aplicarFiltros();

    } catch (erro) {
        console.error(erro);

        corpoTabelaProjetos.innerHTML = "";

        quantidadeProjetos.textContent =
            "Erro ao carregar projetos";

        mensagemSemProjetos.textContent =
            "Não foi possível carregar os projetos.";

        mensagemSemProjetos.classList.add(
            "visivel"
        );

        mostrarAviso(
            "Erro ao consultar os projetos no servidor."
        );
    }
}

/* =====================================================
   FILTROS E EXIBIÇÃO
===================================================== */

function aplicarFiltros() {
    const termo =
        pesquisaProjeto.value
            .trim()
            .toLowerCase();

    const statusSelecionado =
        filtroStatus.value;

    const responsavelSelecionado =
        filtroResponsavel.value;

    const projetosFiltrados =
        projetosCarregados.filter(
            function (projeto) {
                const textoProjeto = [
                    projeto.nome,
                    projeto.descricao,
                    projeto.responsavel,
                    obterNomeStatus(projeto.status)
                ]
                    .join(" ")
                    .toLowerCase();

                const correspondePesquisa =
                    textoProjeto.includes(termo);

                const correspondeStatus =
                    statusSelecionado === "todos"
                    || projeto.status
                        === statusSelecionado;

                const chaveResponsavel =
                    obterChaveResponsavel(
                        projeto.responsavel
                    );

                const correspondeResponsavel =
                    responsavelSelecionado
                        === "todos"
                    || chaveResponsavel
                        === responsavelSelecionado;

                return correspondePesquisa
                    && correspondeStatus
                    && correspondeResponsavel;
            }
        );

    renderizarProjetos(projetosFiltrados);
}

function renderizarProjetos(projetos) {
    corpoTabelaProjetos.innerHTML = "";

    projetos.forEach(function (projeto) {
        const linha =
            document.createElement("tr");

        const progresso =
            projeto.progresso !== null
                && projeto.progresso !== undefined
                 ? projeto.progresso
                 : 0;

        linha.innerHTML = `
            <td>
                <strong>
                    ${escaparHtml(projeto.nome)}
                </strong>

                <span>
                    ${escaparHtml(projeto.descricao)}
                </span>
            </td>

            <td>
                ${escaparHtml(projeto.responsavel)}
            </td>

            <td>
                ${formatarData(projeto.dataInicio)}
            </td>

            <td>
                <span
                    class="status ${obterClasseStatus(projeto.status)}"
                >
                    ${obterNomeStatus(projeto.status)}
                </span>
            </td>

            <td>
                <div class="progresso-linha">
                    <div
                        class="progresso-barra"
                        style="width: ${progresso}%;"
                    ></div>
                </div>

                <small>${progresso}%</small>
            </td>

            <td>
                <div class="acoes-tabela">

                    <button
                        type="button"
                        class="botao-tabela visualizar"
                        data-id="${projeto.id}"
                    >
                        Visualizar
                    </button>

                    <button
                        type="button"
                        class="botao-tabela editar"
                        data-id="${projeto.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="botao-tabela excluir-projeto"
                        data-id="${projeto.id}"
                    >
                        Excluir
                    </button>

                </div>
            </td>
        `;

        corpoTabelaProjetos.appendChild(linha);
    });

    quantidadeProjetos.textContent =
        projetos.length === 1
            ? "1 projeto encontrado"
            : projetos.length
                + " projetos encontrados";

    mensagemSemProjetos.classList.toggle(
        "visivel",
        projetos.length === 0
    );
}

pesquisaProjeto.addEventListener(
    "input",
    aplicarFiltros
);

filtroStatus.addEventListener(
    "change",
    aplicarFiltros
);

filtroResponsavel.addEventListener(
    "change",
    aplicarFiltros
);

botaoLimparFiltros.addEventListener(
    "click",
    function () {
        pesquisaProjeto.value = "";
        filtroStatus.value = "todos";
        filtroResponsavel.value = "todos";

        aplicarFiltros();

        mostrarAviso(
            "Os filtros foram removidos."
        );
    }
);

/* =====================================================
   ELEMENTOS DO FORMULÁRIO
===================================================== */

const modalProjeto =
    document.getElementById("modalProjeto");

const botaoAbrirFormulario =
    document.getElementById(
        "botaoAbrirFormulario"
    );

const botaoFecharModal =
    document.getElementById(
        "botaoFecharModal"
    );

const botaoCancelarProjeto =
    document.getElementById(
        "botaoCancelarProjeto"
    );

const fundoModal =
    modalProjeto.querySelector(".modal-fundo");

const formProjeto =
    document.getElementById("formProjeto");

const tituloModalProjeto =
    document.getElementById(
        "tituloModalProjeto"
    );

const nomeProjeto =
    document.getElementById("nomeProjeto");

const responsavelProjeto =
    document.getElementById(
        "responsavelProjeto"
    );

const statusProjeto =
    document.getElementById("statusProjeto");

const dataInicioProjeto =
    document.getElementById(
        "dataInicioProjeto"
    );

const progressoProjeto =
    document.getElementById(
        "progressoProjeto"
    );

const descricaoProjeto =
    document.getElementById(
        "descricaoProjeto"
    );

const erroNomeProjeto =
    document.getElementById(
        "erroNomeProjeto"
    );

const erroResponsavelProjeto =
    document.getElementById(
        "erroResponsavelProjeto"
    );

const erroStatusProjeto =
    document.getElementById(
        "erroStatusProjeto"
    );

const erroDataInicioProjeto =
    document.getElementById(
        "erroDataInicioProjeto"
    );

const erroProgressoProjeto =
    document.getElementById(
        "erroProgressoProjeto"
    );

const erroDescricaoProjeto =
    document.getElementById(
        "erroDescricaoProjeto"
    );

/* =====================================================
   ABRIR E FECHAR O MODAL
===================================================== */

function abrirModalNovoProjeto() {
    projetoEmEdicaoId = null;

    tituloModalProjeto.textContent =
        "Novo projeto";

    formProjeto.reset();
    limparErros();

    progressoProjeto.value = "0";

    modalProjeto.classList.add("aberto");

    modalProjeto.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );

    nomeProjeto.focus();
}

function abrirModalEdicao(projeto) {
    projetoEmEdicaoId = projeto.id;

    tituloModalProjeto.textContent =
        "Editar projeto";

    limparErros();

    nomeProjeto.value =
        projeto.nome || "";

    responsavelProjeto.value =
        projeto.responsavel || "";

    statusProjeto.value =
        projeto.status || "";

    dataInicioProjeto.value =
        projeto.dataInicio || "";

    progressoProjeto.value =
        progressoProjeto.value =
            projeto.progresso !== null
                && projeto.progresso !== undefined
                ? projeto.progresso
                : 0;

    descricaoProjeto.value =
        projeto.descricao || "";

    modalProjeto.classList.add("aberto");

    modalProjeto.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );

    nomeProjeto.focus();
}

function fecharModal() {
    modalProjeto.classList.remove("aberto");

    modalProjeto.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    formProjeto.reset();
    limparErros();

    projetoEmEdicaoId = null;
}

botaoAbrirFormulario.addEventListener(
    "click",
    abrirModalNovoProjeto
);

botaoFecharModal.addEventListener(
    "click",
    fecharModal
);

botaoCancelarProjeto.addEventListener(
    "click",
    fecharModal
);

fundoModal.addEventListener(
    "click",
    fecharModal
);

/* =====================================================
   VALIDAÇÕES
===================================================== */

function limparErros() {
    const mensagens = [
        erroNomeProjeto,
        erroResponsavelProjeto,
        erroStatusProjeto,
        erroDataInicioProjeto,
        erroProgressoProjeto,
        erroDescricaoProjeto
    ];

    mensagens.forEach(function (mensagem) {
        mensagem.textContent = "";
    });

    const campos = [
        nomeProjeto,
        responsavelProjeto,
        statusProjeto,
        dataInicioProjeto,
        progressoProjeto,
        descricaoProjeto
    ];

    campos.forEach(function (campo) {
        campo.classList.remove(
            "campo-invalido"
        );
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

function validarProjeto() {
    limparErros();

    let formularioValido = true;

    const nome =
        nomeProjeto.value.trim();

    const descricao =
        descricaoProjeto.value.trim();

    const progresso =
        Number(progressoProjeto.value);

    if (nome.length < 3) {
        marcarErro(
            nomeProjeto,
            erroNomeProjeto,
            "Informe um nome com pelo menos 3 caracteres."
        );

        formularioValido = false;
    }

    if (responsavelProjeto.value === "") {
        marcarErro(
            responsavelProjeto,
            erroResponsavelProjeto,
            "Selecione o responsável."
        );

        formularioValido = false;
    }

    if (statusProjeto.value === "") {
        marcarErro(
            statusProjeto,
            erroStatusProjeto,
            "Selecione o status."
        );

        formularioValido = false;
    }

    if (dataInicioProjeto.value === "") {
        marcarErro(
            dataInicioProjeto,
            erroDataInicioProjeto,
            "Informe a data de início."
        );

        formularioValido = false;
    }

    if (
        progressoProjeto.value === ""
        || progresso < 0
        || progresso > 100
    ) {
        marcarErro(
            progressoProjeto,
            erroProgressoProjeto,
            "Informe um progresso entre 0 e 100."
        );

        formularioValido = false;
    }

    if (descricao.length < 10) {
        marcarErro(
            descricaoProjeto,
            erroDescricaoProjeto,
            "Informe uma descrição com pelo menos 10 caracteres."
        );

        formularioValido = false;
    }

    return formularioValido;
}

/* =====================================================
   ERROS RECEBIDOS DO BACK-END
===================================================== */

function exibirErrosDaApi(campos) {
    const configuracao = {
        nome: [
            nomeProjeto,
            erroNomeProjeto
        ],

        responsavel: [
            responsavelProjeto,
            erroResponsavelProjeto
        ],

        status: [
            statusProjeto,
            erroStatusProjeto
        ],

        dataInicio: [
            dataInicioProjeto,
            erroDataInicioProjeto
        ],

        progresso: [
            progressoProjeto,
            erroProgressoProjeto
        ],

        descricao: [
            descricaoProjeto,
            erroDescricaoProjeto
        ]
    };

    Object.entries(campos || {}).forEach(
        function ([nomeCampo, mensagem]) {
            const elementos =
                configuracao[nomeCampo];

            if (!elementos) {
                return;
            }

            marcarErro(
                elementos[0],
                elementos[1],
                mensagem
            );
        }
    );
}

/* =====================================================
   SALVAR NO BACK-END
===================================================== */

formProjeto.addEventListener(
    "submit",
    async function (evento) {
        evento.preventDefault();

        if (!validarProjeto()) {
            mostrarAviso(
                "Verifique os campos obrigatórios."
            );

            return;
        }

        const projeto = {
            nome: nomeProjeto.value.trim(),
            descricao:
                descricaoProjeto.value.trim(),

            status: statusProjeto.value,

            idCliente: null,

            dataInicio:
                dataInicioProjeto.value,

            dataFimPrevista: null,
            dataFimReal: null,
            orcamento: null,

            responsavel:
                responsavelProjeto.value,

            progresso:
                Number(progressoProjeto.value)
        };

        const editando =
            projetoEmEdicaoId !== null;

        const endereco = editando
            ? "/api/projetos/"
                + projetoEmEdicaoId
            : "/api/projetos";

        const metodo =
            editando ? "PUT" : "POST";

        try {
            const resposta = await fetch(
                endereco,
                {
                    method: metodo,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(projeto)
                }
            );

            if (!resposta.ok) {
                const erroApi =
                    await resposta.json();

                exibirErrosDaApi(
                    erroApi.campos
                );

                throw new Error(
                    erroApi.erro
                    || "Não foi possível salvar o projeto."
                );
            }

            fecharModal();

            await carregarProjetos();

            mostrarAviso(
                editando
                    ? "Projeto atualizado com sucesso."
                    : "Projeto cadastrado com sucesso."
            );

        } catch (erro) {
            console.error(erro);

            mostrarAviso(
                erro.message
                || "Erro ao salvar o projeto."
            );
        }
    }
);

/* =====================================================
   VISUALIZAR, EDITAR E EXCLUIR
===================================================== */

corpoTabelaProjetos.addEventListener(
    "click",
    async function (evento) {
        const botao =
            evento.target.closest("button");

        if (!botao) {
            return;
        }

        const id =
            Number(botao.dataset.id);

        const projeto =
            projetosCarregados.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!projeto) {
            mostrarAviso(
                "Projeto não encontrado."
            );

            return;
        }

        if (
            botao.classList.contains(
                "visualizar"
            )
        ) {
            mostrarAviso(
                projeto.nome
                + " — Responsável: "
                + projeto.responsavel
                + " — Progresso: "
                + projeto.progresso
                + "%."
            );

            return;
        }

        if (
            botao.classList.contains(
                "editar"
            )
        ) {
            abrirModalEdicao(projeto);
            return;
        }

        if (
            botao.classList.contains(
                "excluir-projeto"
            )
        ) {
            await excluirProjeto(projeto);
        }
    }
);

async function excluirProjeto(projeto) {
    const confirmou = window.confirm(
        'Deseja realmente excluir o projeto "'
        + projeto.nome
        + '"?'
    );

    if (!confirmou) {
        return;
    }

    try {
        const resposta = await fetch(
            "/api/projetos/" + projeto.id,
            {
                method: "DELETE"
            }
        );

        if (!resposta.ok) {
            let mensagem =
                "Não foi possível excluir o projeto.";

            try {
                const erroApi =
                    await resposta.json();

                mensagem =
                    erroApi.erro || mensagem;

            } catch (erroLeitura) {
                console.error(erroLeitura);
            }

            throw new Error(mensagem);
        }

        await carregarProjetos();

        mostrarAviso(
            "Projeto excluído com sucesso."
        );

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            erro.message
            || "Erro ao excluir o projeto."
        );
    }
}

/* =====================================================
   LIMPEZA DOS ERROS DURANTE O PREENCHIMENTO
===================================================== */

const camposFormulario = [
    nomeProjeto,
    responsavelProjeto,
    statusProjeto,
    dataInicioProjeto,
    progressoProjeto,
    descricaoProjeto
];

camposFormulario.forEach(function (campo) {
    campo.addEventListener(
        "input",
        function () {
            campo.classList.remove(
                "campo-invalido"
            );
        }
    );

    campo.addEventListener(
        "change",
        function () {
            campo.classList.remove(
                "campo-invalido"
            );
        }
    );
});

/* =====================================================
   TECLA ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    function (evento) {
        if (evento.key !== "Escape") {
            return;
        }

        menuLateral.classList.remove(
            "aberto"
        );

        if (
            modalProjeto.classList.contains(
                "aberto"
            )
        ) {
            fecharModal();
        }
    }
);

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

carregarProjetos();