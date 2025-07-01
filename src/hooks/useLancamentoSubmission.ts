
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Lancamento } from "@/types/lancamento"

export function useLancamentoSubmission() {
  const { toast } = useToast()

  const handleSubmit = async (formData: any): Promise<Lancamento | null> => {
    try {
      console.log("=== INÍCIO DO PROCESSO DE CRIAÇÃO DE LANÇAMENTO ===")
      console.log("Form data recebido:", formData)
      
      // Verificar campos obrigatórios
      const camposObrigatorios = ['produto_id', 'sacoleira_id', 'tipo', 'quantidade', 'valor_unitario', 'valor_total']
      const camposFaltando = camposObrigatorios.filter(campo => !formData[campo] && formData[campo] !== 0)
      
      if (camposFaltando.length > 0) {
        console.error("Campos obrigatórios faltando:", camposFaltando)
        toast({
          title: "Erro de validação",
          description: `Campos obrigatórios não preenchidos: ${camposFaltando.join(', ')}`,
          variant: "destructive",
        })
        return null
      }

      // Validar e corrigir tipo
      let tipoCorrigido = formData.tipo
      if (tipoCorrigido === 'entrega') {
        tipoCorrigido = 'entrega'
      } else if (tipoCorrigido === 'devolucao' || tipoCorrigido === 'devolução') {
        tipoCorrigido = 'devolucao'
      } else {
        console.error("Tipo inválido recebido:", tipoCorrigido)
        toast({
          title: "Erro de validação",
          description: "Tipo deve ser 'entrega' ou 'devolução'",
          variant: "destructive",
        })
        return null
      }
      
      console.log("Tipo validado:", tipoCorrigido)
      
      const dadosParaInserir = {
        produto_id: formData.produto_id,
        sacoleira_id: formData.sacoleira_id,
        tipo: tipoCorrigido,
        quantidade: Number(formData.quantidade),
        valor_unitario: Number(formData.valor_unitario),
        valor_total: Number(formData.valor_total),
        observacoes: formData.observacoes || null,
        data_lancamento: formData.data_lancamento || new Date().toISOString()
      }
      
      console.log("Dados preparados para inserção:", dadosParaInserir)
      
      // Inserir no banco
      const { data, error } = await supabase
        .from('lancamentos')
        .insert([dadosParaInserir])
        .select(`
          id,
          tipo,
          quantidade,
          valor_unitario,
          valor_total,
          observacoes,
          data_lancamento,
          produto_id,
          sacoleira_id
        `)
        .single()

      if (error) {
        console.error('=== ERRO DO SUPABASE ===')
        console.error('Código:', error.code)
        console.error('Mensagem:', error.message)
        console.error('Detalhes:', error.details)
        console.error('Hint:', error.hint)
        
        toast({
          title: "Erro ao criar lançamento",
          description: `Erro do banco: ${error.message}`,
          variant: "destructive",
        })
        return null
      }

      if (!data) {
        console.error("Nenhum dado retornado")
        toast({
          title: "Erro ao criar lançamento",
          description: "Nenhum dado foi retornado após a inserção.",
          variant: "destructive",
        })
        return null
      }

      console.log("=== SUCESSO NA INSERÇÃO ===")
      console.log("Dados retornados:", data)

      // Buscar informações adicionais para o retorno
      const [produtoResponse, sacoleiraResponse] = await Promise.all([
        supabase.from('produtos').select('nome, categorias(nome)').eq('id', data.produto_id).single(),
        supabase.from('sacoleiras').select('nome').eq('id', data.sacoleira_id).single()
      ])
      
      // Criar objeto de retorno
      const novoLancamento: Lancamento = {
        id: data.id,
        produto: produtoResponse.data?.nome || '',
        produto_id: data.produto_id,
        valor: Number(data.valor_unitario || 0),
        quantidade: data.quantidade,
        categoria: produtoResponse.data?.categorias?.nome || 'Sem categoria',
        sacoleira: sacoleiraResponse.data?.nome || '',
        sacoleira_id: data.sacoleira_id,
        data: data.data_lancamento || new Date().toISOString(),
        total: Number(data.valor_total || 0),
        observacoes: data.observacoes || '',
        tipo: data.tipo
      }
      
      console.log("Lançamento criado:", novoLancamento)
      
      const tipoTexto = tipoCorrigido === 'entrega' ? 'entregue' : 'devolvido'
      
      toast({
        title: "Lançamento criado com sucesso!",
        description: `${produtoResponse.data?.nome || 'Produto'} foi ${tipoTexto} para ${sacoleiraResponse.data?.nome || 'sacoleira'}`,
      })

      return novoLancamento
    } catch (error) {
      console.error("=== ERRO INESPERADO ===")
      console.error("Erro:", error)
      console.error("Stack:", error instanceof Error ? error.stack : 'N/A')
      
      toast({
        title: "Erro ao criar lançamento",
        description: "Erro inesperado. Verifique o console para mais detalhes.",
        variant: "destructive",
      })
      return null
    }
  }

  return { handleSubmit }
}
