
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
  
  // Verificar se o tipo é válido
  const tiposValidos = ['entrega', 'devolucao']
  const tipoValido = tiposValidos.includes(tipo)
  console.log("Tipo válido:", tipoValido)
  console.log("Tipos aceitos:", tiposValidos)
  
  const isValid = produtoId && sacoleiraId && tipoValido && quantidade && quantidadeNum > 0
  console.log("Formulário válido:", isValid)
  
  return {
    isValid,
    quantidadeNum
  }
}
