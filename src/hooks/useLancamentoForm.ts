
import { useState } from "react"
import { Produto, Sacoleira } from "@/types/lancamento"

export function useLancamentoForm() {
  const [produtoId, setProdutoId] = useState("")
  const [sacoleiraId, setSacoleiraId] = useState("")
  const [tipo, setTipo] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setProdutoId("")
    setSacoleiraId("")
    setTipo("")
    setQuantidade("")
    setObservacoes("")
  }

  const getFormData = (produtoSelecionado: Produto, sacoleiraSelecionada: Sacoleira) => {
    const quantidadeNum = parseInt(quantidade)
    
    console.log("=== DADOS DO FORMULÁRIO ===")
    console.log("Produto selecionado:", produtoSelecionado)
    console.log("Sacoleira selecionada:", sacoleiraSelecionada)
    console.log("Tipo:", tipo)
    console.log("Quantidade:", quantidadeNum)
    console.log("Observações:", observacoes)
    
    const formData = {
      produto_id: produtoSelecionado.id,
      produto: produtoSelecionado.nome,
      sacoleira_id: sacoleiraSelecionada.id,
      sacoleira: sacoleiraSelecionada.nome,
      tipo: tipo,
      quantidade: quantidadeNum,
      valor_unitario: produtoSelecionado.preco_base,
      valor_total: produtoSelecionado.preco_base * quantidadeNum,
      observacoes: observacoes.trim(),
      data_lancamento: new Date().toISOString(),
      categoria: produtoSelecionado.categoria
    }
    
    console.log("Dados do formulário preparados:", formData)
    return formData
  }

  return {
    produtoId,
    setProdutoId,
    sacoleiraId,
    setSacoleiraId,
    tipo,
    setTipo,
    quantidade,
    setQuantidade,
    observacoes,
    setObservacoes,
    loading,
    setLoading,
    resetForm,
    getFormData
  }
}
