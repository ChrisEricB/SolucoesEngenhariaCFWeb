package br.com.solucoesengenharia.cfweb.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projetos")
public class Projeto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_projeto")
    private Long id;

    @NotBlank(message = "Informe o nome do projeto.")
    @Size(
        min = 3,
        max = 150,
        message = "O nome deve possuir entre 3 e 150 caracteres."
    )
    @Column(nullable = false, length = 150)
    private String nome;

    @NotBlank(message = "Informe a descrição do projeto.")
    @Size(
        min = 10,
        max = 2000,
        message = "A descrição deve possuir entre 10 e 2000 caracteres."
    )
    @Lob
    @Column(nullable = false)
    private String descricao;

    @NotBlank(message = "Selecione o status do projeto.")
    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "id_cliente")
    private Integer idCliente;

    @NotNull(message = "Informe a data de início.")
    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim_prevista")
    private LocalDate dataFimPrevista;

    @Column(name = "data_fim_real")
    private LocalDate dataFimReal;

    @DecimalMin(
        value = "0.00",
        message = "O orçamento não pode ser negativo."
    )
    @Digits(
        integer = 13,
        fraction = 2,
        message = "Informe um orçamento válido."
    )
    @Column(precision = 15, scale = 2)
    private BigDecimal orcamento;

    @NotBlank(message = "Selecione o responsável.")
    @Column(nullable = false, length = 150)
    private String responsavel;

    @NotNull(message = "Informe o progresso.")
    @Min(
        value = 0,
        message = "O progresso mínimo é 0%."
    )
    @Max(
        value = 100,
        message = "O progresso máximo é 100%."
    )
    @Column(nullable = false)
    private Integer progresso = 0;

    @Column(
        name = "criado_em",
        nullable = false,
        updatable = false
    )
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    public Projeto() {
    }

    @PrePersist
    public void antesDeSalvar() {
        LocalDateTime agora = LocalDateTime.now();

        criadoEm = agora;
        atualizadoEm = agora;

        if (progresso == null) {
            progresso = 0;
        }
    }

    @PreUpdate
    public void antesDeAtualizar() {
        atualizadoEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFimPrevista() {
        return dataFimPrevista;
    }

    public void setDataFimPrevista(
        LocalDate dataFimPrevista
    ) {
        this.dataFimPrevista = dataFimPrevista;
    }

    public LocalDate getDataFimReal() {
        return dataFimReal;
    }

    public void setDataFimReal(
        LocalDate dataFimReal
    ) {
        this.dataFimReal = dataFimReal;
    }

    public BigDecimal getOrcamento() {
        return orcamento;
    }

    public void setOrcamento(BigDecimal orcamento) {
        this.orcamento = orcamento;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public Integer getProgresso() {
        return progresso;
    }

    public void setProgresso(Integer progresso) {
        this.progresso = progresso;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(
        LocalDateTime atualizadoEm
    ) {
        this.atualizadoEm = atualizadoEm;
    }
}