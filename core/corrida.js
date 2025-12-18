// core/corrida.js

export function validarKm(kmInicial, kmFinal) {
  if (kmInicial == null) throw new Error('KM inicial obrigatório');
  if (kmFinal == null) throw new Error('KM final obrigatório');
  if (kmFinal <= kmInicial) throw new Error('KM final deve ser maior que o inicial');
}

export function calcularDistancia(kmInicial, kmFinal) {
  validarKm(kmInicial, kmFinal);
  return kmFinal - kmInicial;
}

export function criarCorrida({
  id,
  veiculoId,
  kmInicial,
  kmFinal,
  valor,
  data = new Date()
}) {
  const distancia = calcularDistancia(kmInicial, kmFinal);

  if (valor <= 0) throw new Error('Valor inválido');

  return {
    id: id ?? crypto.randomUUID(),
    veiculoId,
    kmInicial,
    kmFinal,
    distancia,
    valor,
    data
  };
}
