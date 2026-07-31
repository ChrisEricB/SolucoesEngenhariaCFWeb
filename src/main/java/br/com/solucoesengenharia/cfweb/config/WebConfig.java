package br.com.solucoesengenharia.cfweb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig
        implements WebMvcConfigurer {

    private final AutenticacaoInterceptor
        autenticacaoInterceptor;

    public WebConfig(
        AutenticacaoInterceptor
            autenticacaoInterceptor
    ) {
        this.autenticacaoInterceptor =
            autenticacaoInterceptor;
    }

    @Override
    public void addInterceptors(
        InterceptorRegistry registry
    ) {
        registry
            .addInterceptor(
                autenticacaoInterceptor
            )
            .addPathPatterns(
                "/dashboard",
                "/dashboard.html",
                "/projetos",
                "/projetos.html",
                "/auditorias",
                "/auditorias.html",
                "/checklists",
                "/checklists.html",
                "/documentos",
                "/documentos.html",
                "/usuarios",
                "/usuarios.html"
            );
    }
}