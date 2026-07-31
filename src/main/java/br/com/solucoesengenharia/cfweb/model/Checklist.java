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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "checklists")
public class Checklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_checklist")
    private Long id;

    @NotBlank(message = "Informe o título do checklist.")
    @Size(
        min = 3,
        max = 150,
        message = "O título deve possuir entre 3 e 150 caracteres."
    )
    @Column(nullable = false, length = 150)
    private String titulo;

    @NotNull(message = "Informe o projeto relacionado.")
    @Column(name = "id_projeto", nullable = false)
    private Long idProjeto;

    @Size(
        max = 150,
        message = "O nome do projeto deve possuir no máximo 150 caracteres."
    )
    @Column(name = "nome_projeto", nullable = false, length = 150)
    private String nomeProjeto;

    @NotBlank(message = "Informe o responsável pelo checklist.")
    @Size(
        max = 150,
        message = "O responsável deve possuir no máximo 150 caracteres."
    )
    @Column(nullable = false, length = 150)
    private String responsavel;

    @NotNull(message = "Informe o prazo do checklist.")
    @Column(nullable = false)
    private LocalDate prazo;

    @NotBlank(message = "Selecione o status do checklist.")
    @Column(nullable = false, length = 30)
    private String status;

    @NotBlank(message = "Informe a descrição do checklist.")
    @Size(
        min = 10,
        max = 2000,
        message = "A descrição deve possuir entre 10 e 2000 caracteres."
    )
    @Lob
    @Column(nullable = false)
    private String descricao;

    @NotNull(message = "Informe a quantidade total de itens.")
    @Min(
        value = 1,
        message = "O checklist deve possuir pelo menos 1 item."
    )
    @Column(name = "total_itens", nullable = false)
    private Integer totalItens;

    @NotNull(message = "Informe a quantidade de itens concluídos.")
    @Min(
        value = 0,
        message = "A quantidade de itens concluídos não pode ser negativa."
    )
    @Column(name = "itens_concluidos", nullable = false)
    private Integer itensConcluidos;

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

    public Checklist() {
    }

    @PrePersist
    public void antesDeSalvar() {
        LocalDateTime agora = LocalDateTime.now();

        criadoEm = agora;
        atualizadoEm = agora;

        if (itensConcluidos == null) {
            itensConcluidos = 0;
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

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
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

    public LocalDate getPrazo() {
        return prazo;
    }

    public void setPrazo(LocalDate prazo) {
        this.prazo = prazo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getTotalItens() {
        return totalItens;
    }

    public void setTotalItens(Integer totalItens) {
        this.totalItens = totalItens;
    }

    public Integer getItensConcluidos() {
        return itensConcluidos;
    }

    public void setItensConcluidos(Integer itensConcluidos) {
        this.itensConcluidos = itensConcluidos;
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

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}