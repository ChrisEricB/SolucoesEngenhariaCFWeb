# Soluções Engenharia C&F Web

Sistema web desenvolvido para apoiar a gestão de projetos, usuários, auditorias, não conformidades, checklists e documentos da empresa fictícia **Soluções Engenharia C&F**.

O projeto foi desenvolvido em Java com Spring Boot, interface HTML/CSS/JavaScript e persistência em banco de dados MySQL.

## Funcionalidades implementadas

- autenticação de usuários;
- controle de sessão e logout;
- proteção das páginas internas;
- cadastro, consulta, edição e exclusão de projetos;
- cadastro, consulta, edição e exclusão de usuários;
- cadastro e acompanhamento de auditorias;
- cadastro e acompanhamento de não conformidades;
- bloqueio da exclusão de auditorias que possuem não conformidades vinculadas;
- cadastro e acompanhamento de checklists;
- cálculo de progresso dos checklists;
- cadastro e visualização de documentos;
- Dashboard com dados reais obtidos das APIs;
- API REST integrada ao MySQL;
- testes automatizados com JUnit, Mockito e banco H2;
- versionamento do projeto com Git e GitHub.

## Tecnologias utilizadas

- Java 17;
- Spring Boot;
- Spring MVC;
- Spring Data JPA;
- Thymeleaf;
- Jakarta Validation;
- MySQL;
- H2 para testes;
- JUnit 5;
- Mockito;
- HTML5;
- CSS3;
- JavaScript;
- Maven;
- Git e GitHub;
- NetBeans;
- Postman.

## Requisitos para execução

Antes de executar o projeto, instale:

- Java JDK 17;
- MySQL Server;
- NetBeans ou outra IDE compatível com Maven;
- Git, caso seja necessário trabalhar com o repositório;
- Postman, apenas para testes manuais da API.

## Configuração do banco de dados

Crie no MySQL o banco:

```sql
CREATE DATABASE solucoes_engenharia_cf_web;
```

O projeto utiliza a variável de ambiente:

```text
CFWEB_DB_SENHA
```

Essa variável deve conter a senha do usuário MySQL configurado no arquivo `application.properties`.

No Prompt de Comando do Windows, para definir a variável somente na janela atual:

```bat
set CFWEB_DB_SENHA=SUA_SENHA_DO_MYSQL
```

Não publique a senha real do banco de dados no GitHub.

## Como executar

Abra o Prompt de Comando na pasta principal do projeto e execute:

```bat
mvnw.cmd spring-boot:run
```

Aguarde a mensagem de inicialização do Spring Boot e acesse:

```text
http://localhost:8080
```

## Usuário para avaliação

```text
E-mail: professor@avaliacao.com
Senha: 123456
Perfil: Administrador do Sistema
```

## Como executar os testes

Com o servidor parado, execute:

```bat
mvnw.cmd test
```

Os testes utilizam o perfil `test` e um banco H2 em memória. O banco MySQL principal não é utilizado durante os testes automatizados.

Resultado obtido:

```text
Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Como compilar o projeto

Execute:

```bat
mvnw.cmd clean package
```

O arquivo compilado será gerado na pasta:

```text
target
```

## Estrutura principal

```text
src
     main
        java
          br.com.solucoesengenharia.cfweb
             config
             controller
             exception
             model
             repository
             service
         resources
          static
              css
              js
        templates
        application.properties

    test
         java
        resources
```

## Documentação complementar

A pasta `documentacao` contém:

- `plano-de-testes.md`;
- `registro-bugs.md`;
- `evidencias.md`.

## Defeitos conhecidos

O módulo Documentos possui limitações conhecidas relacionadas à edição, aos filtros e à permanência do registro após atualizar a página. Esses itens estão descritos detalhadamente em `documentacao/registro-bugs.md`.

## Versionamento

O projeto foi versionado com Git e enviado para um repositório GitHub. Os commits foram realizados por módulo para facilitar a rastreabilidade das alterações.

**Repositório:** https://github.com/ChrisEricB/SolucoesEngenhariaCFWeb
