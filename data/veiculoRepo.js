import { carregarDB, salvarDB } from './storage.js';

export function salvarVeiculo(veiculo) {
  const db = carregarDB();
  db.veiculos.push(veiculo);
  salvarDB(db);
}

export function listarVeiculos() {
  const db = carregarDB();
  return db.veiculos;
}

export function buscarVeiculoPorId(id) {
  const db = carregarDB();
  return db.veiculos.find(v => v.id === id);
}
