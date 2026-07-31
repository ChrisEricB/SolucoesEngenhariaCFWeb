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
@Table(name = "auditorias")
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Long id;

    @NotBlank(message = "Informe o título da auditoria.")
    @Size(
        min = 3,
        max = 150,
        message = "O título deve possuir entre 3 e 150 caracteres."
    )
    @Column(nullable = false, length = 150)
    private String titulo;

    @NotBlank(message = "Selecione o tipo da auditoria.")
    @Column(nullable = false, length = 40)
    private String tipo;

    @NotNull(message = "Informe o projeto relacionado.")
    @Column(name = "id_projeto", nullable = false)
    private Long idProjeto;

    @Size(
        max = 150,
        message = "O nome do projeto deve possuir no máximo 150 caracteres."
    )
    @Column(name = "nome_projeto", nullable = false, length = 150)
    private String nomeProjeto;

    @NotBlank(message = "Informe o responsável pela auditoria.")
    @Size(
        max = 150,
        message = "O responsável deve possuir no máximo 150 caracteres."
    )
    @Column(nullable = false, length = 150)
    private String responsavel;

    @NotNull(message = "Informe a data da auditoria.")
    @Column(name = "data_auditoria", nullable = false)
    private LocalDate dataAuditoria;

    @NotBlank(message = "Selecione o status da auditoria.")
    @Column(nullable = false, length = 30)
    private String status;

    @Size(
        max = 2000,
        message = "As observações devem possuir no máximo 2000 caracteres."
    )
    @Lob
    private String observacoes;

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

    public Auditoria() {
    }

    @PrePersist
    public void antesDeSalvar() {
        LocalDateTime agora = LocalDateTime.now();

        criadoEm = agora;
        atualizadoEm = agora;
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

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getIdProjeto() {
        return idProjeto;
    }

    public void setIdProjeto(Long idProjeto) {
        this.idProjeto = idProjeto;
    }

    public String getNomeProjeto() {
        return nomeProjeto;
    }

    public void setNomeProjeto(String nomeProjeto) {
        this.nomeProjeto = nomeProjeto;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public LocalDate getDataAuditoria() {
        return dataAuditoria;
    }

    public void setDataAuditoria(
        LocalDate dataAuditoria
    ) {
        this.dataAuditoria = dataAuditoria;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(
        String observacoes
    ) {
        this.observacoes = observacoes;
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