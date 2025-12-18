// core/relatorio.js

export function somarValores(lista, campo) {
  return lista.reduce((total, item) => total + (item[campo] || 0), 0);
}

export function totalPorVeiculo(lista, veiculoId, campo) {
  return somarValores(
    lista.filter(item => item.veiculoId === veiculoId),
    campo
  );
}

export function filtrarPorPeriodo(lista, inicio, fim) {
  return lista.filter(item => {
    const data = new Date(item.data);
    return data >= inicio && data <= fim;
  });
}
