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

let projetosCarregados = [];
let auditoriasCarregadas = [];
let naoConformidadesCarregadas = [];
let checklistsCarregados = [];
let documentosCarregados = [];
let atividadesCarregadas = [];
let temporizadorAviso = null;

const botaoMenu =
    obterElemento("botaoMenu");

const menuLateral =
    document.querySelector(".menu-lateral");

const botaoNotificacao =
    obterElemento("botaoNotificacao");

const quantidadeNotificacoes =
    obterElemento("quantidadeNotificacoes");

const mensagemNotificacao =
    obterElemento("mensagemNotificacao");

const dataAtual =
    obterElemento("dataAtual");

const pesquisaGeral =
    obterElemento("pesquisaGeral");

const indicadorProjetosAtivos =
    obterElemento("indicadorProjetosAtivos");

const indicadorAuditoriasPrevistas =
    obterElemento(
        "indicadorAuditoriasPrevistas"
    );

const indicadorNaoConformidadesPendentes =
    obterElemento(
        "indicadorNaoConformidadesPendentes"
    );

const indicadorTaxaConclusao =
    obterElemento("indicadorTaxaConclusao");

const textoProjetosAtivos =
    obterElemento("textoProjetosAtivos");

const textoAuditoriasPrevistas =
    obterElemento("textoAuditoriasPrevistas");

const textoNaoConformidadesPendentes =
    obterElemento(
        "textoNaoConformidadesPendentes"
    );

const textoTaxaConclusao =
    obterElemento("textoTaxaConclusao");

const corpoTabelaProjetosRecentes =
    obterElemento(
        "corpoTabelaProjetosRecentes"
    );

const mensagemSemProjetosRecentes =
    obterElemento(
        "mensagemSemProjetosRecentes"
    );

const listaAtividadesDashboard =
    obterElemento(
        "listaAtividadesDashboard"
    );

const mensagemSemAtividadesDashboard =
    obterElemento(
        "mensagemSemAtividadesDashboard"
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

const linksMenu =
    document.querySelectorAll(
        ".menu-item"
    );

linksMenu.forEach(
    function (link) {
        link.addEventListener(
            "click",
            function () {
                if (menuLateral) {
                    menuLateral.classList.remove(
                        "aberto"
                    );
                }
            }
        );
    }
);

document.addEventListener(
    "keydown",
    function (evento) {
        if (
            evento.key === "Escape"
            && menuLateral
        ) {
            menuLateral.classList.remove(
                "aberto"
            );
        }
    }
);

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
            const quantidade =
                atividadesCarregadas.length;

            if (quantidade === 0) {
                mostrarAviso(
                    "Não existem atividades futuras registradas."
                );

                return;
            }

            mostrarAviso(
                quantidade === 1
                    ? "Existe 1 atividade futura registrada."
                    : "Existem "
                        + quantidade
                        + " atividades futuras registradas."
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

function converterDataLocal(valor) {
    if (!valor) {
        return null;
    }

    const texto =
        String(valor);

    const dataSimples =
        texto.substring(0, 10);

    const partes =
        dataSimples.split("-");

    if (partes.length !== 3) {
        const data =
            new Date(valor);

        return Number.isNaN(
            data.getTime()
        )
            ? null
            : data;
    }

    return new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );
}

function inicioDoDia(data) {
    return new Date(
        data.getFullYear(),
        data.getMonth(),
        data.getDate()
    );
}

function adicionarDias(
    data,
    quantidade
) {
    const resultado =
        new Date(data);

    resultado.setDate(
        resultado.getDate()
        + quantidade
    );

    return resultado;
}

function nomeMesCurto(data) {
    return data
        .toLocaleDateString(
            "pt-BR",
            {
                month: "short"
            }
        )
        .replace(".", "")
        .toUpperCase();
}

function formatarDataCurta(data) {
    if (!data) {
        return "-";
    }

    return data.toLocaleDateString(
        "pt-BR"
    );
}

function nomeStatusProjeto(status) {
    const nomes = {
        planejamento: "Planejamento",
        planejado: "Planejado",
        andamento: "Em andamento",
        concluido: "Concluído",
        pausado: "Pausado",
        cancelado: "Cancelado"
    };

    return nomes[status] || status || "-";
}

function classeStatusProjeto(status) {
    const classes = {
        planejamento: "planejamento",
        planejado: "planejamento",
        andamento: "andamento",
        concluido: "concluido",
        pausado: "pendente",
        cancelado: "pendente"
    };

    return classes[status]
        || "planejamento";
}

function obterProgressoProjeto(projeto) {
    const valor =
        Number(projeto.progresso);

    if (Number.isNaN(valor)) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(valor)
        )
    );
}

