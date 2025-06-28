
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"

interface EstoqueEmptyProps {
  filtroSacoleira: string
  filtroCategoria: string
  searchTerm: string
}

export function EstoqueEmpty({ filtroSacoleira, filtroCategoria, searchTerm }: EstoqueEmptyProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground">
          {filtroSacoleira || filtroCategoria || searchTerm 
            ? "Ajuste os filtros para ver os produtos em estoque" 
            : "Nenhuma sacoleira possui produtos em estoque"}
        </p>
      </CardContent>
    </Card>
  )
}
