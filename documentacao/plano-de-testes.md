# Plano e resultado dos testes

**Projeto:** Soluções Engenharia C&F Web  
**Versão avaliada:** 1.0  
**Data da execução:** 31/07/2026  
**Ambiente:** Windows, Java 17, Spring Boot, MySQL, navegador web e Postman

## 1. Objetivo

Este documento apresenta o plano e o resultado dos testes realizados no sistema Soluções Engenharia C&F Web. Os testes verificaram autenticação, integração entre front-end e back-end, persistência em banco de dados, regras de negócio, APIs REST, comportamento das páginas e testes automatizados.

## 2. Critérios utilizados

- **Aprovado:** comportamento obtido conforme o esperado.
- **Parcialmente aprovado:** parte principal funcionou, mas foi identificada alguma limitação.
- **Não aprovado:** comportamento esperado não foi obtido.
- **Não executado:** teste não realizado.

## 3. Casos de teste manuais

| ID | Módulo | Procedimento | Resultado esperado | Resultado obtido | Situação |
|---|---|---|---|---|---|
| CT-001 | Login | Informar credenciais válidas | Acesso ao Dashboard | Acesso realizado | Aprovado |
| CT-002 | Login | Informar credenciais inválidas | Bloqueio do acesso | Acesso bloqueado | Aprovado |
| CT-003 | Sessão | Tentar abrir página interna sem sessão | Redirecionamento ao login | Redirecionamento realizado | Aprovado |
| CT-004 | Sessão | Clicar em Sair | Encerrar sessão e voltar ao login | Sessão encerrada | Aprovado |
| CT-005 | Projetos | Cadastrar projeto | Registro salvo e exibido | Registro cadastrado | Aprovado |
| CT-006 | Projetos | Editar projeto | Dados atualizados | Dados atualizados | Aprovado |
| CT-007 | Projetos | Excluir projeto permitido | Registro removido | Registro removido | Aprovado |
| CT-008 | Projetos | Atualizar a página após cadastro | Registro permanece | Registro permaneceu | Aprovado |
| CT-009 | Usuários | Cadastrar usuário | Usuário salvo | Usuário cadastrado | Aprovado |
| CT-010 | Usuários | Editar usuário | Dados atualizados | Dados atualizados | Aprovado |
| CT-011 | Usuários | Excluir usuário permitido | Usuário removido | Usuário removido | Aprovado |
| CT-012 | Auditorias | Cadastrar auditoria | Registro salvo | Registro cadastrado | Aprovado |
| CT-013 | Auditorias | Editar status | Status e indicador atualizados | Atualização realizada | Aprovado |
| CT-014 | Auditorias | Aplicar e limpar filtros | Tabela filtrada e restaurada | Funcionamento confirmado | Aprovado |
| CT-015 | Não conformidades | Cadastrar ocorrência | Registro salvo e vinculado | Registro cadastrado | Aprovado |
| CT-016 | Auditorias | Excluir auditoria com não conformidade vinculada | Exclusão bloqueada | Exclusão bloqueada | Aprovado |
| CT-017 | Não conformidades | Excluir ocorrência e depois auditoria | Exclusões permitidas na ordem correta | Funcionamento confirmado | Aprovado |
| CT-018 | Checklists | Cadastrar checklist | Registro salvo no banco | Registro cadastrado | Aprovado |
| CT-019 | Checklists | Alterar itens concluídos | Progresso atualizado | Progresso atualizado | Aprovado |
| CT-020 | Checklists | Atualizar página com F5 | Registro permanece | Registro permaneceu | Aprovado |
| CT-021 | Checklists | Aplicar filtros e pesquisa | Lista filtrada | Funcionamento confirmado | Aprovado |
| CT-022 | Documentos | Enviar documento | Documento aparece na listagem | Documento exibido | Parcialmente aprovado |
| CT-023 | Documentos | Visualizar documento | Visualização do arquivo ou simulação | Visualização simulada apresentada | Parcialmente aprovado |
| CT-024 | Documentos | Editar documento | Formulário de edição disponível | Função não apareceu ou não funcionou | Não aprovado |
| CT-025 | Documentos | Aplicar filtros | Listagem filtrada | Filtros não funcionaram | Não aprovado |
| CT-026 | Documentos | Atualizar página com F5 | Documento permanece | Documento não permaneceu | Não aprovado |
| CT-027 | Dashboard | Abrir página | Indicadores carregados das APIs | Dados reais exibidos | Aprovado |
| CT-028 | Dashboard | Conferir projetos recentes | Projeto cadastrado aparece | Um projeto real exibido | Aprovado |
| CT-029 | Dashboard | Pesquisar projeto | Tabela filtrada | Pesquisa funcionou | Aprovado |
| CT-030 | Banco | Consultar tabelas no MySQL | Dados dos módulos disponíveis | Dados confirmados | Aprovado |
| CT-031 | Git | Executar push | Alterações disponíveis no GitHub | Push concluído | Aprovado |

## 4. Testes automatizados

| ID | Teste automatizado | Objetivo | Situação |
|---|---|---|---|
| CTA-001 | `contextoDaAplicacaoDeveCarregar` | Verificar se o contexto Spring Boot inicia com o perfil de teste | Aprovado |
| CTA-002 | Checklist concluído automaticamente | Verificar mudança para `concluido` quando todos os itens são finalizados | Aprovado |
| CTA-003 | Quantidade concluída acima do total | Verificar o bloqueio da regra inválida | Aprovado |

Resultado do Maven:

```text
Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## 5. Banco utilizado nos testes automatizados

Os testes automatizados utilizam:

```text
jdbc:h2:mem:cfwebtest
```

O uso do H2 evita alterações, exclusões ou inserções no banco MySQL principal.

## 6. Conclusão

Os principais fluxos do sistema foram aprovados, incluindo autenticação, projetos, usuários, auditorias, não conformidades, checklists, Dashboard e regras de negócio. O módulo Documentos apresentou limitações conhecidas, registradas no documento `registro-bugs.md`. Essas limitações não impediram a validação dos demais módulos.
