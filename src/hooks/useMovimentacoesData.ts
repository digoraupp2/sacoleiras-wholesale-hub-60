
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
      console.log("Buscando movimentações...")
      
      let query = supabase
        .from('movimentacoes')
        .select(`
          id,
          tipo_movimentacao,
          quantidade,
          valor_unitario,
          observacoes,
          data_movimentacao,
          produtos (
            id,
            nome
          ),
          sacoleiras (
            id,
            nome
          )
        `)
        .order('data_movimentacao', { ascending: false })

      // Se não for admin, filtrar apenas as movimentações da sacoleira relacionada
      if (!isAdmin && userProfile?.sacoleira_relacionada) {
        query = query.eq('sacoleira_id', userProfile.sacoleira_relacionada)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Erro ao buscar movimentações:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as movimentações.",
          variant: "destructive"
        })
        return
      }
      
      console.log("Movimentações encontradas:", data?.length || 0)
      
      // Transformar dados para o formato esperado
      const movimentacoesFormatadas = data?.map(mov => ({
        id: mov.id,
        data: mov.data_movimentacao.split('T')[0],
        tipo: mov.tipo_movimentacao,
        sacoleira: mov.sacoleiras?.nome || 'Sacoleira não encontrada',
        sacoleira_id: mov.sacoleiras?.id || '',
        produto: mov.produtos?.nome || 'Produto não encontrado',
        quantidade: mov.quantidade,
        valorUnitario: Number(mov.valor_unitario || 0),
        valorTotal: Number(mov.valor_unitario || 0) * mov.quantidade,
        observacoes: mov.observacoes || ''
      })) || []
      
      setMovimentacoes(movimentacoesFormatadas)
    } catch (error) {
      console.error('Erro inesperado ao buscar movimentações:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar movimentações.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovimentacoes()
  }, [userProfile, isAdmin])

  return {
    movimentacoes,
    loading,
    fetchMovimentacoes
  }
}
