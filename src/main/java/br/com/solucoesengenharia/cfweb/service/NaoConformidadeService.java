package br.com.solucoesengenharia.cfweb.service;

import br.com.solucoesengenharia.cfweb.exception.RegraNegocioException;
import br.com.solucoesengenharia.cfweb.model.NaoConformidade;
import br.com.solucoesengenharia.cfweb.repository.AuditoriaRepository;
import br.com.solucoesengenharia.cfweb.repository.NaoConformidadeRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NaoConformidadeService {

    private final NaoConformidadeRepository
        naoConformidadeRepository;

    private final AuditoriaRepository
        auditoriaRepository;

    public NaoConformidadeService(
        NaoConformidadeRepository
            naoConformidadeRepository,

        AuditoriaRepository
            auditoriaRepository
    ) {
        this.naoConformidadeRepository =
            naoConformidadeRepository;

        this.auditoriaRepository =
            auditoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<NaoConformidade> listarTodos() {
        Sort ordenacao =
            Sort.by(
                Sort.Direction.DESC,
                "id"
            );

        return naoConformidadeRepository
            .findAll(ordenacao);
    }

    @Transactional(readOnly = true)
    public List<NaoConformidade> pesquisar(
        String termo
    ) {
        if (termo == null || termo.isBlank()) {
            return listarTodos();
        }

        String pesquisa = termo.trim();

        return naoConformidadeRepository
            .findByTituloContainingIgnoreCaseOrDescricaoContainingIgnoreCaseOrderByIdDesc(
                pesquisa,
                pesquisa
            );
    }

    @Transactional(readOnly = true)
    public List<NaoConformidade>
            listarPorAuditoria(
                Long idAuditoria
            ) {

        return naoConformidadeRepository
            .findByIdAuditoriaOrderByIdDesc(
                idAuditoria
            );
    }

    @Transactional(readOnly = true)
    public NaoConformidade buscarPorId(
        Long id
    ) {
        return naoConformidadeRepository
            .findById(id)
            .orElseThrow(
                () -> new IllegalArgumentException(
                    "Não conformidade não encontrada."
                )
            );
    }

    @Transactional
    public NaoConformidade criar(
        NaoConformidade naoConformidade
    ) {
        naoConformidade.setId(null);

        validarAuditoria(
            naoConformidade.getIdAuditoria()
        );

        normalizarDados(
            naoConformidade
        );

        return naoConformidadeRepository
            .save(naoConformidade);
    }

    @Transactional
    public NaoConformidade atualizar(
        Long id,
        NaoConformidade dadosAtualizados
    ) {
        NaoConformidade registroExistente =
            buscarPorId(id);

        validarAuditoria(
            dadosAtualizados.getIdAuditoria()
        );

        registroExistente.setIdAuditoria(
            dadosAtualizados.getIdAuditoria()
        );

        registroExistente.setTitulo(
            dadosAtualizados.getTitulo()
        );

        registroExistente.setDescricao(
            dadosAtualizados.getDescricao()
        );

        registroExistente.setGravidade(
            dadosAtualizados.getGravidade()
        );

        registroExistente.setStatus(
            dadosAtualizados.getStatus()
        );

        registroExistente.setResponsavel(
            dadosAtualizados.getResponsavel()
        );

        registroExistente.setDataIdentificacao(
            dadosAtualizados.getDataIdentificacao()
        );

        registroExistente.setPrazoCorrecao(
            dadosAtualizados.getPrazoCorrecao()
        );

        registroExistente.setAcaoCorretiva(
            dadosAtualizados.getAcaoCorretiva()
        );

        normalizarDados(
            registroExistente
        );

        return naoConformidadeRepository
            .save(registroExistente);
    }

    @Transactional
    public void excluir(Long id) {
        if (
            !naoConformidadeRepository
                .existsById(id)
        ) {
            throw new IllegalArgumentException(
                "Não conformidade não encontrada."
            );
        }

        naoConformidadeRepository.deleteById(
            id
        );
    }

    private void validarAuditoria(
        Long idAuditoria
    ) {
        if (
            idAuditoria == null
            || !auditoriaRepository
                .existsById(idAuditoria)
        ) {
            throw new RegraNegocioException(
                "A auditoria informada não existe."
            );
        }
    }

    private void normalizarDados(
        NaoConformidade registro
    ) {
        if (registro.getTitulo() != null) {
            registro.setTitulo(
                registro.getTitulo().trim()
            );
        }

        if (
            registro.getDescricao() != null
        ) {
            registro.setDescricao(
                registro.getDescricao().trim()
            );
        }

        if (
            registro.getGravidade() != null
        ) {
            registro.setGravidade(
                registro.getGravidade()
                    .trim()
                    .toLowerCase()
            );
        }

        if (registro.getStatus() != null) {
            registro.setStatus(
                registro.getStatus()
                    .trim()
                    .toLowerCase()
            );
        }

        if (
            registro.getResponsavel() != null
        ) {
            registro.setResponsavel(
                registro.getResponsavel().trim()
            );
        }

        if (
            registro.getAcaoCorretiva() != null
        ) {
            registro.setAcaoCorretiva(
                registro.getAcaoCorretiva().trim()
            );
        }
    }
}