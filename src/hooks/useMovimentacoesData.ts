
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface Movimentacao {
  id: string
  data: string
  tipo: string
  sacoleira: string
  sacoleira_id: string
  produto: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  observacoes: string
}

export function useMovimentacoesData() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { userProfile, isAdmin } = useAuth()

  const fetchMovimentacoes = async () => {
    try {
      setLoading(true)
      console.log("=== BUSCANDO MOVIMENTAÇÕES ===")
      console.log("User profile:", userProfile)
      console.log("Is admin:", isAdmin)
      
      let query = supabase
        .from('movimentacoes')
        .select(`
          id,
          tipo_movimentacao,
          quantidade,
          valor_unitario,
          observacoes,
          data_movimentacao,
          produto_id,
          sacoleira_id
        `)
        .order('data_movimentacao', { ascending: false })

      // Se não for admin, filtrar apenas as movimentações da sacoleira relacionada
      if (!isAdmin && userProfile?.sacoleira_relacionada) {
        console.log("Filtrando por sacoleira:", userProfile.sacoleira_relacionada)
        query = query.eq('sacoleira_id', userProfile.sacoleira_relacionada)
      }
      
      const { data: movimentacoesData, error } = await query
      
      if (error) {
        console.error('Erro ao buscar movimentações:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as movimentações.",
          variant: "destructive"
        })
        setMovimentacoes([])
        return
      }
      
      console.log("Movimentações encontradas:", movimentacoesData?.length || 0)
      
      if (!movimentacoesData || movimentacoesData.length === 0) {
        console.log("Nenhuma movimentação encontrada")
        setMovimentacoes([])
        return
      }

      // Buscar dados relacionados em queries separadas
      const produtoIds = [...new Set(movimentacoesData.map(mov => mov.produto_id).filter(Boolean))]
      const sacoleiraIds = [...new Set(movimentacoesData.map(mov => mov.sacoleira_id).filter(Boolean))]

      console.log("Produto IDs:", produtoIds)
      console.log("Sacoleira IDs:", sacoleiraIds)

      // Buscar produtos
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select('id, nome')
        .in('id', produtoIds)

      if (produtosError) {
        console.error('Erro ao buscar produtos:', produtosError)
      }

      // Buscar sacoleiras
      const { data: sacoleirasData, error: sacoleirasError } = await supabase
        .from('sacoleiras')
        .select('id, nome')
        .in('id', sacoleiraIds)

      if (sacoleirasError) {
        console.error('Erro ao buscar sacoleiras:', sacoleirasError)
      }

      console.log("Produtos encontrados:", produtosData?.length || 0)
      console.log("Sacoleiras encontradas:", sacoleirasData?.length || 0)

      // Criar maps para lookup rápido
      const produtosMap = new Map((produtosData || []).map(p => [p.id, p.nome]))
      const sacoleirasMap = new Map((sacoleirasData || []).map(s => [s.id, s.nome]))
      
      // Transformar dados para o formato esperado
      const movimentacoesFormatadas = movimentacoesData.map(mov => ({
        id: mov.id,
        data: mov.data_movimentacao || new Date().toISOString(),
        tipo: mov.tipo_movimentacao || '',
        sacoleira: sacoleirasMap.get(mov.sacoleira_id) || 'Sacoleira não encontrada',
        sacoleira_id: mov.sacoleira_id || '',
        produto: produtosMap.get(mov.produto_id) || 'Produto não encontrado',
        quantidade: mov.quantidade || 0,
        valorUnitario: Number(mov.valor_unitario || 0),
        valorTotal: Number(mov.valor_unitario || 0) * (mov.quantidade || 0),
        observacoes: mov.observacoes || ''
      }))
      
      console.log("Movimentações formatadas:", movimentacoesFormatadas.length)
      setMovimentacoes(movimentacoesFormatadas)
    } catch (error) {
      console.error('Erro inesperado ao buscar movimentações:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar movimentações.",
        variant: "destructive"
      })
      setMovimentacoes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Só buscar dados se o usuário estiver autenticado
    if (userProfile?.id) {
      console.log("Iniciando fetch de movimentações para user:", userProfile.id)
      fetchMovimentacoes()
    } else {
      console.log("Aguardando userProfile...")
      setLoading(false)
    }
  }, [userProfile?.id, isAdmin]) // Apenas IDs para evitar loops

  return {
    movimentacoes,
    loading,
    fetchMovimentacoes
  }
}
