
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Lancamento } from "@/types/lancamento"

export function useLancamentoSubmission() {
  const { toast } = useToast()

  const handleSubmit = async (formData: any): Promise<Lancamento | null> => {
    try {
      console.log("=== INÍCIO DO PROCESSO DE CRIAÇÃO ===")
      console.log("Dados do formulário recebidos:", formData)
      
      // Verificar se todos os campos obrigatórios estão presentes
      const camposObrigatorios = ['produto_id', 'sacoleira_id', 'tipo', 'quantidade', 'valor_unitario', 'valor_total']
      const camposFaltando = camposObrigatorios.filter(campo => !formData[campo])
      
      if (camposFaltando.length > 0) {
        console.error("Campos obrigatórios faltando:", camposFaltando)
        toast({
          title: "Erro de validação",
          description: `Campos obrigatórios não preenchidos: ${camposFaltando.join(', ')}`,
          variant: "destructive",
        })
        return null
      }

      console.log("Validação inicial passou. Preparando dados para inserção...")
      
      const dadosParaInserir = {
        produto_id: formData.produto_id,
        sacoleira_id: formData.sacoleira_id,
        tipo: formData.tipo,
        quantidade: formData.quantidade,
        valor_unitario: formData.valor_unitario,
        valor_total: formData.valor_total,
        observacoes: formData.observacoes || null,
        data_lancamento: formData.data_lancamento
      }
      
      console.log("Dados preparados para inserção:", dadosParaInserir)
      
      // Salvar no banco de dados
      console.log("Iniciando inserção no Supabase...")
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
        .single()

      if (error) {
        console.error('=== ERRO DETALHADO DO SUPABASE ===')
        console.error('Código do erro:', error.code)
        console.error('Mensagem do erro:', error.message)
        console.error('Detalhes do erro:', error.details)
        console.error('Hint do erro:', error.hint)
        console.error('Erro completo:', error)
        
        toast({
          title: "Erro ao criar lançamento",
          description: `Erro do banco de dados: ${error.message}`,
          variant: "destructive",
        })
        return null
      }

      if (!data) {
        console.error("Nenhum dado retornado após inserção")
        toast({
          title: "Erro ao criar lançamento",
          description: "Nenhum dado foi retornado após a inserção.",
          variant: "destructive",
        })
        return null
      }

      console.log("=== SUCESSO NA INSERÇÃO ===")
      console.log("Dados retornados do Supabase:", data)
      
      // Criar o objeto do novo lançamento
      const novoLancamento: Lancamento = {
        id: data.id,
        produto: data.produtos?.nome || '',
        produto_id: data.produtos?.id || '',
        valor: data.valor_unitario,
        quantidade: data.quantidade,
        categoria: data.produtos?.categorias?.nome || 'Sem categoria',
        sacoleira: data.sacoleiras?.nome || '',
        sacoleira_id: data.sacoleiras?.id || '',
        data: data.data_lancamento.split('T')[0],
        total: data.valor_total,
        observacoes: data.observacoes || '',
        tipo: data.tipo
      }
      
      console.log("Objeto lançamento criado:", novoLancamento)
      
      const tipoTexto = formData.tipo === 'entrega' ? 'entregue' : 'devolvido'
      
      toast({
        title: "Lançamento criado com sucesso!",
        description: `${formData.produto} foi ${tipoTexto} para ${formData.sacoleira}`,
      })

      return novoLancamento
    } catch (error) {
      console.error("=== ERRO INESPERADO ===")
      console.error("Tipo do erro:", typeof error)
      console.error("Erro capturado:", error)
      console.error("Stack trace:", error instanceof Error ? error.stack : 'Não disponível')
      
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
