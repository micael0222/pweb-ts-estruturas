// Exercício 04: Meta de economia

const campoMeta = document.getElementById('meta') as HTMLInputElement;
const campoDeposito = document.getElementById('deposito') as HTMLInputElement;
const campoTaxa = document.getElementById('taxa') as HTMLInputElement;
const botao = document.getElementById('calcular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

const LIMITE_MESES = 600;

// Tipo de função: recebe um número e devolve um texto
type Formatador = (valor: number) => string;

const formatarReal: Formatador = (valor: number): string => `R$ ${valor.toFixed(2)}`;

// Ex.: 19 -> "1 ano e 7 meses", 25 -> "2 anos e 1 mês", 8 -> "8 meses"
const formatarMeses = (meses: number): string => {
  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const textoAnos = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  const textoMeses = `${resto} ${resto === 1 ? 'mês' : 'meses'}`;

  if (anos === 0) return textoMeses;
  if (resto === 0) return textoAnos;
  return `${textoAnos} e ${textoMeses}`;
};

interface Resultado {
  meses: number;
  saldo: number;
  depositado: number;
}

// A taxa tem valor padrão de 0,5% ao mês
function calcularMeses(meta: number, deposito: number, taxa: number = 0.5): Resultado {
  let saldo = 0;
  let meses = 0;
  let depositado = 0;

  while (saldo < meta) {
    // Meta não atingida em 50 anos: para o cálculo
    if (meses >= LIMITE_MESES) {
      break;
    }

    meses++;
    // Em todo mês 12, 24, 36... entra o 13º (depósito em dobro)
    const valor = meses % 12 === 0 ? deposito * 2 : deposito;
    // Primeiro o saldo rende, depois entra o depósito
    saldo = saldo * (1 + taxa / 100) + valor;
    depositado += valor;
  }

  return { meses, saldo, depositado };
}

// Monta uma linha "rótulo: valor" usando a função de formatação recebida
function exibirValor(rotulo: string, valor: number, formatar: Formatador): string {
  return `${rotulo}: ${formatar(valor)}`;
}

botao.addEventListener('click', () => {
  const meta = campoMeta.valueAsNumber;
  const deposito = campoDeposito.valueAsNumber;

  if (!(meta > 0) || !(deposito > 0)) {
    saida.textContent = 'Informe valores positivos';
    saida.className = 'erro';
    return;
  }

  // Rendimento vazio: chama sem o terceiro argumento para usar o padrão
  const r = campoTaxa.value === ''
    ? calcularMeses(meta, deposito)
    : calcularMeses(meta, deposito, campoTaxa.valueAsNumber);

  if (r.saldo < meta) {
    saida.textContent =
      'Meta inalcançável em 50 anos.\n' +
      exibirValor(`Saldo após ${LIMITE_MESES} meses`, r.saldo, formatarReal);
    saida.className = 'erro';
    return;
  }

  const detalhe = r.meses >= 12 ? ` (${formatarMeses(r.meses)})` : '';
  saida.textContent =
    `Você atinge a meta em ${r.meses} ${r.meses === 1 ? 'mês' : 'meses'}${detalhe}.\n` +
    exibirValor('Saldo final', r.saldo, formatarReal) + '\n' +
    exibirValor('Total depositado', r.depositado, formatarReal) + '\n' +
    exibirValor('Rendimento', r.saldo - r.depositado, formatarReal);
  saida.className = 'sucesso';
});
