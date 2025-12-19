console.log("Controller carregado com sucesso");


import { criarVeiculo } from "../core/veiculo.js";
import { salvarVeiculo, listarVeiculos } from "../data/veiculoRepo.js";


const form = document.getElementById("formVeiculo");
const lista = document.getElementById("listaVeiculos");

function renderizar() {
  lista.innerHTML = "";

  const veiculos = listarVeiculos();

  veiculos.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `${v.nome} - ${v.combustivel}`;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const combustivel = document.getElementById("combustivel").value;

  try {
    const veiculo = criarVeiculo({ nome, combustivel });
    salvarVeiculo(veiculo);
    form.reset();
    renderizar();
  } catch (e) {
    alert(e.message);
  }
});

// render inicial
renderizar();
