
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface LancamentoFormPagamentoProps {
  pagamento: boolean
  setPagamento: (pagamento: boolean) => void
  loading: boolean
}

export function LancamentoFormPagamento({ 
  pagamento, 
  setPagamento, 
  loading 
}: LancamentoFormPagamentoProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="pagamento"
        checked={pagamento}
        onCheckedChange={(checked) => setPagamento(checked as boolean)}
        disabled={loading}
      />
      <Label 
        htmlFor="pagamento" 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Lançamento pago pela sacoleira
      </Label>
    </div>
  )
}
