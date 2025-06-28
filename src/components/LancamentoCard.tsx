
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, Users } from "lucide-react"

interface LancamentoCardProps {
  lancamento: {
    id: number
    produto: string
    valor: number
    quantidade: number
    categoria: string
    sacoleira: string
    data: string
    total: number
  }
}

export function LancamentoCard({ lancamento }: LancamentoCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">{lancamento.produto}</h3>
              <Badge variant="secondary">{lancamento.categoria}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span>{lancamento.sacoleira}</span>
              <Calendar className="w-4 h-4 ml-4" />
              <span>{new Date(lancamento.data).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              R$ {lancamento.total.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {lancamento.quantidade} × R$ {lancamento.valor.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Quantidade</div>
            <div className="font-semibold">{lancamento.quantidade} un.</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Valor Unit.</div>
            <div className="font-semibold">R$ {lancamento.valor.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="font-semibold text-primary">R$ {lancamento.total.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
