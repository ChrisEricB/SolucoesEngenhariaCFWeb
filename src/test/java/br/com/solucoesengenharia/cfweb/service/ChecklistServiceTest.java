package br.com.solucoesengenharia.cfweb.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.solucoesengenharia.cfweb.exception.RegraNegocioException;
import br.com.solucoesengenharia.cfweb.model.Checklist;
import br.com.solucoesengenharia.cfweb.model.Projeto;
import br.com.solucoesengenharia.cfweb.repository.ChecklistRepository;
import br.com.solucoesengenharia.cfweb.repository.ProjetoRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ChecklistServiceTest {

    @Mock
    private ChecklistRepository checklistRepository;

    @Mock
    private ProjetoRepository projetoRepository;

    private ChecklistService checklistService;

    @BeforeEach
    void prepararTeste() {
        checklistService =
            new ChecklistService(
                checklistRepository,
                projetoRepository
            );
    }

    @Test
    void deveCriarChecklistConcluidoQuandoTodosOsItensEstiveremConcluidos() {
        Projeto projeto =
            new Projeto();

        projeto.setNome(
            "Projeto Solar"
        );

        when(
            projetoRepository.findById(1L)
        ).thenReturn(
            Optional.of(projeto)
        );

        when(
            checklistRepository.save(
                any(Checklist.class)
            )
        ).thenAnswer(
            chamada ->
                chamada.getArgument(0)
        );

        Checklist checklist =
            criarChecklistValido();

        checklist.setTotalItens(5);
        checklist.setItensConcluidos(5);
        checklist.setStatus("andamento");

        Checklist resultado =
            checklistService.criar(
                checklist
            );

        assertThat(
            resultado.getStatus()
        ).isEqualTo("concluido");

        assertThat(
            resultado.getNomeProjeto()
        ).isEqualTo("Projeto Solar");

        assertThat(
            resultado.getItensConcluidos()
        ).isEqualTo(5);

        verify(
            checklistRepository
        ).save(checklist);
    }

    @Test
    void deveImpedirQuantidadeConcluidaMaiorQueTotalDeItens() {
        Projeto projeto =
            new Projeto();

        projeto.setNome(
            "Projeto Solar"
        );

        when(
            projetoRepository.findById(1L)
        ).thenReturn(
            Optional.of(projeto)
        );

        Checklist checklist =
            criarChecklistValido();

        checklist.setTotalItens(4);
        checklist.setItensConcluidos(5);

        assertThatThrownBy(
            () ->
                checklistService.criar(
                    checklist
                )
        )
            .isInstanceOf(
                RegraNegocioException.class
            )
            .hasMessageContaining(
                "não pode ser maior"
            );
    }

    private Checklist criarChecklistValido() {
        Checklist checklist =
            new Checklist();

        checklist.setTitulo(
            "Inspeção de equipamentos"
        );

        checklist.setIdProjeto(1L);

        checklist.setResponsavel(
            "Administrador do Sistema"
        );

        checklist.setPrazo(
            LocalDate.now().plusDays(10)
        );

        checklist.setStatus(
            "planejado"
        );

        checklist.setDescricao(
            "Verificação completa dos equipamentos do projeto."
        );

        checklist.setTotalItens(10);
        checklist.setItensConcluidos(0);

        return checklist;
    }
}
