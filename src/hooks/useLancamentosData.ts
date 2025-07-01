
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
  const { userProfile, isAdmin } = useAuth()

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log("=== BUSCANDO DADOS PARA LANÇAMENTOS ===")
      console.log("User profile:", userProfile?.id)
      console.log("Is Admin:", isAdmin)
      
      // Buscar produtos
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          preco_base,
          categoria_id,
          categorias(nome)
        `)
        .order('nome')

      if (produtosError) {
        console.error('Erro ao buscar produtos:', produtosError)
        // Fallback sem join
        const { data: produtosFallback, error: produtosFallbackError } = await supabase
          .from('produtos')
          .select('id, nome, preco_base')
          .order('nome')

        if (produtosFallbackError) {
          console.error('Erro no fallback de produtos:', produtosFallbackError)
          toast({
            title: "Erro",
            description: "Não foi possível carregar os produtos.",
            variant: "destructive"
          })
        } else {
          const produtosFormatados = (produtosFallback || []).map(produto => ({
            id: produto.id,
            nome: produto.nome,
            preco_base: produto.preco_base,
            categoria: 'Sem categoria'
          }))
          console.log("Produtos carregados (fallback):", produtosFormatados.length)
          setProdutos(produtosFormatados)
        }
      } else {
        const produtosFormatados = (produtosData || []).map(produto => ({
          id: produto.id,
          nome: produto.nome,
          preco_base: produto.preco_base,
          categoria: produto.categorias?.nome || 'Sem categoria'
        }))
        console.log("Produtos carregados:", produtosFormatados.length)
        setProdutos(produtosFormatados)
      }

      // Buscar sacoleiras - se for admin, busca todas; se não, busca apenas a própria
      let sacoleirasQuery = supabase
        .from('sacoleiras')
        .select('id, nome');

      if (!isAdmin && userProfile?.sacoleira_relacionada) {
        console.log('Filtering sacoleiras for current user:', userProfile.sacoleira_relacionada);
        sacoleirasQuery = sacoleirasQuery.eq('id', userProfile.sacoleira_relacionada);
      }

      const { data: sacoleirasData, error: sacoleirasError } = await sacoleirasQuery
        .order('nome');

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
      console.log("=== BUSCANDO LANÇAMENTOS ===")
      console.log("Is Admin:", isAdmin)
      console.log("Sacoleira relacionada:", userProfile?.sacoleira_relacionada)
      
      let lancamentosQuery = supabase
        .from('lancamentos')
        .select(`
          id,
          tipo,
          quantidade,
          valor_unitario,
          valor_total,
          observacoes,
          pagamento,
          data_lancamento,
          produto_id,
          sacoleira_id
        `);

      // Se não for admin, filtrar apenas os lançamentos da própria sacoleira
      if (!isAdmin && userProfile?.sacoleira_relacionada) {
        console.log('Filtering lancamentos for sacoleira:', userProfile.sacoleira_relacionada);
        lancamentosQuery = lancamentosQuery.eq('sacoleira_id', userProfile.sacoleira_relacionada);
      }

      const { data, error } = await lancamentosQuery
        .order('data_lancamento', { ascending: false });

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
      
      if (!data || data.length === 0) {
        return []
      }

      // Buscar dados relacionados
      const produtoIds = [...new Set(data.map(l => l.produto_id).filter(Boolean))]
      const sacoleiraIds = [...new Set(data.map(l => l.sacoleira_id).filter(Boolean))]

      const [produtosResponse, sacoleirasResponse] = await Promise.all([
        supabase.from('produtos').select('id, nome, categorias(nome)').in('id', produtoIds),
        supabase.from('sacoleiras').select('id, nome').in('id', sacoleiraIds)
      ])

      const produtosMap = new Map((produtosResponse.data || []).map(p => [p.id, { nome: p.nome, categoria: p.categorias?.nome || 'Sem categoria' }]))
      const sacoleirasMap = new Map((sacoleirasResponse.data || []).map(s => [s.id, s.nome]))
      
      // Transformar dados para o formato esperado
      const lancamentosFormatados = data.map(lancamento => {
        const produtoInfo = produtosMap.get(lancamento.produto_id)
        return {
          id: lancamento.id,
          produto: produtoInfo?.nome || 'Produto não encontrado',
          produto_id: lancamento.produto_id || '',
          valor: Number(lancamento.valor_unitario || 0),
          quantidade: lancamento.quantidade || 0,
          categoria: produtoInfo?.categoria || 'Sem categoria',
          sacoleira: sacoleirasMap.get(lancamento.sacoleira_id) || 'Sacoleira não encontrada',
          sacoleira_id: lancamento.sacoleira_id || '',
          data: lancamento.data_lancamento || new Date().toISOString(),
          total: Number(lancamento.valor_total || 0),
          observacoes: lancamento.observacoes || '',
          tipo: lancamento.tipo || '',
          pagamento: lancamento.pagamento || false
        }
      })
      
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

  useEffect(() => {
    if (userProfile?.id) {
      console.log("Iniciando fetch de dados para user:", userProfile.id)
      fetchData()
    } else {
      console.log("Aguardando userProfile...")
      setLoading(false)
    }
  }, [userProfile?.id, userProfile?.sacoleira_relacionada, isAdmin]) // Adicionar dependências relevantes

  return {
    produtos,
    sacoleiras,
    loading,
    fetchLancamentos
  }
}
