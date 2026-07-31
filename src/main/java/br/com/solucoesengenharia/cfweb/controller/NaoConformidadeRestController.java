package br.com.solucoesengenharia.cfweb.controller;

import br.com.solucoesengenharia.cfweb.model.NaoConformidade;
import br.com.solucoesengenharia.cfweb.service.NaoConformidadeService;
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
@RequestMapping("/api/nao-conformidades")
public class NaoConformidadeRestController {

    private final NaoConformidadeService
        naoConformidadeService;

    public NaoConformidadeRestController(
        NaoConformidadeService
            naoConformidadeService
    ) {
        this.naoConformidadeService =
            naoConformidadeService;
    }

    @GetMapping
    public List<NaoConformidade> listar(
        @RequestParam(
            required = false
        ) String termo,

        @RequestParam(
            required = false
        ) Long idAuditoria
    ) {
        if (idAuditoria != null) {
            return naoConformidadeService
                .listarPorAuditoria(
                    idAuditoria
                );
        }

        return naoConformidadeService
            .pesquisar(termo);
    }

    @GetMapping("/{id}")
    public NaoConformidade buscarPorId(
        @PathVariable Long id
    ) {
        return naoConformidadeService
            .buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NaoConformidade criar(
        @Valid
        @RequestBody
        NaoConformidade naoConformidade
    ) {
        return naoConformidadeService
            .criar(naoConformidade);
    }

    @PutMapping("/{id}")
    public NaoConformidade atualizar(
        @PathVariable Long id,

        @Valid
        @RequestBody
        NaoConformidade naoConformidade
    ) {
        return naoConformidadeService
            .atualizar(
                id,
                naoConformidade
            );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
        @PathVariable Long id
    ) {
        naoConformidadeService.excluir(id);
    }
}