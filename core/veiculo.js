// core/veiculo.js

export function criarVeiculo({
  id,
  nome,
  combustivel,
  mediaConsumo = null
}) {
  if (!nome) throw new Error('Nome do veículo é obrigatório');

  if (!['Gasolina', 'Etanol'].includes(combustivel)) {
    throw new Error('Combustível inválido');
  }

  return {
    id: id ?? crypto.randomUUID(),
    nome,
    combustivel,
    mediaConsumo,
    kmAtual: 0,
    ativo: false
  };
}

export function ativarVeiculo(veiculos, idVeiculo) {
  return veiculos.map(v => ({
    ...v,
    ativo: v.id === idVeiculo
  }));
}
