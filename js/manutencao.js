// manutencao.js
const STORE_MANUT = 'manutencoes';
const STORE_VEIC = 'veiculos';

async function carregarVeiculosSelectManut() {
  const sel = document.getElementById('manutVeiculo');
  if (!sel) return;
  sel.innerHTML = '';
  const veics = await db.getAll(STORE_VEIC) || [];
  veics.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = v.nome;
    sel.appendChild(opt);
  });
}

async function salvarManutencao(event) {
  event.preventDefault();
  const veiculo = document.getElementById('manutVeiculo').value;
  const km = Number(document.getElementById('manutKm').value);
  const servico = document.getElementById('manutServico').value;
  const proximo = Number(document.getElementById('manutProximo').value);
  const valor = Number(document.getElementById('abastValor').value);
  const litros = Number(document.getElementById('abastLitros').value);

  const registro = { veiculo, km, servico, proximo, valor, litros, data: new Date().toISOString() };
  await db.add(STORE_MANUT, registro);

  // se houver litros e km, podemos tentar recalcular média e atualizar veículo se média não informada:
  if (litros && km) {
    // lógica simples: se veículo não tem média, tenta calcular média com históricos (ou podemos atualizar campo média)
    const veic = await db.get(STORE_VEIC, Number(veiculo));
    if (veic && (!veic.media || veic.media === '')) {
      // calcular média aproximada a partir dos abastecimentos (feito por app.js também), aqui apenas aviso
      // but we won't automatically overwrite the user-entered média without confirmation
    }
  }

  alert('Manutenção/Abastecimento salvo.');
  document.getElementById('form-manutencao').reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-manutencao');
  if (form) form.addEventListener('submit', salvarManutencao);
  carregarVeiculosSelectManut();
});
