\# Registro de falhas — Etapa 9



\## Falha 1 — Acesso sem autenticação



Problema: as páginas internas podiam ser acessadas diretamente sem login.



Correção: implementação de HttpSession, AutenticacaoInterceptor e WebConfig.



Resultado: usuários sem sessão são redirecionados para a tela de login.



\## Falha 2 — Logout incompleto



Problema: o botão Sair apenas abria a página de login e não invalidava a sessão.



Correção: criação do endpoint POST /api/autenticacao/logout e integração com sessao.js.



Resultado: a sessão é encerrada corretamente.



\## Falha 3 — Alerta de compatibilidade JavaScript



Problema: o NetBeans marcava o operador ?? como incompatível.



Correção: substituição por verificação explícita de null e undefined.



Resultado: os alertas desapareceram sem alteração do comportamento do sistema.

