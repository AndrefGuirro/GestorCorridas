const STORAGE_KEY = 'gestor-corridas-db';

export function carregarDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      veiculos: [],
      corridas: [],
      manutencoes: [],
      abastecimentos: []
    };
  }
  return JSON.parse(raw);
}

export function salvarDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}
