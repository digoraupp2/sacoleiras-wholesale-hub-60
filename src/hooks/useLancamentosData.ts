
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Lancamento, Produto, Sacoleira } from "@/types/lancamento"

export function useLancamentosData() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [sacoleiras, setSacoleiras] = useState<Sacoleira[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Buscar produtos
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          preco_base,
          categorias (nome)
        `)
        .order('nome')

      if (produtosError) {
        console.error('Erro ao buscar produtos:', produtosError)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos.",
          variant: "destructive"
        })
      } else {
        const produtosFormatados = produtosData?.map(produto => ({
          id: produto.id,
          nome: produto.nome,
          preco_base: produto.preco_base,
          categoria: produto.categorias?.nome || 'Sem categoria'
        })) || []
        setProdutos(produtosFormatados)
      }

      // Buscar sacoleiras
      const { data: sacoleirasData, error: sacoleirasError } = await supabase
        .from('sacoleiras')
        .select('id, nome')
        .order('nome')

      if (sacoleirasError) {
        console.error('Erro ao buscar sacoleiras:', sacoleirasError)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as sacoleiras.",
          variant: "destructive"
        })
      } else {
        console.log('Sacoleiras carregadas:', sacoleirasData?.length || 0)
        setSacoleiras(sacoleirasData || [])
      }

    } catch (error) {
      console.error('Erro inesperado ao carregar dados:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dados.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLancamentos = async () => {
    try {
      console.log("Buscando lançamentos do banco de dados...")
      
      const { data, error } = await supabase
        .from('lancamentos')
        .select(`
          id,
          tipo,
          quantidade,
          valor_unitario,
          valor_total,
          observacoes,
          data_lancamento,
          produtos (
            id,
            nome,
            categorias (nome)
          ),
          sacoleiras (
            id,
            nome
          )
        `)
        .order('data_lancamento', { ascending: false })

      if (error) {
        console.error('Erro ao buscar lançamentos:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os lançamentos.",
          variant: "destructive"
        })
        return []
      }

      console.log("Lançamentos encontrados:", data?.length || 0)
      
      // Transformar dados para o formato esperado
      const lancamentosFormatados = data?.map(lancamento => ({
        id: lancamento.id,
        produto: lancamento.produtos?.nome || 'Produto não encontrado',
        produto_id: lancamento.produtos?.id || '',
        valor: lancamento.valor_unitario,
        quantidade: lancamento.quantidade,
        categoria: lancamento.produtos?.categorias?.nome || 'Sem categoria',
        sacoleira: lancamento.sacoleiras?.nome || 'Sacoleira não encontrada',
        sacoleira_id: lancamento.sacoleiras?.id || '',
        data: lancamento.data_lancamento, // Manter a data completa com hora
        total: lancamento.valor_total,
        observacoes: lancamento.observacoes || '',
        tipo: lancamento.tipo
      })) || []
      
      return lancamentosFormatados
    } catch (error) {
      console.error('Erro inesperado ao buscar lançamentos:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar lançamentos.",
        variant: "destructive"
      })
      return []
    }
  }

  return {
    produtos,
    sacoleiras,
    loading,
    fetchLancamentos
  }
}
