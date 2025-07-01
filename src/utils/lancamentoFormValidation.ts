
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
  
  const errors: string[] = []
  
  // Validar produto
  if (!produtoId || produtoId.trim() === '') {
    errors.push('Produto deve ser selecionado')
  }
  
  // Validar sacoleira
  if (!sacoleiraId || sacoleiraId.trim() === '') {
    errors.push('Sacoleira deve ser selecionada')
  }
  
  // Validar tipo
  const tiposValidos = ['entrega', 'devolucao']
  if (!tipo || !tiposValidos.includes(tipo)) {
    errors.push('Tipo deve ser "entrega" ou "devolução"')
  }
  
  // Validar quantidade
  const quantidadeNum = parseInt(quantidade)
  if (!quantidade || isNaN(quantidadeNum) || quantidadeNum <= 0) {
    errors.push('Quantidade deve ser um número maior que zero')
  }
  
  console.log("Quantidade numérica:", quantidadeNum)
  console.log("Tipo válido:", tiposValidos.includes(tipo))
  console.log("Tipos aceitos:", tiposValidos)
  console.log("Erros encontrados:", errors)
  
  const isValid = errors.length === 0
  console.log("Formulário válido:", isValid)
  
  return {
    isValid,
    quantidadeNum: isNaN(quantidadeNum) ? 0 : quantidadeNum,
    errors
  }
}
