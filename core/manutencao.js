// core/manutencao.js

export function criarManutencao({
  id,
  veiculoId,
  tipo,
  valor,
  kmReferencia,
  intervaloKm
}) {
  if (!tipo) throw new Error('Tipo de manutenção obrigatório');
  if (valor <= 0) throw new Error('Valor inválido');

  return {
    id: id ?? crypto.randomUUID(),
    veiculoId,
    tipo,
    valor,
    kmReferencia,
    intervaloKm,
    status: 'pendente',
    dataUltima: new Date()
  };
}

export function verificarManutencao(manutencao, kmAtual) {
  if (!manutencao.intervaloKm) return manutencao;

  const kmLimite = manutencao.kmReferencia + manutencao.intervaloKm;

  return {
    ...manutencao,
    status: kmAtual >= kmLimite ? 'pendente' : 'ok'
  };
}
