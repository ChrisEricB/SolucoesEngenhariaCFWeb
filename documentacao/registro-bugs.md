# Registro de bugs

**Projeto:** Soluções Engenharia C&F Web  
**Data de atualização:** 31/07/2026  
**Responsável pelo registro:** Equipe de desenvolvimento

## Critérios de prioridade

- **Alta:** impede um fluxo principal ou causa perda de dados.
- **Média:** limita uma funcionalidade importante, mas não bloqueia o restante do sistema.
- **Baixa:** problema visual ou comportamento secundário.

---

## BUG-001 — Documento não permanece após atualizar a página

**Módulo:** Documentos  
**Prioridade:** Alta  
**Status:** Pendente  
**Ambiente:** Navegador web e MySQL

### Descrição

O documento aparece na listagem imediatamente após o cadastro, porém não permanece após atualizar a página com a tecla F5.

### Passos para reproduzir

1. Entrar no sistema.
2. Abrir a página Documentos.
3. Clicar em “Enviar documento”.
4. Preencher os campos e selecionar um arquivo.
5. Salvar.
6. Confirmar que o documento aparece na tabela.
7. Atualizar a página com F5.

### Resultado esperado

O documento deveria ser carregado novamente da API e continuar na tabela.

### Resultado obtido

O documento deixa de aparecer depois da atualização.

### Impacto

A persistência completa do cadastro não foi confirmada, podendo ocorrer perda aparente do registro na interface.

---

## BUG-002 — Função de edição de documentos não disponível

**Módulo:** Documentos  
**Prioridade:** Média  
**Status:** Pendente

### Descrição

Durante o teste final, a função de edição não apareceu ou não apresentou o comportamento esperado.

### Passos para reproduzir

1. Abrir a página Documentos.
2. Cadastrar ou localizar um documento.
3. Procurar o botão ou ação de edição.
4. Tentar alterar os dados do documento.

### Resultado esperado

O sistema deveria abrir o formulário preenchido e permitir salvar as alterações.

### Resultado obtido

A ação de edição não apareceu ou não funcionou.

### Impacto

O usuário não consegue corrigir os dados de um documento já cadastrado.

---

## BUG-003 — Filtros do módulo Documentos não funcionam

**Módulo:** Documentos  
**Prioridade:** Média  
**Status:** Pendente

### Descrição

Os filtros por tipo, projeto e pesquisa não apresentaram o comportamento esperado durante os testes finais.

### Passos para reproduzir

1. Abrir a página Documentos.
2. Selecionar um tipo de arquivo.
3. Selecionar um projeto ou digitar um termo de pesquisa.
4. Observar a listagem.

### Resultado esperado

A tabela deveria exibir somente os registros correspondentes aos critérios selecionados.

### Resultado obtido

A listagem não foi filtrada corretamente.

### Impacto

A localização de documentos pode ficar mais difícil quando houver muitos registros.

---

## Observação geral

Os defeitos acima são **bugs conhecidos e pendentes**, mantidos no registro para demonstrar o processo de teste e bugtracking. Eles não devem ser descritos como funcionalidades intencionalmente quebradas.

Os demais módulos principais foram validados e permaneceram funcionais durante os testes realizados.
