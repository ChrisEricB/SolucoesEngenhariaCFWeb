package br.com.solucoesengenharia.cfweb.controller;

import br.com.solucoesengenharia.cfweb.dto.LoginRequest;
import br.com.solucoesengenharia.cfweb.dto.LoginResponse;
import br.com.solucoesengenharia.cfweb.model.Usuario;
import br.com.solucoesengenharia.cfweb.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/autenticacao")
public class AutenticacaoRestController {

    private final UsuarioService usuarioService;

    public AutenticacaoRestController(
        UsuarioService usuarioService
    ) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public LoginResponse realizarLogin(
        @Valid
        @RequestBody
        LoginRequest login,
        HttpSession session
    ) {
        Usuario usuario =
            usuarioService.autenticar(
                login.getEmail(),
                login.getSenha()
            );

        session.setAttribute(
            "usuarioId",
            usuario.getId()
        );

        session.setAttribute(
            "usuarioNome",
            usuario.getNome()
        );

        session.setAttribute(
            "usuarioEmail",
            usuario.getEmail()
        );

        session.setAttribute(
            "usuarioPerfil",
            usuario.getPerfil()
        );

        return new LoginResponse(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getPerfil(),
            "Login realizado com sucesso."
        );
    }

    @GetMapping("/sessao")
    public ResponseEntity<LoginResponse>
            verificarSessao(
                HttpSession session
            ) {

        Long usuarioId =
            (Long) session.getAttribute(
                "usuarioId"
            );

        if (usuarioId == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
        }

        String nome =
            (String) session.getAttribute(
                "usuarioNome"
            );

        String email =
            (String) session.getAttribute(
                "usuarioEmail"
            );

        String perfil =
            (String) session.getAttribute(
                "usuarioPerfil"
            );

        LoginResponse resposta =
            new LoginResponse(
                usuarioId,
                nome,
                email,
                perfil,
                "Sessão ativa."
            );

        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void realizarLogout(
        HttpSession session
    ) {
        session.invalidate();
    }
}