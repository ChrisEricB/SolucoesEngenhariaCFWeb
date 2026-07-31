package br.com.solucoesengenharia.cfweb.repository;

import br.com.solucoesengenharia.cfweb.model.Documento;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentoRepository
        extends JpaRepository<Documento, Long> {

    List<Documento>
        findByTituloContainingIgnoreCaseOrNomeProjetoContainingIgnoreCaseOrNomeArquivoContainingIgnoreCaseOrEnviadoPorContainingIgnoreCaseOrderByIdDesc(
            String titulo,
            String nomeProjeto,
            String nomeArquivo,
            String enviadoPor
        );
}

