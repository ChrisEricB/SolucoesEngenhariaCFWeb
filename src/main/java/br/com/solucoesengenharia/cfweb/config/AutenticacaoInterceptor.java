package br.com.solucoesengenharia.cfweb.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AutenticacaoInterceptor
        implements HandlerInterceptor {

    @Override
    public boolean preHandle(
        HttpServletRequest request,
        HttpServletResponse response,
        Object handler
    ) throws Exception {

        if (
            request.getSession(false) != null
            && request
                .getSession(false)
                .getAttribute("usuarioId")
                != null
        ) {
            return true;
        }

        response.sendRedirect("/");

        return false;
    }
}