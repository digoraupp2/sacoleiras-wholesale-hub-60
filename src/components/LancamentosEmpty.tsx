
import { Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function LancamentosEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum lançamento encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Ainda não há lançamentos cadastrados no sistema.
        </p>
        <p className="text-sm text-muted-foreground">
          Clique no botão "Novo Lançamento" para começar.
        </p>
      </CardContent>
    </Card>
  )
}
