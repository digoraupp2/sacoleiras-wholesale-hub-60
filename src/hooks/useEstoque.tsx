
import { useMemo } from "react"

interface Movimentacao {
  id: number
  produto: string
  sacoleira: string
  tipo: "entrega" | "devolucao"
  quantidade: number
  data: string
}

interface Produto {
  id: string
  nome: string
  categoria: string
  precoVenda: number
}

export function useEstoque(
  movimentacoes: Movimentacao[],
  mockProdutos: Produto[],
  searchTerm: string,
  filtroCategoria: string,
  filtroSacoleira: string
) {
  const estoqueAtual = useMemo(() => {
    const estoque: { [key: string]: { [produto: string]: number } } = {}
    
    movimentacoes.forEach(mov => {
      if (!estoque[mov.sacoleira]) {
        estoque[mov.sacoleira] = {}
      }
      
      if (!estoque[mov.sacoleira][mov.produto]) {
        estoque[mov.sacoleira][mov.produto] = 0
      }
      
      if (mov.tipo === "entrega") {
        estoque[mov.sacoleira][mov.produto] += mov.quantidade
      } else {
        estoque[mov.sacoleira][mov.produto] -= mov.quantidade
      }
    })
    
    return estoque
  }, [movimentacoes])

  const estoqueFiltered = useMemo(() => {
    return Object.entries(estoqueAtual).filter(([sacoleira, produtos]) => {
      if (filtroSacoleira && sacoleira !== filtroSacoleira) return false
      
      const produtosSacoleira = Object.entries(produtos).filter(([produto, quantidade]) => {
        if (quantidade <= 0) return false
        if (searchTerm && !produto.toLowerCase().includes(searchTerm.toLowerCase())) return false
        
        const produtoInfo = mockProdutos.find(p => p.nome === produto)
        if (filtroCategoria && produtoInfo?.categoria !== filtroCategoria) return false
        
        return true
      })
      
      return produtosSacoleira.length > 0
    })
  }, [estoqueAtual, filtroSacoleira, searchTerm, filtroCategoria, mockProdutos])

  return { estoqueAtual, estoqueFiltered }
}
