package br.com.solucoesengenharia.cfweb.controller;

import br.com.solucoesengenharia.cfweb.model.Auditoria;
import br.com.solucoesengenharia.cfweb.service.AuditoriaService;
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
@RequestMapping("/api/auditorias")
public class AuditoriaRestController {

    private final AuditoriaService
        auditoriaService;

    public AuditoriaRestController(
        AuditoriaService auditoriaService
    ) {
        this.auditoriaService =
            auditoriaService;
    }

    @GetMapping
    public List<Auditoria> listar(
        @RequestParam(
            required = false
        ) String termo
    ) {
        return auditoriaService.pesquisar(
            termo
        );
    }

    @GetMapping("/{id}")
    public Auditoria buscarPorId(
        @PathVariable Long id
    ) {
        return auditoriaService.buscarPorId(
            id
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Auditoria criar(
        @Valid
        @RequestBody
        Auditoria auditoria
    ) {
        return auditoriaService.criar(
            auditoria
        );
    }

    @PutMapping("/{id}")
    public Auditoria atualizar(
        @PathVariable Long id,

        @Valid
        @RequestBody
        Auditoria auditoria
    ) {
        return auditoriaService.atualizar(
            id,
            auditoria
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
        @PathVariable Long id
    ) {
        auditoriaService.excluir(id);
    }
}