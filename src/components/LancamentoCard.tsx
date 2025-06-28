
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, User } from "lucide-react"

interface Lancamento {
  id: number
  produto: string
  valor: number
  quantidade: number
  categoria: string
  sacoleira: string
  data: string
  total: number
}

interface LancamentoCardProps {
  lancamento: Lancamento
}

export function LancamentoCard({ lancamento }: LancamentoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{lancamento.produto}</CardTitle>
          </div>
          <Badge variant="outline">{lancamento.categoria}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Valor Unitário</p>
            <p className="font-semibold">R$ {lancamento.valor.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quantidade</p>
            <p className="font-semibold">{lancamento.quantidade} un.</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-bold text-primary">R$ {lancamento.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="font-semibold">{new Date(lancamento.data).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Sacoleira: {lancamento.sacoleira}</span>
        </div>
      </CardContent>
    </Card>
  )
}
