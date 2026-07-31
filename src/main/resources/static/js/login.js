/* =====================================================
   ELEMENTOS DA PÁGINA
===================================================== */

const formularioLogin =
    document.getElementById("formLogin")
    || document.querySelector("form");

const campoEmail =
    document.getElementById("email")
    || document.getElementById("emailLogin")
    || document.querySelector(
        'input[type="email"]'
    );

const campoSenha =
    document.getElementById("senha")
    || document.getElementById("senhaLogin")
    || document.querySelector(
        'input[type="password"]'
    );

const botaoEntrar =
    formularioLogin
        ? formularioLogin.querySelector(
            'button[type="submit"]'
        )
        : null;

const botaoMostrarSenha =
    document.getElementById(
        "botaoMostrarSenha"
    )
    || document.getElementById(
        "mostrarSenha"
    );

/* =====================================================
   MENSAGEM DA PÁGINA
===================================================== */

let mensagemLogin =
    document.getElementById(
        "mensagemLogin"
    );

if (
    !mensagemLogin
    && formularioLogin
) {
    mensagemLogin =
        document.createElement("p");

    mensagemLogin.id =
        "mensagemLogin";

    mensagemLogin.className =
        "mensagem-login";

    if (botaoEntrar) {
        formularioLogin.insertBefore(
            mensagemLogin,
            botaoEntrar
        );
    } else {
        formularioLogin.appendChild(
            mensagemLogin
        );
    }
}

function exibirMensagem(
    mensagem,
    tipo
) {
    if (!mensagemLogin) {
        window.alert(mensagem);
        return;
    }

    mensagemLogin.textContent =
        mensagem;

    mensagemLogin.classList.remove(
        "erro",
        "sucesso"
    );

    mensagemLogin.classList.add(
        tipo
    );
}

/* =====================================================
   MOSTRAR OU ESCONDER SENHA
===================================================== */

if (
    botaoMostrarSenha
    && campoSenha
) {
    botaoMostrarSenha.addEventListener(
        "click",
        function () {
            const senhaVisivel =
                campoSenha.type === "text";

            campoSenha.type =
                senhaVisivel
                    ? "password"
                    : "text";
        }
    );
}

/* =====================================================
   VALIDAÇÃO
===================================================== */

function emailValido(email) {
    const expressao =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expressao.test(email);
}

function validarFormulario() {
    if (!campoEmail || !campoSenha) {
        exibirMensagem(
            "Os campos de login não foram encontrados.",
            "erro"
        );

        return false;
    }

    const email =
        campoEmail.value.trim();

    const senha =
        campoSenha.value;

    if (!emailValido(email)) {
        exibirMensagem(
            "Informe um e-mail válido.",
            "erro"
        );

        campoEmail.focus();

        return false;
    }

    if (senha.length < 6) {
        exibirMensagem(
            "A senha deve possuir pelo menos 6 caracteres.",
            "erro"
        );

        campoSenha.focus();

        return false;
    }

    return true;
}

/* =====================================================
   LOGIN REAL
===================================================== */

if (formularioLogin) {
    formularioLogin.addEventListener(
        "submit",
        async function (evento) {
            evento.preventDefault();

            if (!validarFormulario()) {
                return;
            }

            const textoOriginalBotao =
                botaoEntrar
                    ? botaoEntrar.textContent
                    : "";

            if (botaoEntrar) {
                botaoEntrar.disabled = true;

                botaoEntrar.textContent =
                    "Entrando...";
            }

            exibirMensagem(
                "Validando acesso...",
                "sucesso"
            );

            try {
                const resposta =
                    await fetch(
                        "/api/autenticacao/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email:
                                    campoEmail.value
                                        .trim()
                                        .toLowerCase(),

                                senha:
                                    campoSenha.value
                            })
                        }
                    );

                const dados =
                    await resposta.json();

                if (!resposta.ok) {
                    throw new Error(
                        dados.erro
                        || "Não foi possível realizar o login."
                    );
                }

                exibirMensagem(
                    "Login realizado com sucesso.",
                    "sucesso"
                );

                setTimeout(
                    function () {
                        window.location.href =
                            "/dashboard.html";
                    },
                    700
                );

            } catch (erro) {
                console.error(erro);

                exibirMensagem(
                    erro.message
                    || "Erro ao realizar o login.",
                    "erro"
                );

                if (botaoEntrar) {
                    botaoEntrar.disabled =
                        false;

                    botaoEntrar.textContent =
                        textoOriginalBotao;
                }
            }
        }
    );
}