function obterDataOrdenacaoProjeto(
    projeto
) {
    const valor =
        projeto.atualizadoEm
        || projeto.criadoEm
        || projeto.dataInicio;

    const data =
        converterDataLocal(valor);

    if (data) {
        return data.getTime();
    }

    return Number(projeto.id) || 0;
}

/* =====================================================
   CONSULTAR APIS
===================================================== */

async function consultarApi(
    endereco
) {
    const resposta =
        await fetch(
            endereco,
            {
                credentials:
                    "same-origin"
            }
        );

    if (!resposta.ok) {
        throw new Error(
            "Falha ao consultar "
            + endereco
        );
    }

    return resposta.json();
}

async function carregarDados() {
    try {
        const resultados =
            await Promise.allSettled([
                consultarApi(
                    "/api/projetos"
                ),
                consultarApi(
                    "/api/auditorias"
                ),
                consultarApi(
                    "/api/nao-conformidades"
                ),
                consultarApi(
                    "/api/checklists"
                ),
                consultarApi(
                    "/api/documentos"
                )
            ]);

        projetosCarregados =
            resultados[0].status
                === "fulfilled"
                ? resultados[0].value
                : [];

        auditoriasCarregadas =
            resultados[1].status
                === "fulfilled"
                ? resultados[1].value
                : [];

        naoConformidadesCarregadas =
            resultados[2].status
                === "fulfilled"
                ? resultados[2].value
                : [];

        checklistsCarregados =
            resultados[3].status
                === "fulfilled"
                ? resultados[3].value
                : [];

        documentosCarregados =
            resultados[4].status
                === "fulfilled"
                ? resultados[4].value
                : [];

        atualizarIndicadores();
        renderizarProjetosRecentes();
        montarAtividades();
        aplicarPesquisaProjetos();

        const houveFalha =
            resultados.some(
                function (resultado) {
                    return resultado.status
                        === "rejected";
                }
            );

        if (houveFalha) {
            mostrarAviso(
                "Alguns indicadores não puderam ser carregados."
            );
        }

    } catch (erro) {
        console.error(erro);

        mostrarAviso(
            "Erro ao carregar o Dashboard."
        );
    }
}

/* =====================================================
   INDICADORES
===================================================== */

