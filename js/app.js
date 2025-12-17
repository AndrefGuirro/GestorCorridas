// app.js - usa idb-helper.js
// Certifique-se de ter carregado idb-helper.js antes deste arquivo no HTML.

const { VEICULOS, CORRIDAS, MANUT } = { VEICULOS: 'veiculos', CORRIDAS: 'corridas', MANUT: 'manutencoes' };

async function carregarVeiculosSelect() {
  const select = document.getElementById('selectVeiculo');
  if (!select) return;
  select.innerHTML = '';
  const veiculos = await db.getAll(VEICULOS) || [];

  const optTotal = document.createElement('option');
  optTotal.value = '__total__';
  optTotal.textContent = 'Total';
  select.appendChild(optTotal);

  veiculos.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = v.nome;
    select.appendChild(opt);
  });
}

async function salvarCorrida(event) {
  event.preventDefault();
  const kmInicial = Number(document.getElementById('kmInicial').value);
  const kmFinal = Number(document.getElementById('kmFinal').value);
  const valorGanho = Number(document.getElementById('valorGanho').value);
  const veiculo = document.getElementById('selectVeiculo').value;

  if (!Number.isFinite(kmInicial) || !Number.isFinite(kmFinal) || !Number.isFinite(valorGanho)) {
    alert('Preencha corretamente os valores de KM e Valor.');
    return;
  }
  if (kmFinal < kmInicial) {
    alert('KM Final não pode ser menor que KM Inicial.');
    return;
  }

  const corrida = {
    kmInicial, kmFinal, valorGanho, veiculo, data: new Date().toISOString()
  };
  await db.add(CORRIDAS, corrida);

  verificarProximidadeManutencao(kmFinal, veiculo);

  alert('Corrida salva!');
  document.getElementById('form-corrida').reset();
  atualizarDashboard();
}

async function atualizarDashboard() {
  const corridas = await db.getAll(CORRIDAS) || [];
  const veiculos = await db.getAll(VEICULOS) || [];
  const select = document.getElementById('selectVeiculo');
  const filtroVeiculo = select ? select.value : '__total__';

  const corridasFiltradas = filtroVeiculo === '__total__'
    ? corridas
    : corridas.filter(c => String(c.veiculo) === String(filtroVeiculo));

  const kmTotal = corridasFiltradas.reduce((acc, c) => acc + (Number(c.kmFinal) - Number(c.kmInicial)), 0);
  const ganhosTotal = corridasFiltradas.reduce((acc, c) => acc + Number(c.valorGanho), 0);

  let ganhoPorKmText = '';
  let mediaFinal = null;

  if (filtroVeiculo !== '__total__') {
    const v = veiculos.find(x => String(x.id) === String(filtroVeiculo));
    if (v) {
      let media = Number(v.media);

      // Se não houver média informada, tenta calcular usando abastecimentos
      if (!media || isNaN(media)) {
        const manutencoes = await db.getAll(MANUT) || [];
        const manutVeic = manutencoes.filter(m =>
          String(m.veiculo) === String(filtroVeiculo) &&
          m.litros && m.km
        );

        if (manutVeic.length > 1) {
          manutVeic.sort((a, b) => a.km - b.km);

          let totalKms = 0;
          let totalLitros = 0;
          for (let i = 1; i < manutVeic.length; i++) {
            totalKms += (manutVeic[i].km - manutVeic[i-1].km);
            totalLitros += Number(manutVeic[i].litros);
          }

          if (totalLitros > 0) {
            media = totalKms / totalLitros;
          }
        }
      }

      // Se agora a média for válida...
      if (media && !isNaN(media)) {
        mediaFinal = media.toFixed(2);
        const ganhoPorKm = ganhosTotal / (kmTotal || 1);
        ganhoPorKmText = `Ganho por km: R$ ${ganhoPorKm.toFixed(2)} | Média consumo: ${mediaFinal} km/l`;
      } else {
        ganhoPorKmText = 'Média de consumo não informada (nenhum dado suficiente).';
      }
    }
  }

  let proximaManutText = '';
  if (filtroVeiculo !== '__total__') {
    const manutencoes = await db.getAll(MANUT) || [];
    const manutVeic = manutencoes.filter(m =>
      String(m.veiculo) === String(filtroVeiculo) && m.proximo
    );

    if (manutVeic.length > 0) {
      const proximo = Math.min(...manutVeic.map(m => Number(m.proximo)));
      proximaManutText = `Próxima manutenção: ${proximo} km`;
    }
  }

  document.getElementById('dashboard').innerHTML = `
    <div class="card card-dark p-3 mb-3">
      <h4>Total Rodado: ${kmTotal} km</h4>
      <h4>Ganhos: R$ ${ganhosTotal.toFixed(2)}</h4>
      ${ganhoPorKmText ? `<p>${ganhoPorKmText}</p>` : ''}
      ${proximaManutText ? `<p>${proximaManutText}</p>` : ''}
    </div>
  `;
}

async function verificarProximidadeManutencao(kmAtual, veiculoId) {
  const manutencoes = await db.getAll(MANUT) || [];
  let lista = manutencoes;

  if (veiculoId && veiculoId !== '__total__') {
    lista = manutencoes.filter(m => String(m.veiculo) === String(veiculoId));
  }

  const proximos = lista.filter(m =>
    m.proximo &&
    Math.abs(Number(m.proximo) - Number(kmAtual)) <= 80
  );

  if (proximos.length > 0) {
    proximos.forEach(p => {
      console.warn(`Atenção: serviço "${p.servico}" programado para ${p.proximo} km está próximo (${kmAtual} km).`);
    });
    alert('Atenção: Existe manutenção próxima para este veículo.');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form-corrida');
  if (form) form.addEventListener('submit', salvarCorrida);

  await carregarVeiculosSelect();

  const select = document.getElementById('selectVeiculo');
  if (select) select.addEventListener('change', atualizarDashboard);

  atualizarDashboard();
});
