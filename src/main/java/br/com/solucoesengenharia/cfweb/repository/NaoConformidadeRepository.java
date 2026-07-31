package br.com.solucoesengenharia.cfweb.repository;

import br.com.solucoesengenharia.cfweb.model.NaoConformidade;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NaoConformidadeRepository
        extends JpaRepository<NaoConformidade, Long> {

    List<NaoConformidade>
        findByTituloContainingIgnoreCaseOrDescricaoContainingIgnoreCaseOrderByIdDesc(
            String titulo,
            String descricao
        );

    List<NaoConformidade>
        findByIdAuditoriaOrderByIdDesc(
            Long idAuditoria
        );

    boolean existsByIdAuditoria(
        Long idAuditoria
    );
}