import { cadastrarVeiculo, obterVeiculos } from "./veiculosUI.js";

const form = document.getElementById("formVeiculo");
const lista = document.getElementById("listaVeiculos");

function renderizar() {
  lista.innerHTML = "";

  const veiculos = obterVeiculos();

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

  cadastrarVeiculo({ nome, combustivel });

  form.reset();
  renderizar();
});

// render inicial
renderizar();
