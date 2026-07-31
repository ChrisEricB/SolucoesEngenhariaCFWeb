/* =====================================================
   LOCALIZAÇÃO DOS ELEMENTOS
===================================================== */

function obterElemento() {
    for (let indice = 0; indice < arguments.length; indice++) {
        const elemento =
            document.getElementById(arguments[indice]);

        if (elemento) {
            return elemento;
        }
    }

    return null;
}

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

const pesquisaUsuario =
    obterElemento("pesquisaUsuario");

const filtroPerfil =
    obterElemento(
        "filtroPerfil",
        "filtroPerfilUsuario"
    );

const filtroSituacao =
    obterElemento(
        "filtroSituacao",
        "filtroSituacaoUsuario",
        "filtroStatusUsuario"
    );

const botaoLimparFiltros =
    obterElemento("botaoLimparFiltros");

const corpoTabelaUsuarios =
    obterElemento("corpoTabelaUsuarios");

const quantidadeUsuarios =
    obterElemento("quantidadeUsuarios");

const mensagemSemUsuarios =
    obterElemento("mensagemSemUsuarios");

const indicadorTotalUsuarios =
    obterElemento(
        "indicadorTotalUsuarios",
        "totalUsuarios"
    );

const indicadorUsuariosAtivos =
    obterElemento(
        "indicadorUsuariosAtivos",
        "usuariosAtivos"
    );

const indicadorAdministradores =
    obterElemento(
        "indicadorAdministradores",
        "totalAdministradores"
    );

let usuariosCarregados = [];
let usuarioEmEdicaoId = null;
let temporizadorAviso;

/* =====================================================
   DATA ATUAL
===================================================== */

function mostrarDataAtual() {
    if (!dataAtual) {
        return;
    }

    const hoje = new Date();

    const dataFormatada =
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
        dataFormatada.charAt(0).toUpperCase()
        + dataFormatada.slice(1);
}

mostrarDataAtual();

/* =====================================================
   MENU RESPONSIVO
===================================================== */

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

/* =====================================================
   AVISOS
===================================================== */

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
                mensagemNotificacao.classList.remove(
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
                "Não existem novas notificações de usuários."
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

function obterIniciais(nome) {
    if (!nome) {
        return "US";
    }

    const palavras =
        nome.trim().split(/\s+/);

    if (palavras.length === 1) {
        return palavras[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        palavras[0].charAt(0)
        + palavras[palavras.length - 1].charAt(0)
    ).toUpperCase();
}

function formatarData(dataHora) {
    if (!dataHora) {
        return "-";
    }

    const data =
        new Date(dataHora);

    if (Number.isNaN(data.getTime())) {
        return "-";
    }

    return data.toLocaleDateString(
        "pt-BR"
    );
}

function obterNomePerfil(perfil) {
    const nomes = {
        administrador: "Administrador",
        gerente: "Gerente",
        consultor: "Consultor",
        engenheiro: "Engenheiro",
        cliente: "Cliente"
    };

    return nomes[perfil] || perfil;
}

function normalizarTexto(texto) {
    return String(texto || "")
        .trim()
        .toLowerCase();
}

/* =====================================================
   CONSULTAR USUÁRIOS
===================================================== */

async function carregarUsuarios() {
    if (quantidadeUsuarios) {
        quantidadeUsuarios.textContent =
            "Carregando usuários...";
    }

    try {
        const resposta =
            await fetch("/api/usuarios");

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível consultar os usuários."
            );
        }

        usuariosCarregados =
            await resposta.json();

        atualizarIndicadores();
        aplicarFiltros();

    } catch (erro) {
        console.error(erro);

        if (corpoTabelaUsuarios) {
            corpoTabelaUsuarios.innerHTML = "";
        }

        if (quantidadeUsuarios) {
            quantidadeUsuarios.textContent =
                "Erro ao carregar usuários";
        }

        if (mensagemSemUsuarios) {
            mensagemSemUsuarios.textContent =
                "Não foi possível carregar os usuários.";

            mensagemSemUsuarios.classList.add(
                "visivel"
            );
        }

        mostrarAviso(
            "Erro ao consultar os usuários no servidor."
        );
    }
}

