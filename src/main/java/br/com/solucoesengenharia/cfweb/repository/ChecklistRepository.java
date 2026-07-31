package br.com.solucoesengenharia.cfweb.repository;

import br.com.solucoesengenharia.cfweb.model.Checklist;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChecklistRepository
        extends JpaRepository<Checklist, Long> {

    List<Checklist>
        findByTituloContainingIgnoreCaseOrNomeProjetoContainingIgnoreCaseOrResponsavelContainingIgnoreCaseOrderByIdDesc(
            String titulo,
            String nomeProjeto,
            String responsavel
        );
}
