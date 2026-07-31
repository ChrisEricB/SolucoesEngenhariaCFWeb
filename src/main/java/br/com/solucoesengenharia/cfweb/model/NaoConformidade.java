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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "nao_conformidades")
public class NaoConformidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nao_conformidade")
    private Long id;

    @NotNull(message = "Informe a auditoria relacionada.")
    @Column(name = "id_auditoria", nullable = false)
    private Long idAuditoria;

    @NotBlank(message = "Informe o título da não conformidade.")
    @Size(
        min = 3,
        max = 150,
        message = "O título deve possuir entre 3 e 150 caracteres."
    )
    @Column(nullable = false, length = 150)
    private String titulo;

    @NotBlank(message = "Informe a descrição da não conformidade.")
    @Size(
        min = 10,
        max = 2000,
        message = "A descrição deve possuir entre 10 e 2000 caracteres."
    )
    @Lob
    @Column(nullable = false)
    private String descricao;

    @NotBlank(message = "Selecione a gravidade.")
    @Column(nullable = false, length = 20)
    private String gravidade;

    @NotBlank(message = "Selecione o status.")
    @Column(nullable = false, length = 30)
    private String status;

    @NotBlank(message = "Informe o responsável.")
    @Size(
        max = 150,
        message = "O responsável deve possuir no máximo 150 caracteres."
    )
    @Column(nullable = false, length = 150)
    private String responsavel;

    @Column(name = "data_identificacao")
    private LocalDate dataIdentificacao;

    @Column(name = "prazo_correcao")
    private LocalDate prazoCorrecao;

    @Size(
        max = 2000,
        message = "A ação corretiva deve possuir no máximo 2000 caracteres."
    )
    @Lob
    @Column(name = "acao_corretiva")
    private String acaoCorretiva;

    @Column(
        name = "criado_em",
        nullable = false,
        updatable = false
    )
    private LocalDateTime criadoEm;

    @Column(
        name = "atualizado_em",
        nullable = false
    )
    private LocalDateTime atualizadoEm;

    public NaoConformidade() {
    }

    @PrePersist
    public void antesDeSalvar() {
        LocalDateTime agora = LocalDateTime.now();

        criadoEm = agora;
        atualizadoEm = agora;

        if (dataIdentificacao == null) {
            dataIdentificacao = LocalDate.now();
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

    public Long getIdAuditoria() {
        return idAuditoria;
    }

    public void setIdAuditoria(
        Long idAuditoria
    ) {
        this.idAuditoria = idAuditoria;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(
        String descricao
    ) {
        this.descricao = descricao;
    }

    public String getGravidade() {
        return gravidade;
    }

    public void setGravidade(
        String gravidade
    ) {
        this.gravidade = gravidade;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(
        String responsavel
    ) {
        this.responsavel = responsavel;
    }

    public LocalDate getDataIdentificacao() {
        return dataIdentificacao;
    }

    public void setDataIdentificacao(
        LocalDate dataIdentificacao
    ) {
        this.dataIdentificacao =
            dataIdentificacao;
    }

    public LocalDate getPrazoCorrecao() {
        return prazoCorrecao;
    }

    public void setPrazoCorrecao(
        LocalDate prazoCorrecao
    ) {
        this.prazoCorrecao = prazoCorrecao;
    }

    public String getAcaoCorretiva() {
        return acaoCorretiva;
    }

    public void setAcaoCorretiva(
        String acaoCorretiva
    ) {
        this.acaoCorretiva = acaoCorretiva;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(
        LocalDateTime criadoEm
    ) {
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