/* =====================================================
   INDICADORES
===================================================== */

function atualizarIndicadores() {
    const total =
        usuariosCarregados.length;

    const ativos =
        usuariosCarregados.filter(
            function (usuario) {
                return usuario.ativo === true;
            }
        ).length;

    const administradores =
        usuariosCarregados.filter(
            function (usuario) {
                return usuario.perfil
                    === "administrador";
            }
        ).length;

    if (indicadorTotalUsuarios) {
        indicadorTotalUsuarios.textContent =
            total;
    }

    if (indicadorUsuariosAtivos) {
        indicadorUsuariosAtivos.textContent =
            ativos;
    }

    if (indicadorAdministradores) {
        indicadorAdministradores.textContent =
            administradores;
    }
}

/* =====================================================
   FILTROS
===================================================== */

function aplicarFiltros() {
    const termo =
        pesquisaUsuario
            ? normalizarTexto(
                pesquisaUsuario.value
            )
            : "";

    const perfilSelecionado =
        filtroPerfil
            ? filtroPerfil.value
            : "todos";

    const situacaoSelecionada =
        filtroSituacao
            ? filtroSituacao.value
            : "todos";

    const usuariosFiltrados =
        usuariosCarregados.filter(
            function (usuario) {
                const textoUsuario =
                    normalizarTexto(
                        usuario.nome
                        + " "
                        + usuario.email
                        + " "
                        + obterNomePerfil(
                            usuario.perfil
                        )
                    );

                const correspondePesquisa =
                    textoUsuario.includes(termo);

                const correspondePerfil =
                    perfilSelecionado === "todos"
                    || perfilSelecionado === ""
                    || usuario.perfil
                        === perfilSelecionado;

                let correspondeSituacao = true;

                if (
                    situacaoSelecionada === "ativo"
                    || situacaoSelecionada === "ativos"
                ) {
                    correspondeSituacao =
                        usuario.ativo === true;
                }

                if (
                    situacaoSelecionada === "inativo"
                    || situacaoSelecionada === "inativos"
                ) {
                    correspondeSituacao =
                        usuario.ativo === false;
                }

                return correspondePesquisa
                    && correspondePerfil
                    && correspondeSituacao;
            }
        );

    renderizarUsuarios(
        usuariosFiltrados
    );
}

if (pesquisaUsuario) {
    pesquisaUsuario.addEventListener(
        "input",
        aplicarFiltros
    );
}

if (filtroPerfil) {
    filtroPerfil.addEventListener(
        "change",
        aplicarFiltros
    );
}

if (filtroSituacao) {
    filtroSituacao.addEventListener(
        "change",
        aplicarFiltros
    );
}

if (botaoLimparFiltros) {
    botaoLimparFiltros.addEventListener(
        "click",
        function () {
            if (pesquisaUsuario) {
                pesquisaUsuario.value = "";
            }

            if (filtroPerfil) {
                filtroPerfil.value = "todos";
            }

            if (filtroSituacao) {
                filtroSituacao.value = "todos";
            }

            aplicarFiltros();

            mostrarAviso(
                "Os filtros foram removidos."
            );
        }
    );
}

/* =====================================================
   TABELA
===================================================== */

