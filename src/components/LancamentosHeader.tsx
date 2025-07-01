
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface LancamentosHeaderProps {
  onNewLancamento: () => void
}

export function LancamentosHeader({ onNewLancamento }: LancamentosHeaderProps) {
  const { isAdmin } = useAuth()

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Lançamentos</h2>
        <p className="text-muted-foreground">
          {isAdmin 
            ? "Registre os produtos entregues às sacoleiras" 
            : "Seus lançamentos de produtos"
          }
        </p>
      </div>
      {isAdmin && (
        <Button onClick={onNewLancamento} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Lançamento
        </Button>
      )}
    </div>
  )
}
