
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { LancamentoFormSelects } from "@/components/LancamentoFormSelects"
import { LancamentoFormInputs } from "@/components/LancamentoFormInputs"
import { LancamentoFormSummary } from "@/components/LancamentoFormSummary"
import { useLancamentoForm } from "@/hooks/useLancamentoForm"
import { validateLancamentoForm } from "@/utils/lancamentoFormValidation"
import { Produto, Sacoleira } from "@/types/lancamento"

interface LancamentoFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  produtos: Produto[]
  sacoleiras: Sacoleira[]
}

export function LancamentoForm({ onSubmit, onCancel, produtos, sacoleiras }: LancamentoFormProps) {
  const {
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
  } = useLancamentoForm()

  const produtoSelecionado = produtos.find(p => p.id === produtoId)
  const sacoleiraSelecionada = sacoleiras.find(s => s.id === sacoleiraId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { isValid } = validateLancamentoForm(produtoId, sacoleiraId, tipo, quantidade)
    
    if (!isValid || !produtoSelecionado || !sacoleiraSelecionada) {
      return
    }

    setLoading(true)
    
    try {
      const novoLancamento = getFormData(produtoSelecionado, sacoleiraSelecionada)
      await onSubmit(novoLancamento)
      resetForm()
    } catch (error) {
      console.error("Erro ao criar lançamento:", error)
    } finally {
      setLoading(false)
    }
  }

  const { isValid } = validateLancamentoForm(produtoId, sacoleiraId, tipo, quantidade)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Novo Lançamento</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} disabled={loading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LancamentoFormSelects
            produtoId={produtoId}
            setProdutoId={setProdutoId}
            sacoleiraId={sacoleiraId}
            setSacoleiraId={setSacoleiraId}
            tipo={tipo}
            setTipo={setTipo}
            produtos={produtos}
            sacoleiras={sacoleiras}
            loading={loading}
          />

          <LancamentoFormInputs
            quantidade={quantidade}
            setQuantidade={setQuantidade}
            observacoes={observacoes}
            setObservacoes={setObservacoes}
            loading={loading}
          />

          <LancamentoFormSummary
            produtoSelecionado={produtoSelecionado}
            sacoleiraSelecionada={sacoleiraSelecionada}
            tipo={tipo}
            quantidade={quantidade}
          />

          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={!isValid || loading}
            >
              {loading ? "Criando..." : "Criar Lançamento"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