function renderizarUsuarios(usuarios) {
    if (!corpoTabelaUsuarios) {
        console.error(
            "O elemento corpoTabelaUsuarios não foi encontrado."
        );

        return;
    }

    corpoTabelaUsuarios.innerHTML = "";

    usuarios.forEach(
        function (usuario) {
            const linha =
                document.createElement("tr");

            const situacao =
                usuario.ativo
                    ? "Ativo"
                    : "Inativo";

            const classeSituacao =
                usuario.ativo
                    ? "ativo"
                    : "inativo";

            const textoBotaoSituacao =
                usuario.ativo
                    ? "Desativar"
                    : "Ativar";

            linha.innerHTML = `
                <td>
                    <div class="usuario-tabela">
                        <div class="avatar-usuario-tabela">
                            ${escaparHtml(
                                obterIniciais(
                                    usuario.nome
                                )
                            )}
                        </div>

                        <div class="dados-usuario-tabela">
                            <strong>
                                ${escaparHtml(
                                    usuario.nome
                                )}
                            </strong>

                            <span>
                                ${escaparHtml(
                                    usuario.email
                                )}
                            </span>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="perfil-usuario">
                        ${escaparHtml(
                            obterNomePerfil(
                                usuario.perfil
                            )
                        )}
                    </span>
                </td>

                <td>
                    <span
                        class="status-usuario ${classeSituacao}"
                    >
                        ${situacao}
                    </span>
                </td>

                <td>
                    ${formatarData(
                        usuario.criadoEm
                    )}
                </td>

                <td>
                    <div class="acoes-tabela">

                        <button
                            type="button"
                            class="botao-tabela editar-usuario"
                            data-id="${usuario.id}"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="botao-tabela alterar-situacao-usuario"
                            data-id="${usuario.id}"
                        >
                            ${textoBotaoSituacao}
                        </button>

                        <button
                            type="button"
                            class="botao-tabela excluir-usuario"
                            data-id="${usuario.id}"
                        >
                            Excluir
                        </button>

                    </div>
                </td>
            `;

            corpoTabelaUsuarios.appendChild(
                linha
            );
        }
    );

    if (quantidadeUsuarios) {
        quantidadeUsuarios.textContent =
            usuarios.length === 1
                ? "1 usuário encontrado"
                : usuarios.length
                    + " usuários encontrados";
    }

    if (mensagemSemUsuarios) {
        mensagemSemUsuarios.classList.toggle(
            "visivel",
            usuarios.length === 0
        );
    }
}

/* =====================================================
   ELEMENTOS DO MODAL
===================================================== */

const modalUsuario =
    obterElemento("modalUsuario");

const botaoAbrirFormulario =
    obterElemento(
        "botaoAbrirFormulario",
        "botaoNovoUsuario"
    );

const botaoFecharModal =
    obterElemento("botaoFecharModal");

const botaoCancelarUsuario =
    obterElemento("botaoCancelarUsuario");

const formUsuario =
    obterElemento("formUsuario");

const tituloModalUsuario =
    obterElemento("tituloModalUsuario");

const nomeUsuario =
    obterElemento("nomeUsuario");

const emailUsuario =
    obterElemento("emailUsuario");

const perfilUsuario =
    obterElemento("perfilUsuario");

const senhaUsuario =
    obterElemento("senhaUsuario");

const confirmarSenhaUsuario =
    obterElemento(
        "confirmarSenhaUsuario",
        "confirmacaoSenhaUsuario"
    );

const ativoUsuario =
    obterElemento(
        "ativoUsuario",
        "situacaoUsuario",
        "statusUsuario"
    );

const erroNomeUsuario =
    obterElemento("erroNomeUsuario");

const erroEmailUsuario =
    obterElemento("erroEmailUsuario");

const erroPerfilUsuario =
    obterElemento("erroPerfilUsuario");

const erroSenhaUsuario =
    obterElemento("erroSenhaUsuario");

const erroConfirmarSenhaUsuario =
    obterElemento(
        "erroConfirmarSenhaUsuario",
        "erroConfirmacaoSenhaUsuario"
    );

/* =====================================================
   MODAL
===================================================== */

function abrirModalNovoUsuario() {
    usuarioEmEdicaoId = null;

    if (tituloModalUsuario) {
        tituloModalUsuario.textContent =
            "Novo usuário";
    }

    if (formUsuario) {
        formUsuario.reset();
    }

    limparErros();

    if (
        ativoUsuario
        && ativoUsuario.type === "checkbox"
    ) {
        ativoUsuario.checked = true;
    }

    if (
        ativoUsuario
        && ativoUsuario.tagName === "SELECT"
    ) {
        ativoUsuario.value = "true";
    }

    abrirModal();

    if (nomeUsuario) {
        nomeUsuario.focus();
    }
}

