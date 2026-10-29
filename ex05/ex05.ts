// Exercício 05: Caixa do mercado (projeto integrador)

const campoItens = document.getElementById('itens') as HTMLTextAreaElement;
const campoCupom = document.getElementById('cupom') as HTMLInputElement;
const campoFidelidade = document.getElementById('fidelidade') as HTMLInputElement;
const botao = document.getElementById('fechar') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

const MAX_ITENS = 20;

type Formatador = (valor: number) => string;
const formatarReal: Formatador = (valor: number): string => `R$ ${valor.toFixed(2)}`;

// Lê um preço por linha. Aceita ponto ou vírgula. Conta as linhas inválidas.
function lerPrecos(texto: string): { precos: number[]; ignorados: number } {
  const linhas = texto.split('\n');
  const precos: number[] = [];
  let ignorados = 0;

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();

    // Linha vazia: ignora sem contar
    if (linha === '') {
      continue;
    }

    // Chegou a 20 itens: os seguintes são desconsiderados
    if (precos.length === MAX_ITENS) {
      break;
    }

    const valor = Number(linha.replace(',', '.'));

    // Linha inválida: ignora, mas conta
    if (Number.isNaN(valor) || valor <= 0) {
      ignorados++;
      continue;
    }

    precos.push(valor);
  }

  return { precos, ignorados };
}

// Parâmetro rest: recebe qualquer quantidade de preços
function somarItens(...precos: number[]): number {
  let soma = 0;
  for (const p of precos) {
    soma += p;
  }
  return soma;
}

// Sobrecarga: percentual (number) ou código de cupom (string)
function calcularDesconto(total: number, percentual: number): number;
function calcularDesconto(total: number, cupom: string): number;
function calcularDesconto(total: number, tipo: number | string): number {
  if (typeof tipo === 'number') {
    return (total * tipo) / 100;
  }

  switch (tipo.toUpperCase()) {
    case 'BEMVINDO':
      return calcularDesconto(total, 10);
    case 'PROMO20':
      return calcularDesconto(total, 20);
    case 'MENOS15':
      return total >= 100 ? 15 : 0;
    default:
      return 0;
  }
}

botao.addEventListener('click', () => {
  const { precos, ignorados } = lerPrecos(campoItens.value);

  if (precos.length === 0) {
    saida.textContent = 'Nenhum item válido';
    saida.className = 'erro';
    return;
  }

  const subtotal = somarItens(...precos); // spread
  const cupom = campoCupom.value.trim();
  const descontoCupom = cupom !== '' ? calcularDesconto(subtotal, cupom) : 0;
  const aposCupom = subtotal - descontoCupom;
  const descontoFidelidade = campoFidelidade.checked ? calcularDesconto(aposCupom, 5) : 0;
  const total = aposCupom - descontoFidelidade;

  let texto = `Itens: ${precos.length}`;
  if (ignorados > 0) {
    texto += ` (${ignorados} ${ignorados === 1 ? 'linha ignorada' : 'linhas ignoradas'})`;
  }
  texto += `\nSubtotal: ${formatarReal(subtotal)}`;

  if (cupom !== '') {
    texto += descontoCupom > 0
      ? `\nCupom ${cupom.toUpperCase()}: - ${formatarReal(descontoCupom)}`
      : '\nCupom inválido ou não aplicável';
  }
  if (campoFidelidade.checked) {
    texto += `\nFidelidade (5%): - ${formatarReal(descontoFidelidade)}`;
  }
  texto += `\nTotal a pagar: ${formatarReal(total)}`;

  saida.textContent = texto;
  saida.className = 'sucesso';
});
