package br.com.solucoesengenharia.cfweb.exception;

public class RegraNegocioException
        extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}