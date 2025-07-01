
export function validateLancamentoForm(
  produtoId: string,
  sacoleiraId: string,
  tipo: string,
  quantidade: string
) {
  console.log("=== VALIDAÇÃO DO FORMULÁRIO ===")
  console.log("Produto ID:", produtoId)
  console.log("Sacoleira ID:", sacoleiraId)
  console.log("Tipo:", tipo)
  console.log("Quantidade:", quantidade)
  
  const quantidadeNum = parseInt(quantidade)
  console.log("Quantidade numérica:", quantidadeNum)
  
  const isValid = produtoId && sacoleiraId && tipo && quantidade && quantidadeNum > 0
  console.log("Formulário válido:", isValid)
  
  return {
    isValid,
    quantidadeNum
  }
}
