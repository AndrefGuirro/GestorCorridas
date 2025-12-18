import { criarVeiculo } from "../core/index.js";
import { salvarVeiculo, listarVeiculos } from "../data/veiculoRepo.js";

export function cadastrarVeiculo(dados) {
    const veiculo = criarVeiculo(dados);
    salvarVeiculo(veiculo);
    return veiculo;
}

export function obterVeiculos() {
    return listarVeiculos();
}