function abrirModalEdicao(usuario) {
    usuarioEmEdicaoId =
        usuario.id;

    if (tituloModalUsuario) {
        tituloModalUsuario.textContent =
            "Editar usuário";
    }

    limparErros();

    if (nomeUsuario) {
        nomeUsuario.value =
            usuario.nome || "";
    }

    if (emailUsuario) {
        emailUsuario.value =
            usuario.email || "";
    }

    if (perfilUsuario) {
        perfilUsuario.value =
            usuario.perfil || "";
    }

    if (senhaUsuario) {
        senhaUsuario.value = "";

        senhaUsuario.placeholder =
            "Deixe em branco para manter a senha";
    }

    if (confirmarSenhaUsuario) {
        confirmarSenhaUsuario.value = "";
    }

    if (ativoUsuario) {
        if (
            ativoUsuario.type === "checkbox"
        ) {
            ativoUsuario.checked =
                usuario.ativo === true;
        } else {
            ativoUsuario.value =
                usuario.ativo
                    ? "true"
                    : "false";
        }
    }

    abrirModal();

    if (nomeUsuario) {
        nomeUsuario.focus();
    }
}

function abrirModal() {
    if (!modalUsuario) {
        return;
    }

    modalUsuario.classList.add("aberto");

    modalUsuario.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-aberto"
    );
}

function fecharModal() {
    if (!modalUsuario) {
        return;
    }

    modalUsuario.classList.remove(
        "aberto"
    );

    modalUsuario.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-aberto"
    );

    if (formUsuario) {
        formUsuario.reset();
    }

    if (senhaUsuario) {
        senhaUsuario.placeholder =
            "Digite uma senha";
    }

    limparErros();

    usuarioEmEdicaoId = null;
}

if (botaoAbrirFormulario) {
    botaoAbrirFormulario.addEventListener(
        "click",
        abrirModalNovoUsuario
    );
}

if (botaoFecharModal) {
    botaoFecharModal.addEventListener(
        "click",
        fecharModal
    );
}

if (botaoCancelarUsuario) {
    botaoCancelarUsuario.addEventListener(
        "click",
        fecharModal
    );
}

if (modalUsuario) {
    const fundoModal =
        modalUsuario.querySelector(
            ".modal-fundo"
        );

    if (fundoModal) {
        fundoModal.addEventListener(
            "click",
            fecharModal
        );
    }
}

/* =====================================================
   VALIDAÇÕES
===================================================== */

function limparErros() {
    const mensagens = [
        erroNomeUsuario,
        erroEmailUsuario,
        erroPerfilUsuario,
        erroSenhaUsuario,
        erroConfirmarSenhaUsuario
    ];

    mensagens.forEach(
        function (mensagem) {
            if (mensagem) {
                mensagem.textContent = "";
            }
        }
    );

    const campos = [
        nomeUsuario,
        emailUsuario,
        perfilUsuario,
        senhaUsuario,
        confirmarSenhaUsuario
    ];

    campos.forEach(
        function (campo) {
            if (campo) {
                campo.classList.remove(
                    "campo-invalido"
                );
            }
        }
    );
}

function marcarErro(
    campo,
    elementoErro,
    mensagem
) {
    if (campo) {
        campo.classList.add(
            "campo-invalido"
        );
    }

    if (elementoErro) {
        elementoErro.textContent =
            mensagem;
    }
}

function emailValido(email) {
    const expressao =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expressao.test(email);
}

