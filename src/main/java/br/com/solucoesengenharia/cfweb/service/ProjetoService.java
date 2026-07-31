package br.com.solucoesengenharia.cfweb.service;

import br.com.solucoesengenharia.cfweb.model.Projeto;
import br.com.solucoesengenharia.cfweb.repository.ProjetoRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;

    public ProjetoService(
        ProjetoRepository projetoRepository
    ) {
        this.projetoRepository = projetoRepository;
    }

    @Transactional(readOnly = true)
    public List<Projeto> listarTodos() {
        Sort ordenacao = Sort.by(
            Sort.Direction.DESC,
            "id"
        );

        return projetoRepository.findAll(ordenacao);
    }

    @Transactional(readOnly = true)
    public List<Projeto> pesquisarPorNome(
        String nome
    ) {
        if (nome == null || nome.isBlank()) {
            return listarTodos();
        }

        return projetoRepository
            .findByNomeContainingIgnoreCaseOrderByIdDesc(
                nome.trim()
            );
    }

    @Transactional(readOnly = true)
    public Projeto buscarPorId(Long id) {
        return projetoRepository
            .findById(id)
            .orElseThrow(
                () -> new IllegalArgumentException(
                    "Projeto não encontrado."
                )
            );
    }

    @Transactional
    public Projeto criar(Projeto projeto) {
        projeto.setId(null);

        normalizarDados(projeto);

        return projetoRepository.save(projeto);
    }

    @Transactional
    public Projeto atualizar(
        Long id,
        Projeto dadosAtualizados
    ) {
        Projeto projetoExistente =
            buscarPorId(id);

        projetoExistente.setNome(
            dadosAtualizados.getNome()
        );

        projetoExistente.setDescricao(
            dadosAtualizados.getDescricao()
        );

        projetoExistente.setStatus(
            dadosAtualizados.getStatus()
        );

        projetoExistente.setIdCliente(
            dadosAtualizados.getIdCliente()
        );

        projetoExistente.setDataInicio(
            dadosAtualizados.getDataInicio()
        );

        projetoExistente.setDataFimPrevista(
            dadosAtualizados.getDataFimPrevista()
        );

        projetoExistente.setDataFimReal(
            dadosAtualizados.getDataFimReal()
        );

        projetoExistente.setOrcamento(
            dadosAtualizados.getOrcamento()
        );

        projetoExistente.setResponsavel(
            dadosAtualizados.getResponsavel()
        );

        projetoExistente.setProgresso(
            dadosAtualizados.getProgresso()
        );

        normalizarDados(projetoExistente);

        return projetoRepository.save(
            projetoExistente
        );
    }

    @Transactional
    public void excluir(Long id) {
        if (!projetoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                "Projeto não encontrado."
            );
        }

        projetoRepository.deleteById(id);
    }

    private void normalizarDados(
        Projeto projeto
    ) {
        if (projeto.getNome() != null) {
            projeto.setNome(
                projeto.getNome().trim()
            );
        }

        if (projeto.getDescricao() != null) {
            projeto.setDescricao(
                projeto.getDescricao().trim()
            );
        }

        if (projeto.getResponsavel() != null) {
            projeto.setResponsavel(
                projeto.getResponsavel().trim()
            );
        }

        if (projeto.getStatus() != null) {
            projeto.setStatus(
                projeto.getStatus().trim()
            );
        }

        if (projeto.getProgresso() == null) {
            projeto.setProgresso(0);
        }
    }
}