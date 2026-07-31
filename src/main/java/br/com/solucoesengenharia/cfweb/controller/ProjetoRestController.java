package br.com.solucoesengenharia.cfweb.controller;

import br.com.solucoesengenharia.cfweb.model.Projeto;
import br.com.solucoesengenharia.cfweb.service.ProjetoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projetos")
public class ProjetoRestController {

    private final ProjetoService projetoService;

    public ProjetoRestController(
        ProjetoService projetoService
    ) {
        this.projetoService = projetoService;
    }

    @GetMapping
    public List<Projeto> listar(
        @RequestParam(
            required = false
        ) String nome
    ) {
        return projetoService
            .pesquisarPorNome(nome);
    }

    @GetMapping("/{id}")
    public Projeto buscarPorId(
        @PathVariable Long id
    ) {
        return projetoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Projeto criar(
        @Valid
        @RequestBody
        Projeto projeto
    ) {
        return projetoService.criar(projeto);
    }

    @PutMapping("/{id}")
    public Projeto atualizar(
        @PathVariable Long id,

        @Valid
        @RequestBody
        Projeto projeto
    ) {
        return projetoService.atualizar(
            id,
            projeto
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
        @PathVariable Long id
    ) {
        projetoService.excluir(id);
    }
}