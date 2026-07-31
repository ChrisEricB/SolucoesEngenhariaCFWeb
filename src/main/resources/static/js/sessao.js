/* =====================================================
   CONTROLE DE SESSÃO DO USUÁRIO
===================================================== */

let usuarioDaSessao = null;

async function verificarSessao() {
    try {
        const resposta =
            await fetch(
                "/api/autenticacao/sessao",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );

        if (!resposta.ok) {
            window.location.href = "/";
            return;
        }

        usuarioDaSessao =
            await resposta.json();

        preencherDadosDoUsuario(
            usuarioDaSessao
        );

    } catch (erro) {
        console.error(erro);

        window.location.href = "/";
    }
}

/* =====================================================
   EXIBIÇÃO DO USUÁRIO
===================================================== */

function formatarPerfil(perfil) {
    const perfis = {
        administrador: "Administrador",
        gerente: "Gerente",
        consultor: "Consultor",
        engenheiro: "Engenheiro",
        cliente: "Cliente"
    };

    return perfis[perfil] || perfil;
}

function preencherDadosDoUsuario(usuario) {
    const elementosNome =
        document.querySelectorAll(
            "[data-usuario-nome]"
        );

    elementosNome.forEach(
        function (elemento) {
            elemento.textContent =
                usuario.nome;
        }
    );

    const elementosPerfil =
        document.querySelectorAll(
            "[data-usuario-perfil]"
        );

    elementosPerfil.forEach(
        function (elemento) {
            elemento.textContent =
                formatarPerfil(
                    usuario.perfil
                );
        }
    );

    const elementosEmail =
        document.querySelectorAll(
            "[data-usuario-email]"
        );

    elementosEmail.forEach(
        function (elemento) {
            elemento.textContent =
                usuario.email;
        }
    );
}

/* =====================================================
   LOGOUT
===================================================== */

async function realizarLogout() {
    try {
        await fetch(
            "/api/autenticacao/logout",
            {
                method: "POST",
                credentials: "same-origin"
            }
        );

    } catch (erro) {
        console.error(erro);

    } finally {
        sessionStorage.removeItem(
            "usuarioLogado"
        );

        window.location.href = "/";
    }
}

const botoesSair =
    document.querySelectorAll(
        "#botaoSair, [data-acao='sair']"
    );

botoesSair.forEach(
    function (botao) {
        botao.addEventListener(
            "click",
            function (evento) {
                evento.preventDefault();

                realizarLogout();
            }
        );
    }
);

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

verificarSessao();