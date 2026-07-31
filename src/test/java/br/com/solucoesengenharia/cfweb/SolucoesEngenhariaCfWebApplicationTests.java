package br.com.solucoesengenharia.cfweb;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SolucoesEngenhariaCfWebApplicationTests {

    @Test
    void contextoDaAplicacaoDeveCarregar() {
        /*
         * O teste será aprovado quando o Spring conseguir
         * iniciar todo o contexto da aplicação usando o
         * banco H2 isolado do perfil de testes.
         */
    }
}
