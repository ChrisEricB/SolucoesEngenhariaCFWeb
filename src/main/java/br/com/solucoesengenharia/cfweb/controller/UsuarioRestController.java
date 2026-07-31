package br.com.solucoesengenharia.cfweb.controller;

import br.com.solucoesengenharia.cfweb.model.Usuario;
import br.com.solucoesengenharia.cfweb.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {

    private final UsuarioService usuarioService;

    public UsuarioRestController(
        UsuarioService usuarioService
    ) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> listar(
        @RequestParam(
            required = false
        ) String termo
    ) {
        return usuarioService.pesquisar(termo);
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(
        @PathVariable Long id
    ) {
        return usuarioService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario criar(
        @Valid
        @RequestBody
        Usuario usuario
    ) {
        return usuarioService.criar(usuario);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(
        @PathVariable Long id,

        @Valid
        @RequestBody
        Usuario usuario
    ) {
        return usuarioService.atualizar(
            id,
            usuario
        );
    }

    @PatchMapping("/{id}/situacao")
    public Usuario alterarSituacao(
        @PathVariable Long id
    ) {
        return usuarioService.alterarSituacao(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
        @PathVariable Long id
    ) {
        usuarioService.excluir(id);
    }
}