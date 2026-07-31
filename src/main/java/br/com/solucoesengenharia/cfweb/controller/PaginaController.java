package br.com.solucoesengenharia.cfweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginaController {

    @GetMapping({"/", "/login", "/index.html"})
    public String exibirLogin() {
        return "index";
    }

    @GetMapping({"/dashboard", "/dashboard.html"})
    public String exibirDashboard() {
        return "dashboard";
    }

    @GetMapping({"/projetos", "/projetos.html"})
    public String exibirProjetos() {
        return "projetos";
    }

    @GetMapping({"/auditorias", "/auditorias.html"})
    public String exibirAuditorias() {
        return "auditorias";
    }

    @GetMapping({"/checklists", "/checklists.html"})
    public String exibirChecklists() {
        return "checklists";
    }

    @GetMapping({"/documentos", "/documentos.html"})
    public String exibirDocumentos() {
        return "documentos";
    }

    @GetMapping({"/usuarios", "/usuarios.html"})
    public String exibirUsuarios() {
        return "usuarios";
    }
}