function atualizarIndicadores() {
    const projetosAtivos =
        projetosCarregados.filter(
            function (projeto) {
                return projeto.status
                    !== "concluido"
                    && projeto.status
                        !== "cancelado";
            }
        ).length;

    const hoje =
        inicioDoDia(new Date());

    const limiteAuditorias =
        adicionarDias(hoje, 30);

    const auditoriasPrevistas =
        auditoriasCarregadas.filter(
            function (auditoria) {
                if (
                    auditoria.status
                        !== "planejada"
                ) {
                    return false;
                }

                const data =
                    converterDataLocal(
                        auditoria.dataAuditoria
                    );

                if (!data) {
                    return false;
                }

                const dataAuditoria =
                    inicioDoDia(data);

                return dataAuditoria >= hoje
                    && dataAuditoria
                        <= limiteAuditorias;
            }
        ).length;

    const naoConformidadesPendentes =
        naoConformidadesCarregadas.filter(
            function (registro) {
                return registro.status
                    !== "resolvida"
                    && registro.status
                        !== "cancelada";
            }
        ).length;

    const checklistsConcluidos =
        checklistsCarregados.filter(
            function (checklist) {
                return checklist.status
                    === "concluido";
            }
        ).length;

    const taxaConclusao =
        checklistsCarregados.length === 0
            ? 0
            : Math.round(
                checklistsConcluidos
                / checklistsCarregados.length
                * 100
            );

    if (indicadorProjetosAtivos) {
        indicadorProjetosAtivos.textContent =
            projetosAtivos;
    }

    if (indicadorAuditoriasPrevistas) {
        indicadorAuditoriasPrevistas
            .textContent =
                auditoriasPrevistas;
    }

    if (
        indicadorNaoConformidadesPendentes
    ) {
        indicadorNaoConformidadesPendentes
            .textContent =
                naoConformidadesPendentes;
    }

    if (indicadorTaxaConclusao) {
        indicadorTaxaConclusao.textContent =
            taxaConclusao + "%";
    }

    if (textoProjetosAtivos) {
        textoProjetosAtivos.textContent =
            projetosCarregados.length
            + (
                projetosCarregados.length
                    === 1
                    ? " projeto cadastrado"
                    : " projetos cadastrados"
            );
    }

    if (textoAuditoriasPrevistas) {
        textoAuditoriasPrevistas.textContent =
            "Planejadas para os próximos 30 dias";
    }

    if (
        textoNaoConformidadesPendentes
    ) {
        textoNaoConformidadesPendentes
            .textContent =
                naoConformidadesCarregadas
                    .length
                + " ocorrências cadastradas";
    }

    if (textoTaxaConclusao) {
        textoTaxaConclusao.textContent =
            checklistsConcluidos
            + " de "
            + checklistsCarregados.length
            + " checklists concluídos";
    }
}

/* =====================================================
   PROJETOS RECENTES
===================================================== */

function obterProjetosRecentes() {
    return projetosCarregados
        .slice()
        .sort(
            function (a, b) {
                return obterDataOrdenacaoProjeto(b)
                    - obterDataOrdenacaoProjeto(a);
            }
        )
        .slice(0, 5);
}

function renderizarProjetosRecentes(
    projetos
) {
    if (!corpoTabelaProjetosRecentes) {
        return;
    }

    const lista =
        Array.isArray(projetos)
            ? projetos
            : obterProjetosRecentes();

    corpoTabelaProjetosRecentes.innerHTML =
        "";

    lista.forEach(
        function (projeto) {
            const progresso =
                obterProgressoProjeto(
                    projeto
                );

            const linha =
                document.createElement("tr");

            linha.innerHTML = `
                <td>
                    <strong>
                        ${escaparHtml(
                            projeto.nome
                        )}
                    </strong>

                    <span>
                        ${escaparHtml(
                            projeto.descricao
                            || "Projeto cadastrado no sistema"
                        )}
                    </span>
                </td>

                <td>
                    ${escaparHtml(
                        projeto.responsavel
                        || "Não informado"
                    )}
                </td>

                <td>
                    <span
                        class="status ${classeStatusProjeto(
                            projeto.status
                        )}"
                    >
                        ${escaparHtml(
                            nomeStatusProjeto(
                                projeto.status
                            )
                        )}
                    </span>
                </td>

                <td>
                    <div class="progresso-linha">
                        <div
                            class="progresso-barra"
                            style="width: ${progresso}%;"
                        ></div>
                    </div>

                    <small>
                        ${progresso}%
                    </small>
                </td>
            `;

            corpoTabelaProjetosRecentes
                .appendChild(linha);
        }
    );

    if (mensagemSemProjetosRecentes) {
        mensagemSemProjetosRecentes
            .classList.toggle(
                "visivel",
                lista.length === 0
            );
    }
}

function aplicarPesquisaProjetos() {
    const termo =
        pesquisaGeral
            ? normalizarTexto(
                pesquisaGeral.value
            )
            : "";

    const filtrados =
        obterProjetosRecentes().filter(
            function (projeto) {
                const texto =
                    normalizarTexto(
                        projeto.nome
                        + " "
                        + projeto.descricao
                        + " "
                        + projeto.responsavel
                        + " "
                        + nomeStatusProjeto(
                            projeto.status
                        )
                    );

                return texto.includes(termo);
            }
        );

    renderizarProjetosRecentes(
        filtrados
    );
}

