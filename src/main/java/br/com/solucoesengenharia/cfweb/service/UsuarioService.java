package br.com.solucoesengenharia.cfweb.service;

import br.com.solucoesengenharia.cfweb.exception.RegraNegocioException;
import br.com.solucoesengenharia.cfweb.model.Usuario;
import br.com.solucoesengenharia.cfweb.repository.UsuarioRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        Sort ordenacao = Sort.by(
            Sort.Direction.DESC,
            "id"
        );

        return usuarioRepository.findAll(ordenacao);
    }

    @Transactional(readOnly = true)
    public List<Usuario> pesquisar(
        String termo
    ) {
        if (termo == null || termo.isBlank()) {
            return listarTodos();
        }

        String pesquisa = termo.trim();

        return usuarioRepository
            .findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByIdDesc(
                pesquisa,
                pesquisa
            );
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository
            .findById(id)
            .orElseThrow(
                () -> new IllegalArgumentException(
                    "Usuário não encontrado."
                )
            );
    }
    
    @Transactional(readOnly = true)
public Usuario autenticar(
    String email,
    String senha
) {
    if (
        email == null
        || email.isBlank()
        || senha == null
        || senha.isBlank()
    ) {
        throw new RegraNegocioException(
            "Informe o e-mail e a senha."
        );
    }

    Usuario usuario = usuarioRepository
        .findByEmailIgnoreCase(
            email.trim()
        )
        .orElseThrow(
            () -> new RegraNegocioException(
                "E-mail ou senha inválidos."
            )
        );

    if (
        !Boolean.TRUE.equals(
            usuario.getAtivo()
        )
    ) {
        throw new RegraNegocioException(
            "Este usuário está inativo."
        );
    }

    boolean senhaCorreta =
        passwordEncoder.matches(
            senha,
            usuario.getSenha()
        );

    if (!senhaCorreta) {
        throw new RegraNegocioException(
            "E-mail ou senha inválidos."
        );
    }

    return usuario;
}

    @Transactional
    public Usuario criar(Usuario usuario) {
        usuario.setId(null);

        normalizarDados(usuario);

        validarSenhaObrigatoria(usuario.getSenha());

        if (
            usuarioRepository.existsByEmailIgnoreCase(
                usuario.getEmail()
            )
        ) {
            throw new RegraNegocioException(
                "Já existe um usuário cadastrado com este e-mail."
            );
        }

        usuario.setSenha(
            passwordEncoder.encode(
                usuario.getSenha()
            )
        );

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario atualizar(
        Long id,
        Usuario dadosAtualizados
    ) {
        Usuario usuarioExistente =
            buscarPorId(id);

        normalizarDados(dadosAtualizados);

        if (
            usuarioRepository
                .existsByEmailIgnoreCaseAndIdNot(
                    dadosAtualizados.getEmail(),
                    id
                )
        ) {
            throw new RegraNegocioException(
                "Já existe outro usuário cadastrado com este e-mail."
            );
        }

        usuarioExistente.setNome(
            dadosAtualizados.getNome()
        );

        usuarioExistente.setEmail(
            dadosAtualizados.getEmail()
        );

        usuarioExistente.setPerfil(
            dadosAtualizados.getPerfil()
        );

        usuarioExistente.setAtivo(
            dadosAtualizados.getAtivo()
        );

        if (
            dadosAtualizados.getSenha() != null
            && !dadosAtualizados.getSenha().isBlank()
        ) {
            usuarioExistente.setSenha(
                passwordEncoder.encode(
                    dadosAtualizados.getSenha()
                )
            );
        }

        return usuarioRepository.save(
            usuarioExistente
        );
    }

    @Transactional
    public Usuario alterarSituacao(
        Long id
    ) {
        Usuario usuario = buscarPorId(id);

        boolean situacaoAtual =
            Boolean.TRUE.equals(
                usuario.getAtivo()
            );

        usuario.setAtivo(!situacaoAtual);

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void excluir(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException(
                "Usuário não encontrado."
            );
        }

        usuarioRepository.deleteById(id);
    }

    private void normalizarDados(
        Usuario usuario
    ) {
        if (usuario.getNome() != null) {
            usuario.setNome(
                usuario.getNome().trim()
            );
        }

        if (usuario.getEmail() != null) {
            usuario.setEmail(
                usuario.getEmail()
                    .trim()
                    .toLowerCase()
            );
        }

        if (usuario.getPerfil() != null) {
            usuario.setPerfil(
                usuario.getPerfil()
                    .trim()
                    .toLowerCase()
            );
        }

        if (usuario.getAtivo() == null) {
            usuario.setAtivo(true);
        }
    }

    private void validarSenhaObrigatoria(
        String senha
    ) {
        if (senha == null || senha.isBlank()) {
            throw new RegraNegocioException(
                "Informe uma senha para o usuário."
            );
        }

        if (senha.length() < 6) {
            throw new RegraNegocioException(
                "A senha deve possuir pelo menos 6 caracteres."
            );
        }
    }
}