function validarUsuario() {
    limparErros();

    let formularioValido = true;

    const nome =
        nomeUsuario
            ? nomeUsuario.value.trim()
            : "";

    const email =
        emailUsuario
            ? emailUsuario.value.trim()
            : "";

    const perfil =
        perfilUsuario
            ? perfilUsuario.value
            : "";

    const senha =
        senhaUsuario
            ? senhaUsuario.value
            : "";

    const confirmacao =
        confirmarSenhaUsuario
            ? confirmarSenhaUsuario.value
            : senha;

    const criando =
        usuarioEmEdicaoId === null;

    if (nome.length < 3) {
        marcarErro(
            nomeUsuario,
            erroNomeUsuario,
            "Informe um nome com pelo menos 3 caracteres."
        );

        formularioValido = false;
    }

    if (!emailValido(email)) {
        marcarErro(
            emailUsuario,
            erroEmailUsuario,
            "Informe um e-mail válido."
        );

        formularioValido = false;
    }

    if (perfil === "") {
        marcarErro(
            perfilUsuario,
            erroPerfilUsuario,
            "Selecione o perfil."
        );

        formularioValido = false;
    }

    if (
        criando
        && senha.length < 6
    ) {
        marcarErro(
            senhaUsuario,
            erroSenhaUsuario,
            "A senha deve possuir pelo menos 6 caracteres."
        );

        formularioValido = false;
    }

    if (
        !criando
        && senha !== ""
        && senha.length < 6
    ) {
        marcarErro(
            senhaUsuario,
            erroSenhaUsuario,
            "A nova senha deve possuir pelo menos 6 caracteres."
        );

        formularioValido = false;
    }

    if (
        confirmarSenhaUsuario
        && senha !== confirmacao
    ) {
        marcarErro(
            confirmarSenhaUsuario,
            erroConfirmarSenhaUsuario,
            "As senhas não coincidem."
        );

        formularioValido = false;
    }

    return formularioValido;
}

/* =====================================================
   SITUAÇÃO DO FORMULÁRIO
===================================================== */

function obterSituacaoDoFormulario() {
    if (!ativoUsuario) {
        if (usuarioEmEdicaoId !== null) {
            const usuarioExistente =
                usuariosCarregados.find(
                    function (usuario) {
                        return usuario.id
                            === usuarioEmEdicaoId;
                    }
                );

            if (usuarioExistente) {
                return usuarioExistente.ativo;
            }
        }

        return true;
    }

    if (
        ativoUsuario.type === "checkbox"
    ) {
        return ativoUsuario.checked;
    }

    return ativoUsuario.value !== "false"
        && ativoUsuario.value !== "inativo";
}

/* =====================================================
   ERROS DA API
===================================================== */

function exibirErrosDaApi(campos) {
    const configuracao = {
        nome: [
            nomeUsuario,
            erroNomeUsuario
        ],

        email: [
            emailUsuario,
            erroEmailUsuario
        ],

        perfil: [
            perfilUsuario,
            erroPerfilUsuario
        ],

        senha: [
            senhaUsuario,
            erroSenhaUsuario
        ]
    };

    Object.entries(campos || {}).forEach(
        function (entrada) {
            const nomeCampo =
                entrada[0];

            const mensagem =
                entrada[1];

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
   SALVAR USUÁRIO
===================================================== */

if (formUsuario) {
    formUsuario.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            if (!validarUsuario()) {
                mostrarAviso(
                    "Verifique os campos do formulário."
                );

                return;
            }

            const senhaDigitada =
                senhaUsuario
                    ? senhaUsuario.value
                    : "";

            const editando =
                usuarioEmEdicaoId !== null;

            const usuario = {
                nome:
                    nomeUsuario.value.trim(),

                email:
                    emailUsuario.value
                        .trim()
                        .toLowerCase(),

                perfil:
                    perfilUsuario.value,

                ativo:
                    obterSituacaoDoFormulario(),

                senha:
                    senhaDigitada === ""
                        ? null
                        : senhaDigitada
            };

            const endereco =
                editando
                    ? "/api/usuarios/"
                        + usuarioEmEdicaoId
                    : "/api/usuarios";

            const metodo =
                editando
                    ? "PUT"
                    : "POST";

            try {
                const resposta =
                    await fetch(
                        endereco,
                        {
                            method: metodo,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    usuario
                                )
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
                        || "Não foi possível salvar o usuário."
                    );
                }

                fecharModal();

                await carregarUsuarios();

                mostrarAviso(
                    editando
                        ? "Usuário atualizado com sucesso."
                        : "Usuário cadastrado com sucesso."
                );

            } catch (erro) {
                console.error(erro);

                mostrarAviso(
                    erro.message
                    || "Erro ao salvar o usuário."
                );
            }
        }
    );
}

