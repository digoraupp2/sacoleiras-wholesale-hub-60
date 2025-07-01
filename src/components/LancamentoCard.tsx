import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, User, FileText, ArrowUp, ArrowDown } from "lucide-react"
import { Lancamento } from "@/types/lancamento"

interface LancamentoCardProps {
  lancamento: Lancamento
}

export function LancamentoCard({ lancamento }: LancamentoCardProps) {
  const isEntrega = !lancamento.tipo || lancamento.tipo === 'entrega'
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {isEntrega ? (
              <ArrowUp className="w-5 h-5 text-green-600" />
            ) : (
              <ArrowDown className="w-5 h-5 text-red-600" />
            )}
            <div>
              <CardTitle className="text-lg">{lancamento.produto}</CardTitle>
              <Badge variant={isEntrega ? "default" : "destructive"} className="mt-1">
                {isEntrega ? "Entrega" : "Devolução"}
              </Badge>
            </div>
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
            <p className={`font-bold ${isEntrega ? 'text-green-600' : 'text-red-600'}`}>
              {isEntrega ? '+' : '-'} R$ {lancamento.total.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="font-semibold">{new Date(lancamento.data).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <User className="w-4 h-4" />
          <span>Sacoleira: {lancamento.sacoleira}</span>
        </div>

        {lancamento.observacoes && lancamento.observacoes.trim() && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Observações:</span>
              <p className="mt-1">{lancamento.observacoes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
