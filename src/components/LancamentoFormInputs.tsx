
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface LancamentoFormInputsProps {
  quantidade: string
  setQuantidade: (value: string) => void
  observacoes: string
  setObservacoes: (value: string) => void
  loading: boolean
}

export function LancamentoFormInputs({
  quantidade,
  setQuantidade,
  observacoes,
  setObservacoes,
  loading
}: LancamentoFormInputsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade *</Label>
          <Input
            id="quantidade"
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Digite a quantidade"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Input
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Digite observações sobre o lançamento"
          disabled={loading}
        />
      </div>
    </>
  )
}
