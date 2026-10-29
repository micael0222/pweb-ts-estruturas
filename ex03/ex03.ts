// Exercício 03: Simulador de parcelamento

const campoPreco = document.getElementById('preco') as HTMLInputElement;
const campoEntrada = document.getElementById('entrada') as HTMLInputElement;
const botao = document.getElementById('simular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;
const corpoTabela = document.getElementById('parcelas') as HTMLElement;

const PARCELA_MINIMA = 50;
const SEM_OFERTA = [7, 8, 9, 11];

// Até 3 parcelas: sem juros. De 4 em diante: juros compostos de 2% ao mês.
function calcularTotal(valor: number, parcelas: number): number {
  return parcelas <= 3 ? valor : valor * 1.02 ** parcelas;
}

// Devolve as linhas <tr> da tabela. A entrada é opcional.
function simularParcelamento(preco: number, entrada?: number): string {
  const financiado = typeof entrada !== 'undefined' ? preco - entrada : preco;
  let linhas = '';

  for (let parcelas = 1; parcelas <= 12; parcelas++) {
    // A loja não oferece 7, 8, 9 e 11 parcelas: pula para a próxima
    if (SEM_OFERTA.includes(parcelas)) {
      continue;
    }

    const total = calcularTotal(financiado, parcelas);
    const valorParcela = total / parcelas;

    // Parcela abaixo do mínimo: as opções acabam
    if (valorParcela < PARCELA_MINIMA) {
      break;
    }

    const juros = parcelas <= 3 ? 'sem juros' : '2% a.m.';
    linhas +=
      `<tr><td>${parcelas}x</td><td>R$ ${valorParcela.toFixed(2)}</td>` +
      `<td>R$ ${total.toFixed(2)}</td><td>${juros}</td></tr>`;
  }

  return linhas;
}

botao.addEventListener('click', () => {
  const preco = campoPreco.valueAsNumber;

  if (!(preco > 0)) {
    saida.textContent = 'Informe um preço válido';
    saida.className = 'erro';
    corpoTabela.innerHTML = '';
    return;
  }

  // Campo vazio: chama sem o segundo argumento (parâmetro opcional)
  if (campoEntrada.value === '') {
    saida.textContent = `Valor financiado: R$ ${preco.toFixed(2)}`;
    saida.className = '';
    corpoTabela.innerHTML = simularParcelamento(preco);
    return;
  }

  const entrada = campoEntrada.valueAsNumber;

  if (entrada < 0) {
    saida.textContent = 'Informe uma entrada válida';
    saida.className = 'erro';
    corpoTabela.innerHTML = '';
    return;
  }

  if (entrada >= preco) {
    saida.textContent = 'A entrada cobre o valor total. Não há parcelas.';
    saida.className = 'sucesso';
    corpoTabela.innerHTML = '';
    return;
  }

  saida.textContent = `Valor financiado: R$ ${(preco - entrada).toFixed(2)}`;
  saida.className = '';
  corpoTabela.innerHTML = simularParcelamento(preco, entrada);
});
