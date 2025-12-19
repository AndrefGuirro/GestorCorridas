const PREFIXO = "gestorCorridas:";

export function salvar(chave, valor) {
  localStorage.setItem(
    PREFIXO + chave,
    JSON.stringify(valor)
  );
}

export function carregar(chave) {
  const dado = localStorage.getItem(PREFIXO + chave);
  return dado ? JSON.parse(dado) : null;
}

export function remover(chave) {
  localStorage.removeItem(PREFIXO + chave);
}
