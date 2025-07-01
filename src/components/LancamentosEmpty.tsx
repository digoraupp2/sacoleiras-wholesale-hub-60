
import { useAuth } from "@/contexts/AuthContext"

export function LancamentosEmpty() {
  const { isAdmin } = useAuth()
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      {!isAdmin ? "Nenhum lançamento encontrado para você." : "Nenhum lançamento encontrado."}
    </div>
  )
}