if (pesquisaGeral) {
    pesquisaGeral.addEventListener(
        "input",
        aplicarPesquisaProjetos
    );
}

/* =====================================================
   PRÓXIMAS ATIVIDADES
===================================================== */

function montarAtividades() {
    const hoje =
        inicioDoDia(new Date());

    const atividades = [];

    auditoriasCarregadas.forEach(
        function (auditoria) {
            const data =
                converterDataLocal(
                    auditoria.dataAuditoria
                );

            if (
                !data
                || inicioDoDia(data) < hoje
                || auditoria.status
                    === "concluida"
                || auditoria.status
                    === "cancelada"
            ) {
                return;
            }

            atividades.push({
                data: inicioDoDia(data),
                titulo:
                    auditoria.titulo
                    || "Auditoria",
                descricao:
                    auditoria.nomeProjeto
                    || "Projeto não informado",
                detalhe:
                    "Auditoria "
                    + (
                        auditoria.status
                        === "andamento"
                            ? "em andamento"
                            : "planejada"
                    )
            });
        }
    );

    naoConformidadesCarregadas.forEach(
        function (registro) {
            const data =
                converterDataLocal(
                    registro.prazoCorrecao
                );

            if (
                !data
                || inicioDoDia(data) < hoje
                || registro.status
                    === "resolvida"
                || registro.status
                    === "cancelada"
            ) {
                return;
            }

            atividades.push({
                data: inicioDoDia(data),
                titulo:
                    "Prazo de correção",
                descricao:
                    registro.titulo
                    || "Não conformidade",
                detalhe:
                    registro.responsavel
                    || "Responsável não informado"
            });
        }
    );

    checklistsCarregados.forEach(
        function (checklist) {
            const data =
                converterDataLocal(
                    checklist.prazo
                );

            if (
                !data
                || inicioDoDia(data) < hoje
                || checklist.status
                    === "concluido"
            ) {
                return;
            }

            atividades.push({
                data: inicioDoDia(data),
                titulo:
                    checklist.titulo
                    || "Checklist",
                descricao:
                    checklist.nomeProjeto
                    || "Projeto não informado",
                detalhe:
                    "Prazo do checklist"
            });
        }
    );

    atividadesCarregadas =
        atividades
            .sort(
                function (a, b) {
                    return a.data
                        - b.data;
                }
            )
            .slice(0, 5);

    renderizarAtividades();

    if (quantidadeNotificacoes) {
        quantidadeNotificacoes.textContent =
            atividadesCarregadas.length;
    }
}

function renderizarAtividades() {
    if (!listaAtividadesDashboard) {
        return;
    }

    listaAtividadesDashboard.innerHTML =
        "";

    atividadesCarregadas.forEach(
        function (atividade) {
            const item =
                document.createElement(
                    "article"
                );

            item.className =
                "atividade";

            item.innerHTML = `
                <div class="atividade-data">
                    <strong>
                        ${String(
                            atividade.data.getDate()
                        ).padStart(2, "0")}
                    </strong>

                    <span>
                        ${nomeMesCurto(
                            atividade.data
                        )}
                    </span>
                </div>

                <div>
                    <h3>
                        ${escaparHtml(
                            atividade.titulo
                        )}
                    </h3>

                    <p>
                        ${escaparHtml(
                            atividade.descricao
                        )}
                    </p>

                    <small>
                        ${escaparHtml(
                            atividade.detalhe
                        )}
                        ·
                        ${formatarDataCurta(
                            atividade.data
                        )}
                    </small>
                </div>
            `;

            listaAtividadesDashboard
                .appendChild(item);
        }
    );

    if (
        mensagemSemAtividadesDashboard
    ) {
        mensagemSemAtividadesDashboard
            .classList.toggle(
                "visivel",
                atividadesCarregadas.length
                    === 0
            );
    }
}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

carregarDados();