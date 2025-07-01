
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, User, FileText, ArrowUp, ArrowDown, Check, X } from "lucide-react"
import { Lancamento } from "@/types/lancamento"

interface LancamentoCardProps {
  lancamento: Lancamento
}

export function LancamentoCard({ lancamento }: LancamentoCardProps) {
  const isEntrega = !lancamento.tipo || lancamento.tipo === 'entrega'
  
  // Formatar data e hora
  const formatarDataHora = (dataString: string) => {
    try {
      // Se a data já contém informação de hora (formato ISO)
      let data = new Date(dataString)
      
      // Se a data é inválida, tentar outros formatos
      if (isNaN(data.getTime())) {
        // Tentar formato apenas com data (YYYY-MM-DD)
        data = new Date(dataString + 'T12:00:00')
      }
      
      // Verificar se ainda é inválida
      if (isNaN(data.getTime())) {
        return 'Data inválida'
      }
      
      return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch (error) {
      console.error('Erro ao formatar data:', error, 'Data recebida:', dataString)
      return 'Data inválida'
    }
  }
  
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
              <div className="flex gap-2 mt-1">
                <Badge variant={isEntrega ? "default" : "destructive"}>
                  {isEntrega ? "Entrega" : "Devolução"}
                </Badge>
                {lancamento.pagamento !== undefined && (
                  <Badge 
                    variant={lancamento.pagamento ? "default" : "secondary"}
                    className={lancamento.pagamento ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}
                  >
                    <div className="flex items-center gap-1">
                      {lancamento.pagamento ? (
                        <>
                          <Check className="w-3 h-3" />
                          Pago
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          Não Pago
                        </>
                      )}
                    </div>
                  </Badge>
                )}
              </div>
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
            <p className="text-sm text-muted-foreground">Data e Hora</p>
            <p className="font-semibold">{formatarDataHora(lancamento.data)}</p>
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
