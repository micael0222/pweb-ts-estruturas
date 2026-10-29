// Exercício 02: Conta de luz
const campoConsumo = document.getElementById('consumo');
const campoTipo = document.getElementById('tipo');
const campoBandeira = document.getElementById('bandeira');
const botao = document.getElementById('calcular');
const saida = document.getElementById('resultado');
// Cases agrupados: dois case seguidos dividem o mesmo bloco (sem break entre eles)
function tarifaPorKwh(tipo) {
    switch (tipo) {
        case 'residencial':
        case 'rural':
            return 0.8;
        case 'comercial':
        case 'industrial':
            return 0.95;
    }
}
// Se a bandeira não for informada, assume 'verde'
function adicionalBandeira(consumo, bandeira = 'verde') {
    switch (bandeira) {
        case 'verde':
            return 0;
        case 'amarela':
            return consumo * 0.02;
        case 'vermelha1':
            return consumo * 0.04;
        case 'vermelha2':
            return consumo * 0.08;
    }
}
// As duas bandeiras vermelhas compartilham a mesma mensagem
function mensagemBandeira(bandeira) {
    switch (bandeira) {
        case 'verde':
            return 'Condições favoráveis de geração de energia.';
        case 'amarela':
            return 'Condições de geração menos favoráveis.';
        case 'vermelha1':
        case 'vermelha2':
            return 'Condições mais caras de geração. Economize!';
        default:
            return '';
    }
}
// Nome da bandeira para exibir no resultado
function nomeBandeira(bandeira) {
    switch (bandeira) {
        case 'verde':
            return 'verde';
        case 'amarela':
            return 'amarela';
        case 'vermelha1':
            return 'vermelha patamar 1';
        case 'vermelha2':
            return 'vermelha patamar 2';
    }
}
// Teste do parâmetro padrão: sem a bandeira, o valor padrão 'verde' é usado,
// então o adicional é 0 (verde não cobra nada a mais).
console.log(adicionalBandeira(100)); // 0
botao.addEventListener('click', () => {
    const consumo = campoConsumo.valueAsNumber;
    if (!(consumo > 0)) {
        saida.textContent = 'Informe um consumo válido';
        saida.className = 'erro';
        return;
    }
    const tipo = campoTipo.value;
    const bandeira = campoBandeira.value;
    const energia = consumo * tarifaPorKwh(tipo);
    const adicional = adicionalBandeira(consumo, bandeira);
    const total = energia + adicional;
    saida.textContent =
        `Energia: R$ ${energia.toFixed(2)}\n` +
            `Bandeira ${nomeBandeira(bandeira)}: R$ ${adicional.toFixed(2)}\n` +
            `Total: R$ ${total.toFixed(2)}\n` +
            mensagemBandeira(bandeira);
    saida.className = bandeira !== 'verde' ? 'alerta' : '';
});
export {};
//# sourceMappingURL=ex02.js.map