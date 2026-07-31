package br.com.solucoesengenharia.cfweb.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import java.time.LocalDateTime;

@Entity
@Table(name = "documentos")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Long id;

    @NotBlank(message = "Informe o título do documento.")
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

    @Column(
        name = "nome_projeto",
        nullable = false,
        length = 150
    )
    private String nomeProjeto;

    @NotBlank(message = "Informe o tipo do documento.")
    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(
        name = "nome_arquivo",
        nullable = false,
        length = 255
    )
    private String nomeArquivo;

    @Column(
        name = "tipo_conteudo",
        nullable = false,
        length = 120
    )
    private String tipoConteudo;

    @Column(
        name = "tamanho_arquivo",
        nullable = false
    )
    private Long tamanhoArquivo;

    @Column(
        name = "enviado_por",
        nullable = false,
        length = 150
    )
    private String enviadoPor;

    @Column(
        name = "enviado_em",
        nullable = false,
        updatable = false
    )
    private LocalDateTime enviadoEm;

    @Lob
    @JsonIgnore
    @Column(
        name = "dados_arquivo",
        nullable = false
    )
    private byte[] dadosArquivo;

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

    public Documento() {
    }

    @PrePersist
    public void antesDeSalvar() {
        LocalDateTime agora =
            LocalDateTime.now();

        if (enviadoEm == null) {
            enviadoEm = agora;
        }

        criadoEm = agora;
        atualizadoEm = agora;
    }

    @PreUpdate
    public void antesDeAtualizar() {
        atualizadoEm =
            LocalDateTime.now();
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

    public void setTitulo(
        String titulo
    ) {
        this.titulo = titulo;
    }

    public Long getIdProjeto() {
        return idProjeto;
    }

    public void setIdProjeto(
        Long idProjeto
    ) {
        this.idProjeto = idProjeto;
    }

    public String getNomeProjeto() {
        return nomeProjeto;
    }

    public void setNomeProjeto(
        String nomeProjeto
    ) {
        this.nomeProjeto = nomeProjeto;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(
        String tipo
    ) {
        this.tipo = tipo;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(
        String nomeArquivo
    ) {
        this.nomeArquivo = nomeArquivo;
    }

    public String getTipoConteudo() {
        return tipoConteudo;
    }

    public void setTipoConteudo(
        String tipoConteudo
    ) {
        this.tipoConteudo =
            tipoConteudo;
    }

    public Long getTamanhoArquivo() {
        return tamanhoArquivo;
    }

    public void setTamanhoArquivo(
        Long tamanhoArquivo
    ) {
        this.tamanhoArquivo =
            tamanhoArquivo;
    }

    public String getEnviadoPor() {
        return enviadoPor;
    }

    public void setEnviadoPor(
        String enviadoPor
    ) {
        this.enviadoPor = enviadoPor;
    }

    public LocalDateTime getEnviadoEm() {
        return enviadoEm;
    }

    public void setEnviadoEm(
        LocalDateTime enviadoEm
    ) {
        this.enviadoEm = enviadoEm;
    }

    public byte[] getDadosArquivo() {
        return dadosArquivo;
    }

    public void setDadosArquivo(
        byte[] dadosArquivo
    ) {
        this.dadosArquivo =
            dadosArquivo;
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
        this.atualizadoEm =
            atualizadoEm;
    }
}

