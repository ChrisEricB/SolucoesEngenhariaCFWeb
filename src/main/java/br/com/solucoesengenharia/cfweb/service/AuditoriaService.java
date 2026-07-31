package br.com.solucoesengenharia.cfweb.service;

import br.com.solucoesengenharia.cfweb.exception.RegraNegocioException;
import br.com.solucoesengenharia.cfweb.model.Auditoria;
import br.com.solucoesengenharia.cfweb.model.Projeto;
import br.com.solucoesengenharia.cfweb.repository.AuditoriaRepository;
import br.com.solucoesengenharia.cfweb.repository.NaoConformidadeRepository;
import br.com.solucoesengenharia.cfweb.repository.ProjetoRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final ProjetoRepository projetoRepository;
    private final NaoConformidadeRepository
        naoConformidadeRepository;

    public AuditoriaService(
        AuditoriaRepository auditoriaRepository,
        ProjetoRepository projetoRepository,
        NaoConformidadeRepository
            naoConformidadeRepository
    ) {
        this.auditoriaRepository =
            auditoriaRepository;

        this.projetoRepository =
            projetoRepository;

        this.naoConformidadeRepository =
            naoConformidadeRepository;
    }

    @Transactional(readOnly = true)
    public List<Auditoria> listarTodos() {
        Sort ordenacao =
            Sort.by(
                Sort.Direction.DESC,
                "id"
            );

        return auditoriaRepository.findAll(
            ordenacao
        );
    }

    @Transactional(readOnly = true)
    public List<Auditoria> pesquisar(
        String termo
    ) {
        if (termo == null || termo.isBlank()) {
            return listarTodos();
        }

        String pesquisa = termo.trim();

        return auditoriaRepository
            .findByTituloContainingIgnoreCaseOrNomeProjetoContainingIgnoreCaseOrderByIdDesc(
                pesquisa,
                pesquisa
            );
    }

    @Transactional(readOnly = true)
    public Auditoria buscarPorId(Long id) {
        return auditoriaRepository
            .findById(id)
            .orElseThrow(
                () -> new IllegalArgumentException(
                    "Auditoria não encontrada."
                )
            );
    }

    @Transactional
    public Auditoria criar(
        Auditoria auditoria
    ) {
        auditoria.setId(null);

        Projeto projeto =
            buscarProjeto(
                auditoria.getIdProjeto()
            );

        auditoria.setNomeProjeto(
            projeto.getNome()
        );

        normalizarDados(auditoria);

        return auditoriaRepository.save(
            auditoria
        );
    }

    @Transactional
    public Auditoria atualizar(
        Long id,
        Auditoria dadosAtualizados
    ) {
        Auditoria auditoriaExistente =
            buscarPorId(id);

        Projeto projeto =
            buscarProjeto(
                dadosAtualizados.getIdProjeto()
            );

        auditoriaExistente.setTitulo(
            dadosAtualizados.getTitulo()
        );

        auditoriaExistente.setTipo(
            dadosAtualizados.getTipo()
        );

        auditoriaExistente.setIdProjeto(
            dadosAtualizados.getIdProjeto()
        );

        auditoriaExistente.setNomeProjeto(
            projeto.getNome()
        );

        auditoriaExistente.setResponsavel(
            dadosAtualizados.getResponsavel()
        );

        auditoriaExistente.setDataAuditoria(
            dadosAtualizados.getDataAuditoria()
        );

        auditoriaExistente.setStatus(
            dadosAtualizados.getStatus()
        );

        auditoriaExistente.setObservacoes(
            dadosAtualizados.getObservacoes()
        );

        normalizarDados(
            auditoriaExistente
        );

        return auditoriaRepository.save(
            auditoriaExistente
        );
    }

    @Transactional
    public void excluir(Long id) {
        if (!auditoriaRepository.existsById(id)) {
            throw new IllegalArgumentException(
                "Auditoria não encontrada."
            );
        }

        if (
            naoConformidadeRepository
                .existsByIdAuditoria(id)
        ) {
            throw new RegraNegocioException(
                "Não é possível excluir uma auditoria que possui não conformidades vinculadas."
            );
        }

        auditoriaRepository.deleteById(id);
    }

    private Projeto buscarProjeto(
        Long idProjeto
    ) {
        if (idProjeto == null) {
            throw new RegraNegocioException(
                "Informe o projeto relacionado."
            );
        }

        return projetoRepository
            .findById(idProjeto)
            .orElseThrow(
                () -> new RegraNegocioException(
                    "O projeto informado não existe."
                )
            );
    }

    private void normalizarDados(
        Auditoria auditoria
    ) {
        if (auditoria.getTitulo() != null) {
            auditoria.setTitulo(
                auditoria.getTitulo().trim()
            );
        }

        if (auditoria.getTipo() != null) {
            auditoria.setTipo(
                auditoria.getTipo()
                    .trim()
                    .toLowerCase()
            );
        }

        if (
            auditoria.getNomeProjeto() != null
        ) {
            auditoria.setNomeProjeto(
                auditoria.getNomeProjeto().trim()
            );
        }

        if (
            auditoria.getResponsavel() != null
        ) {
            auditoria.setResponsavel(
                auditoria.getResponsavel().trim()
            );
        }

        if (auditoria.getStatus() != null) {
            auditoria.setStatus(
                auditoria.getStatus()
                    .trim()
                    .toLowerCase()
            );
        }

        if (
            auditoria.getObservacoes() != null
        ) {
            auditoria.setObservacoes(
                auditoria.getObservacoes().trim()
            );
        }
    }
}