/* =====================================================
   AÇÕES DA TABELA
===================================================== */

if (corpoTabelaUsuarios) {
    corpoTabelaUsuarios.addEventListener(
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

            const usuario =
                usuariosCarregados.find(
                    function (item) {
                        return item.id === id;
                    }
                );

            if (!usuario) {
                mostrarAviso(
                    "Usuário não encontrado."
                );

                return;
            }

            if (
                botao.classList.contains(
                    "editar-usuario"
                )
            ) {
                abrirModalEdicao(usuario);
                return;
            }

            if (
                botao.classList.contains(
                    "alterar-situacao-usuario"
                )
            ) {
                await alterarSituacao(usuario);
                return;
            }

            if (
                botao.classList.contains(
                    "excluir-usuario"
                )
            ) {
                await excluirUsuario(usuario);
            }
        }
    );
}

/* =====================================================
   ATIVAR OU DESATIVAR
===================================================== */

async function alterarSituacao(usuario) {
    const acao =
        usuario.ativo
            ? "desativar"
            : "ativar";

    const confirmou =
        window.confirm(
            "Deseja realmente "
            + acao
            + ' o usuário "'
            + usuario.nome
            + '"?'
        );

    if (!confirmou) {
        return;
    }

    try {
        const resposta =
            await fetch(
                "/api/usuarios/"
                + usuario.id
                + "/situacao",
                {
                    method: "PATCH"
                }
            );

        if (!resposta.ok) {
            const erroApi =
                await resposta.json();

            throw new Error(
                erroApi.erro
                || "Não foi possível alterar a situação."
            );
        }

        await carregarUsuarios();

        mostrarAviso(
            usuario.ativo
                ? "Usuário desativado com sucesso."
                : "Usuário ativado com sucesso."
        );

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            erro.message
            || "Erro ao alterar a situação."
        );
    }
}

/* =====================================================
   EXCLUIR USUÁRIO
===================================================== */

async function excluirUsuario(usuario) {
    const confirmou =
        window.confirm(
            'Deseja realmente excluir o usuário "'
            + usuario.nome
            + '"?'
        );

    if (!confirmou) {
        return;
    }

    try {
        const resposta =
            await fetch(
                "/api/usuarios/"
                + usuario.id,
                {
                    method: "DELETE"
                }
            );

        if (!resposta.ok) {
            let mensagem =
                "Não foi possível excluir o usuário.";

            try {
                const erroApi =
                    await resposta.json();

                mensagem =
                    erroApi.erro
                    || mensagem;

            } catch (erroLeitura) {
                console.error(
                    erroLeitura
                );
            }

            throw new Error(mensagem);
        }

        await carregarUsuarios();

        mostrarAviso(
            "Usuário excluído com sucesso."
        );

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            erro.message
            || "Erro ao excluir o usuário."
        );
    }
}

/* =====================================================
   LIMPAR ERRO AO DIGITAR
===================================================== */

const camposFormulario = [
    nomeUsuario,
    emailUsuario,
    perfilUsuario,
    senhaUsuario,
    confirmarSenhaUsuario
];

camposFormulario.forEach(
    function (campo) {
        if (!campo) {
            return;
        }

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

        if (menuLateral) {
            menuLateral.classList.remove(
                "aberto"
            );
        }

        if (
            modalUsuario
            && modalUsuario.classList.contains(
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

carregarUsuarios();