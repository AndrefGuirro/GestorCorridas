import { carregar, salvar } from "./storage.js";

const CHAVE = "veiculos";

/**
 * Salva um novo veículo no storage
 */
export function salvarVeiculo(veiculo) {
  const veiculos = carregar(CHAVE) || [];
  veiculos.push(veiculo);
  salvar(CHAVE, veiculos);
}

/**
 * Lista todos os veículos salvos
 */
export function listarVeiculos() {
  return carregar(CHAVE) || [];
}

/**
 * Busca um veículo pelo ID
 */
export function buscarVeiculoPorId(id) {
  const veiculos = carregar(CHAVE) || [];
  return veiculos.find(v => v.id === id);
}
