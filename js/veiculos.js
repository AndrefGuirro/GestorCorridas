// veiculos.js - CRUD com IndexedDB (usa idb-helper.js)
const STORE_VEIC = 'veiculos';

async function renderVeiculos() {
  const area = document.getElementById('listaVeiculos');
  if (!area) return;
  const veiculos = await db.getAll(STORE_VEIC) || [];
  area.innerHTML = '';
  veiculos.forEach(v => {
    const div = document.createElement('div');
    div.className = 'card card-dark p-3 mb-2';
    div.innerHTML = `
      <h5>${v.nome}</h5>
      <p>Média: ${v.media ?? 'Não informada'}</p>
      <button class="btn btn-warning btn-sm me-2" data-id="${v.id}" onclick="editarVeiculo(${v.id})">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="excluirVeiculo(${v.id})">Excluir</button>
    `;
    area.appendChild(div);
  });
}

async function novoVeiculo() {
  const nome = prompt('Nome do veículo:');
  if (!nome) return;
  const media = prompt('Média km/l (opcional):');
  await db.add(STORE_VEIC, { nome, media: media || null });
  renderVeiculos();
  // atualizar selects em index
  if (window.opener) window.opener.location.reload();
}

async function editarVeiculo(id) {
  const v = await db.get(STORE_VEIC, id);
  if (!v) return alert('Veículo não encontrado');
  const novoNome = prompt('Nome do veículo:', v.nome);
  if (!novoNome) return;
  const novaMedia = prompt('Média km/l (opcional):', v.media || '');
  v.nome = novoNome;
  v.media = novaMedia || null;
  await db.put(STORE_VEIC, v);
  renderVeiculos();
}

async function excluirVeiculo(id) {
  if (!confirm('Deseja realmente excluir este veículo?')) return;
  await db.delete(STORE_VEIC, id);
  renderVeiculos();
}

document.addEventListener('DOMContentLoaded', renderVeiculos);
