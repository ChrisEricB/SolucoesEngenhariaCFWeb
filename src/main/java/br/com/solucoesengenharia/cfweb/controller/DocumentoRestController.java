package br.com.solucoesengenharia.cfweb.controller;

import br.com.solucoesengenharia.cfweb.model.Documento;
import br.com.solucoesengenharia.cfweb.service.DocumentoService;
import jakarta.servlet.http.HttpSession;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoRestController {

    private final DocumentoService
        documentoService;

    public DocumentoRestController(
        DocumentoService documentoService
    ) {
        this.documentoService =
            documentoService;
    }

    @GetMapping
    public List<Documento> listar(
        @RequestParam(
            required = false
        ) String termo
    ) {
        return documentoService.pesquisar(
            termo
        );
    }

    @GetMapping("/{id}")
    public Documento buscarPorId(
        @PathVariable Long id
    ) {
        return documentoService.buscarPorId(
            id
        );
    }

    @GetMapping("/{id}/arquivo")
    public ResponseEntity<byte[]>
        visualizarArquivo(
            @PathVariable Long id
        ) {
        Documento documento =
            documentoService.buscarPorId(
                id
            );

        MediaType tipoConteudo;

        try {
            tipoConteudo =
                MediaType.parseMediaType(
                    documento
                        .getTipoConteudo()
                );

        } catch (RuntimeException erro) {
            tipoConteudo =
                MediaType
                    .APPLICATION_OCTET_STREAM;
        }

        ContentDisposition disposicao =
            ContentDisposition
                .inline()
                .filename(
                    documento
                        .getNomeArquivo(),
                    StandardCharsets.UTF_8
                )
                .build();

        return ResponseEntity
            .ok()
            .contentType(tipoConteudo)
            .cacheControl(
                CacheControl.noStore()
            )
            .header(
                HttpHeaders
                    .CONTENT_DISPOSITION,
                disposicao.toString()
            )
            .contentLength(
                documento
                    .getTamanhoArquivo()
            )
            .body(
                documento.getDadosArquivo()
            );
    }

    @PostMapping(
        consumes =
            MediaType
                .MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public Documento criar(
        @RequestParam String titulo,

        @RequestParam
        Long idProjeto,

        @RequestParam
        String tipo,

        @RequestPart("arquivo")
        MultipartFile arquivo,

        HttpSession sessao
    ) {
        String enviadoPor =
            obterNomeUsuario(sessao);

        return documentoService.criar(
            titulo,
            idProjeto,
            tipo,
            arquivo,
            enviadoPor
        );
    }

    @PutMapping(
        value = "/{id}",
        consumes =
            MediaType
                .MULTIPART_FORM_DATA_VALUE
    )
    public Documento atualizar(
        @PathVariable Long id,

        @RequestParam String titulo,

        @RequestParam
        Long idProjeto,

        @RequestParam
        String tipo,

        @RequestPart(
            value = "arquivo",
            required = false
        )
        MultipartFile arquivo
    ) {
        return documentoService.atualizar(
            id,
            titulo,
            idProjeto,
            tipo,
            arquivo
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(
        HttpStatus.NO_CONTENT
    )
    public void excluir(
        @PathVariable Long id
    ) {
        documentoService.excluir(id);
    }

    private String obterNomeUsuario(
        HttpSession sessao
    ) {
        Object nome =
            sessao.getAttribute(
                "usuarioNome"
            );

        if (nome == null) {
            return "Usuário do sistema";
        }

        return String.valueOf(nome);
    }
}
