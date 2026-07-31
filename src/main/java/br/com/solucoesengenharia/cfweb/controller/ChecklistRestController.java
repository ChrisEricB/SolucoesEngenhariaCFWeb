package br.com.solucoesengenharia.cfweb.controller;

import br.com.solucoesengenharia.cfweb.model.Checklist;
import br.com.solucoesengenharia.cfweb.service.ChecklistService;
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
@RequestMapping("/api/checklists")
public class ChecklistRestController {

    private final ChecklistService checklistService;

    public ChecklistRestController(
        ChecklistService checklistService
    ) {
        this.checklistService =
            checklistService;
    }

    @GetMapping
    public List<Checklist> listar(
        @RequestParam(
            required = false
        ) String termo
    ) {
        return checklistService.pesquisar(
            termo
        );
    }

    @GetMapping("/{id}")
    public Checklist buscarPorId(
        @PathVariable Long id
    ) {
        return checklistService.buscarPorId(
            id
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Checklist criar(
        @Valid
        @RequestBody
        Checklist checklist
    ) {
        return checklistService.criar(
            checklist
        );
    }

    @PutMapping("/{id}")
    public Checklist atualizar(
        @PathVariable Long id,

        @Valid
        @RequestBody
        Checklist checklist
    ) {
        return checklistService.atualizar(
            id,
            checklist
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
        @PathVariable Long id
    ) {
        checklistService.excluir(id);
    }
}
