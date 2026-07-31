package br.com.solucoesengenharia.cfweb.repository;

import br.com.solucoesengenharia.cfweb.model.Projeto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetoRepository
        extends JpaRepository<Projeto, Long> {

    List<Projeto>
        findByNomeContainingIgnoreCaseOrderByIdDesc(
            String nome
        );
}