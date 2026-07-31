package br.com.solucoesengenharia.cfweb.service;

import br.com.solucoesengenharia.cfweb.exception.RegraNegocioException;
import br.com.solucoesengenharia.cfweb.model.Documento;
import br.com.solucoesengenharia.cfweb.model.Projeto;
import br.com.solucoesengenharia.cfweb.repository.DocumentoRepository;
import br.com.solucoesengenharia.cfweb.repository.ProjetoRepository;
import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentoService {

    private static final long TAMANHO_MAXIMO =
        10L * 1024L * 1024L;

    private static final Set<String>
        TIPOS_VALIDOS =
            Set.of(
                "pdf",
                "planilha",
                "documento"
            );

    private final DocumentoRepository
        documentoRepository;

    private final ProjetoRepository
        projetoRepository;

    public DocumentoService(
        DocumentoRepository documentoRepository,
        ProjetoRepository projetoRepository
    ) {
        this.documentoRepository =
            documentoRepository;

        this.projetoRepository =
            projetoRepository;
    }

    @Transactional(readOnly = true)
    public List<Documento> listarTodos() {
        Sort ordenacao =
            Sort.by(
                Sort.Direction.DESC,
                "id"
            );

        return documentoRepository.findAll(
            ordenacao
        );
    }

    @Transactional(readOnly = true)
    public List<Documento> pesquisar(
        String termo
    ) {
        if (
            termo == null
            || termo.isBlank()
        ) {
            return listarTodos();
        }

        String pesquisa = termo.trim();

        return documentoRepository
            .findByTituloContainingIgnoreCaseOrNomeProjetoContainingIgnoreCaseOrNomeArquivoContainingIgnoreCaseOrEnviadoPorContainingIgnoreCaseOrderByIdDesc(
                pesquisa,
                pesquisa,
                pesquisa,
                pesquisa
            );
    }

    @Transactional(readOnly = true)
    public Documento buscarPorId(
        Long id
    ) {
        return documentoRepository
            .findById(id)
            .orElseThrow(
                () -> new IllegalArgumentException(
                    "Documento não encontrado."
                )
            );
    }

    @Transactional
    public Documento criar(
        String titulo,
        Long idProjeto,
        String tipo,
        MultipartFile arquivo,
        String enviadoPor
    ) {
        Projeto projeto =
            buscarProjeto(idProjeto);

        validarTitulo(titulo);

        String tipoNormalizado =
            normalizarTipo(tipo);

        validarArquivo(
            arquivo,
            tipoNormalizado,
            true
        );

        Documento documento =
            new Documento();

        documento.setTitulo(
            titulo.trim()
        );

        documento.setIdProjeto(
            projeto.getId()
        );

        documento.setNomeProjeto(
            projeto.getNome()
        );

        documento.setTipo(
            tipoNormalizado
        );

        documento.setEnviadoPor(
            normalizarEnviadoPor(
                enviadoPor
            )
        );

        preencherArquivo(
            documento,
            arquivo
        );

        return documentoRepository.save(
            documento
        );
    }

    @Transactional
    public Documento atualizar(
        Long id,
        String titulo,
        Long idProjeto,
        String tipo,
        MultipartFile arquivo
    ) {
        Documento documento =
            buscarPorId(id);

        Projeto projeto =
            buscarProjeto(idProjeto);

        validarTitulo(titulo);

        String tipoNormalizado =
            normalizarTipo(tipo);

        documento.setTitulo(
            titulo.trim()
        );

        documento.setIdProjeto(
            projeto.getId()
        );

        documento.setNomeProjeto(
            projeto.getNome()
        );

        documento.setTipo(
            tipoNormalizado
        );

        boolean recebeuNovoArquivo =
            arquivo != null
            && !arquivo.isEmpty();

        if (recebeuNovoArquivo) {
            validarArquivo(
                arquivo,
                tipoNormalizado,
                true
            );

            preencherArquivo(
                documento,
                arquivo
            );

        } else {
            validarCompatibilidade(
                tipoNormalizado,
                documento.getNomeArquivo()
            );
        }

        return documentoRepository.save(
            documento
        );
    }

    @Transactional
    public void excluir(Long id) {
        if (
            !documentoRepository
                .existsById(id)
        ) {
            throw new IllegalArgumentException(
                "Documento não encontrado."
            );
        }

        documentoRepository.deleteById(
            id
        );
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

    private void validarTitulo(
        String titulo
    ) {
        if (
            titulo == null
            || titulo.trim().length() < 3
        ) {
            throw new RegraNegocioException(
                "O título deve possuir pelo menos 3 caracteres."
            );
        }

        if (
            titulo.trim().length() > 150
        ) {
            throw new RegraNegocioException(
                "O título deve possuir no máximo 150 caracteres."
            );
        }
    }

    private String normalizarTipo(
        String tipo
    ) {
        if (
            tipo == null
            || tipo.isBlank()
        ) {
            throw new RegraNegocioException(
                "Selecione o tipo do documento."
            );
        }

        String tipoNormalizado =
            tipo.trim()
                .toLowerCase(
                    Locale.ROOT
                );

        if (
            !TIPOS_VALIDOS.contains(
                tipoNormalizado
            )
        ) {
            throw new RegraNegocioException(
                "O tipo do documento é inválido."
            );
        }

        return tipoNormalizado;
    }

    private String normalizarEnviadoPor(
        String enviadoPor
    ) {
        if (
            enviadoPor == null
            || enviadoPor.isBlank()
        ) {
            return "Usuário do sistema";
        }

        String nome =
            enviadoPor.trim();

        if (nome.length() > 150) {
            return nome.substring(
                0,
                150
            );
        }

        return nome;
    }

    private void validarArquivo(
        MultipartFile arquivo,
        String tipo,
        boolean obrigatorio
    ) {
        if (
            arquivo == null
            || arquivo.isEmpty()
        ) {
            if (obrigatorio) {
                throw new RegraNegocioException(
                    "Selecione um arquivo."
                );
            }

            return;
        }

        if (
            arquivo.getSize()
                > TAMANHO_MAXIMO
        ) {
            throw new RegraNegocioException(
                "O arquivo deve possuir no máximo 10 MB."
            );
        }

        String nomeArquivo =
            arquivo.getOriginalFilename();

        if (
            nomeArquivo == null
            || nomeArquivo.isBlank()
        ) {
            throw new RegraNegocioException(
                "O arquivo selecionado não possui um nome válido."
            );
        }

        validarCompatibilidade(
            tipo,
            nomeArquivo
        );
    }

    private void validarCompatibilidade(
        String tipo,
        String nomeArquivo
    ) {
        String extensao =
            obterExtensao(nomeArquivo);

        boolean compativel =
            switch (tipo) {
                case "pdf" ->
                    "pdf".equals(extensao);

                case "planilha" ->
                    "xls".equals(extensao)
                    || "xlsx".equals(
                        extensao
                    );

                case "documento" ->
                    "doc".equals(extensao)
                    || "docx".equals(
                        extensao
                    );

                default -> false;
            };

        if (!compativel) {
            throw new RegraNegocioException(
                "O arquivo não corresponde ao tipo selecionado."
            );
        }
    }

    private String obterExtensao(
        String nomeArquivo
    ) {
        int ultimoPonto =
            nomeArquivo.lastIndexOf('.');

        if (
            ultimoPonto < 0
            || ultimoPonto
                == nomeArquivo.length() - 1
        ) {
            return "";
        }

        return nomeArquivo
            .substring(
                ultimoPonto + 1
            )
            .toLowerCase(
                Locale.ROOT
            );
    }

    private void preencherArquivo(
        Documento documento,
        MultipartFile arquivo
    ) {
        try {
            String nomeArquivo =
                arquivo.getOriginalFilename();

            String tipoConteudo =
                arquivo.getContentType();

            if (
                tipoConteudo == null
                || tipoConteudo.isBlank()
            ) {
                tipoConteudo =
                    "application/octet-stream";
            }

            documento.setNomeArquivo(
                nomeArquivo
            );

            documento.setTipoConteudo(
                tipoConteudo
            );

            documento.setTamanhoArquivo(
                arquivo.getSize()
            );

            documento.setDadosArquivo(
                arquivo.getBytes()
            );

        } catch (IOException erro) {
            throw new RegraNegocioException(
                "Não foi possível ler o arquivo selecionado."
            );
        }
    }
}
