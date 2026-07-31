package br.com.solucoesengenharia.cfweb.repository;

import br.com.solucoesengenharia.cfweb.model.Auditoria;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriaRepository
        extends JpaRepository<Auditoria, Long> {

    List<Auditoria>
        findByTituloContainingIgnoreCaseOrNomeProjetoContainingIgnoreCaseOrderByIdDesc(
            String titulo,
            String nomeProjeto
        );
}