package br.com.solucoesengenharia.cfweb.controller;

import br.com.solucoesengenharia.cfweb.exception.RegraNegocioException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(
        MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, Object>>
            tratarErroDeValidacao(
                MethodArgumentNotValidException excecao
            ) {

        Map<String, String> campos =
            new LinkedHashMap<>();

        for (
            FieldError erro
            : excecao.getBindingResult()
                .getFieldErrors()
        ) {
            campos.putIfAbsent(
                erro.getField(),
                erro.getDefaultMessage()
            );
        }

        Map<String, Object> resposta =
            new LinkedHashMap<>();

        resposta.put(
            "dataHora",
            LocalDateTime.now()
        );

        resposta.put(
            "status",
            HttpStatus.BAD_REQUEST.value()
        );

        resposta.put(
            "erro",
            "Dados inválidos."
        );

        resposta.put(
            "campos",
            campos
        );

        return ResponseEntity
            .badRequest()
            .body(resposta);
    }

    @ExceptionHandler(
        RegraNegocioException.class
    )
    public ResponseEntity<Map<String, Object>>
            tratarRegraDeNegocio(
                RegraNegocioException excecao
            ) {

        Map<String, Object> resposta =
            new LinkedHashMap<>();

        resposta.put(
            "dataHora",
            LocalDateTime.now()
        );

        resposta.put(
            "status",
            HttpStatus.BAD_REQUEST.value()
        );

        resposta.put(
            "erro",
            excecao.getMessage()
        );

        return ResponseEntity
            .badRequest()
            .body(resposta);
    }

    @ExceptionHandler(
        IllegalArgumentException.class
    )
    public ResponseEntity<Map<String, Object>>
            tratarRegistroNaoEncontrado(
                IllegalArgumentException excecao
            ) {

        Map<String, Object> resposta =
            new LinkedHashMap<>();

        resposta.put(
            "dataHora",
            LocalDateTime.now()
        );

        resposta.put(
            "status",
            HttpStatus.NOT_FOUND.value()
        );

        resposta.put(
            "erro",
            excecao.getMessage()
        );

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(resposta);
    }
}