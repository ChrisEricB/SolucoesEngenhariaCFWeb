package br.com.solucoesengenharia.cfweb.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "usuarios",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_usuarios_email",
            columnNames = "email"
        )
    }
)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @NotBlank(message = "Informe o nome do usuário.")
    @Size(
        min = 3,
        max = 120,
        message = "O nome deve possuir entre 3 e 120 caracteres."
    )
    @Column(nullable = false, length = 120)
    private String nome;

    @NotBlank(message = "Informe o e-mail.")
    @Email(message = "Informe um e-mail válido.")
    @Size(
        max = 150,
        message = "O e-mail deve possuir no máximo 150 caracteres."
    )
    @Column(
        nullable = false,
        unique = true,
        length = 150
    )
    private String email;

    @Size(
        min = 6,
        max = 72,
        message = "A senha deve possuir entre 6 e 72 caracteres."
    )
    @JsonProperty(
        access = JsonProperty.Access.WRITE_ONLY
    )
    @Column(nullable = false, length = 100)
    private String senha;

    @NotBlank(message = "Selecione o perfil.")
    @Column(nullable = false, length = 30)
    private String perfil;

    @NotNull(message = "Informe a situação do usuário.")
    @Column(nullable = false)
    private Boolean ativo = true;

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

    public Usuario() {
    }

    @PrePersist
    public void antesDeSalvar() {
        LocalDateTime agora = LocalDateTime.now();

        criadoEm = agora;
        atualizadoEm = agora;

        if (ativo == null) {
            ativo = true;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
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