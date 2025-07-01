
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface LancamentosHeaderProps {
  onNewLancamento: () => void
}

export function LancamentosHeader({ onNewLancamento }: LancamentosHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Lançamentos</h2>
        <p className="text-muted-foreground">
          Gerencie os lançamentos de produtos para as sacoleiras
        </p>
      </div>
      <Button onClick={onNewLancamento}>
        <Plus className="w-4 h-4 mr-2" />
        Novo Lançamento
      </Button>
    </div>
  )
}
