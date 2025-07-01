
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface Produto {
  id: string
  nome: string
  categoria: string
  precoCusto: number
  precoVenda: number
  estoque: number
  status: string
  foto: string
}

export function useProdutosData() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchProdutos = async () => {
    try {
      setLoading(true)
      console.log("Buscando produtos...")
      
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          preco_base,
          estoque_minimo,
          categorias (
            nome
          )
        `)
        .order('nome')
      
      if (error) {
        console.error('Erro ao buscar produtos:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos.",
          variant: "destructive"
        })
        return
      }
      
      console.log("Produtos encontrados:", data?.length || 0)
      
      // Transformar dados para o formato esperado
      const produtosFormatados = data?.map(produto => ({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categorias?.nome || 'Sem categoria',
        precoCusto: 0, // Não temos preço de custo no banco atual
        precoVenda: produto.preco_base,
        estoque: produto.estoque_minimo || 0,
        status: "ativo",
        foto: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop"
      })) || []
      
      setProdutos(produtosFormatados)
    } catch (error) {
      console.error('Erro inesperado ao buscar produtos:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar produtos.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteProduto = async (produtoId: string) => {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', produtoId)
      
      if (error) {
        console.error('Erro ao excluir produto:', error)
        toast({
          title: "Erro",
          description: "Não foi possível excluir o produto.",
          variant: "destructive"
        })
        return false
      }
      
      setProdutos(prev => prev.filter(p => p.id !== produtoId))
      return true
    } catch (error) {
      console.error('Erro inesperado ao excluir produto:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir produto.",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  return {
    produtos,
    loading,
    fetchProdutos,
    deleteProduto
  }
}
