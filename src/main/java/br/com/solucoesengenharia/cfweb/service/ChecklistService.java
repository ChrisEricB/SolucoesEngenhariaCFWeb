package br.com.solucoesengenharia.cfweb.service;

import br.com.solucoesengenharia.cfweb.exception.RegraNegocioException;
import br.com.solucoesengenharia.cfweb.model.Checklist;
import br.com.solucoesengenharia.cfweb.model.Projeto;
import br.com.solucoesengenharia.cfweb.repository.ChecklistRepository;
import br.com.solucoesengenharia.cfweb.repository.ProjetoRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChecklistService {

    private static final Set<String> STATUS_VALIDOS =
        Set.of(
            "planejado",
            "andamento",
            "concluido",
            "atrasado"
        );

    private final ChecklistRepository checklistRepository;
    private final ProjetoRepository projetoRepository;

    public ChecklistService(
        ChecklistRepository checklistRepository,
        ProjetoRepository projetoRepository
    ) {
        this.checklistRepository =
            checklistRepository;

        this.projetoRepository =
            projetoRepository;
    }

    @Transactional(readOnly = true)
    public List<Checklist> listarTodos() {
        Sort ordenacao =
            Sort.by(
                Sort.Direction.DESC,
                "id"
            );

        return checklistRepository.findAll(
            ordenacao
        );
    }

    @Transactional(readOnly = true)
    public List<Checklist> pesquisar(
        String termo
    ) {
        if (termo == null || termo.isBlank()) {
            return listarTodos();
        }

        String pesquisa = termo.trim();

        return checklistRepository
            .findByTituloContainingIgnoreCaseOrNomeProjetoContainingIgnoreCaseOrResponsavelContainingIgnoreCaseOrderByIdDesc(
                pesquisa,
                pesquisa,
                pesquisa
            );
    }

    @Transactional(readOnly = true)
    public Checklist buscarPorId(Long id) {
        return checklistRepository
            .findById(id)
            .orElseThrow(
                () -> new IllegalArgumentException(
                    "Checklist não encontrado."
                )
            );
    }

    @Transactional
    public Checklist criar(
        Checklist checklist
    ) {
        checklist.setId(null);

        Projeto projeto =
            buscarProjeto(
                checklist.getIdProjeto()
            );

        checklist.setNomeProjeto(
            projeto.getNome()
        );

        normalizarDados(checklist);
        validarChecklist(checklist);
        ajustarStatus(checklist);

        return checklistRepository.save(
            checklist
        );
    }

    @Transactional
    public Checklist atualizar(
        Long id,
        Checklist dadosAtualizados
    ) {
        Checklist checklistExistente =
            buscarPorId(id);

        Projeto projeto =
            buscarProjeto(
                dadosAtualizados.getIdProjeto()
            );

        checklistExistente.setTitulo(
            dadosAtualizados.getTitulo()
        );

        checklistExistente.setIdProjeto(
            dadosAtualizados.getIdProjeto()
        );

        checklistExistente.setNomeProjeto(
            projeto.getNome()
        );

        checklistExistente.setResponsavel(
            dadosAtualizados.getResponsavel()
        );

        checklistExistente.setPrazo(
            dadosAtualizados.getPrazo()
        );

        checklistExistente.setStatus(
            dadosAtualizados.getStatus()
        );

        checklistExistente.setDescricao(
            dadosAtualizados.getDescricao()
        );

        checklistExistente.setTotalItens(
            dadosAtualizados.getTotalItens()
        );

        checklistExistente.setItensConcluidos(
            dadosAtualizados.getItensConcluidos()
        );

        normalizarDados(checklistExistente);
        validarChecklist(checklistExistente);
        ajustarStatus(checklistExistente);

        return checklistRepository.save(
            checklistExistente
        );
    }

    @Transactional
    public void excluir(Long id) {
        if (!checklistRepository.existsById(id)) {
            throw new IllegalArgumentException(
                "Checklist não encontrado."
            );
        }

        checklistRepository.deleteById(id);
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

    private void validarChecklist(
        Checklist checklist
    ) {
        if (
            checklist.getTotalItens() == null
            || checklist.getTotalItens() < 1
        ) {
            throw new RegraNegocioException(
                "O checklist deve possuir pelo menos 1 item."
            );
        }

        if (
            checklist.getItensConcluidos() == null
            || checklist.getItensConcluidos() < 0
        ) {
            throw new RegraNegocioException(
                "A quantidade de itens concluídos não pode ser negativa."
            );
        }

        if (
            checklist.getItensConcluidos()
                > checklist.getTotalItens()
        ) {
            throw new RegraNegocioException(
                "A quantidade de itens concluídos não pode ser maior que o total de itens."
            );
        }

        if (
            checklist.getStatus() == null
            || !STATUS_VALIDOS.contains(
                checklist.getStatus()
            )
        ) {
            throw new RegraNegocioException(
                "O status informado é inválido."
            );
        }
    }

    private void ajustarStatus(
        Checklist checklist
    ) {
        if (
            "concluido".equals(
                checklist.getStatus()
            )
        ) {
            checklist.setItensConcluidos(
                checklist.getTotalItens()
            );

            return;
        }

        if (
            checklist.getItensConcluidos()
                .equals(checklist.getTotalItens())
        ) {
            checklist.setStatus("concluido");
            return;
        }

        if (
            checklist.getPrazo() != null
            && checklist.getPrazo()
                .isBefore(LocalDate.now())
        ) {
            checklist.setStatus("atrasado");
        }
    }

    private void normalizarDados(
        Checklist checklist
    ) {
        if (checklist.getTitulo() != null) {
            checklist.setTitulo(
                checklist.getTitulo().trim()
            );
        }

        if (
            checklist.getNomeProjeto() != null
        ) {
            checklist.setNomeProjeto(
                checklist.getNomeProjeto().trim()
            );
        }

        if (
            checklist.getResponsavel() != null
        ) {
            checklist.setResponsavel(
                checklist.getResponsavel().trim()
            );
        }

        if (checklist.getStatus() != null) {
            checklist.setStatus(
                checklist.getStatus()
                    .trim()
                    .toLowerCase()
            );
        }

        if (
            checklist.getDescricao() != null
        ) {
            checklist.setDescricao(
                checklist.getDescricao().trim()
            );
        }

        if (
            checklist.getItensConcluidos() == null
        ) {
            checklist.setItensConcluidos(0);
        }
    }
}
