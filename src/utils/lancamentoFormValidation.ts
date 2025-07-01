
export function validateLancamentoForm(
  produtoId: string,
  sacoleiraId: string,
  tipo: string,
  quantidade: string
) {
  const quantidadeNum = parseInt(quantidade)
  
  return {
    isValid: produtoId && sacoleiraId && tipo && quantidade && quantidadeNum > 0,
    quantidadeNum
  }
}
