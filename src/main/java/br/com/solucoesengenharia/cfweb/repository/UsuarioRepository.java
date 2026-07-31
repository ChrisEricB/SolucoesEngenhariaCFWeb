package br.com.solucoesengenharia.cfweb.repository;

import br.com.solucoesengenharia.cfweb.model.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    boolean existsByEmailIgnoreCase(
        String email
    );

    boolean existsByEmailIgnoreCaseAndIdNot(
        String email,
        Long id
    );

    Optional<Usuario> findByEmailIgnoreCase(
        String email
    );

    List<Usuario>
        findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByIdDesc(
            String nome,
            String email
        );
}