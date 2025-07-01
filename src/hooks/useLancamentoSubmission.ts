
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Lancamento } from "@/types/lancamento"

export function useLancamentoSubmission() {
  const { toast } = useToast()

  const handleSubmit = async (formData: any): Promise<Lancamento | null> => {
    try {
      console.log("Criando novo lançamento:", formData)
      
      // Salvar no banco de dados
      const { data, error } = await supabase
        .from('lancamentos')
        .insert([{
          produto_id: formData.produto_id,
          sacoleira_id: formData.sacoleira_id,
          tipo: formData.tipo,
          quantidade: formData.quantidade,
          valor_unitario: formData.valor_unitario,
          valor_total: formData.valor_total,
          observacoes: formData.observacoes || null,
          data_lancamento: formData.data_lancamento
        }])
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
        console.error('Erro ao salvar lançamento:', error)
        toast({
          title: "Erro ao criar lançamento",
          description: "Não foi possível salvar o lançamento. Tente novamente.",
          variant: "destructive",
        })
        return null
      }

      console.log("Lançamento salvo com sucesso:", data)
      
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
      
      const tipoTexto = formData.tipo === 'entrega' ? 'entregue' : 'devolvido'
      
      toast({
        title: "Lançamento criado com sucesso!",
        description: `${formData.produto} foi ${tipoTexto} para ${formData.sacoleira}`,
      })

      return novoLancamento
    } catch (error) {
      console.error("Erro ao criar lançamento:", error)
      toast({
        title: "Erro ao criar lançamento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
      return null
    }
  }

  return { handleSubmit }
}
