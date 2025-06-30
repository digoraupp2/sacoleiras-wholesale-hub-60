
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Package, TrendingUp, TrendingDown } from "lucide-react"

interface Sacoleira {
  id: number
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco: string
  status: string
  produtosEmPosse: number
  valorEmPosse: number
  ultimaMovimentacao: string
}

interface ExtractSacoleiraDialogProps {
  sacoleira: Sacoleira
  isOpen: boolean
  onClose: () => void
}

export function ExtractSacoleiraDialog({ sacoleira, isOpen, onClose }: ExtractSacoleiraDialogProps) {
  // Mock data para demonstração - em um app real, estes dados viriam de uma API
  const mockMovimentacoes = [
    {
      id: 1,
      tipo: "entrada",
      produto: "Blusa Feminina Básica",
      quantidade: 5,
      valor: 35.00,
      total: 175.00,
      data: "2024-01-15"
    },
    {
      id: 2,
      tipo: "saida",
      produto: "Blusa Feminina Básica",
      quantidade: 2,
      valor: 35.00,
      total: 70.00,
      data: "2024-01-14"
    },
    {
      id: 3,
      tipo: "entrada",
      produto: "Vestido Floral",
      quantidade: 3,
      valor: 59.90,
      total: 179.70,
      data: "2024-01-13"
    }
  ]

  const totalEntradas = mockMovimentacoes
    .filter(mov => mov.tipo === "entrada")
    .reduce((sum, mov) => sum + mov.total, 0)

  const totalSaidas = mockMovimentacoes
    .filter(mov => mov.tipo === "saida")
    .reduce((sum, mov) => sum + mov.total, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Extrato - {sacoleira.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Produtos em Posse</p>
                <p className="text-2xl font-bold">{sacoleira.produtosEmPosse}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Total Entradas</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalEntradas.toFixed(2)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-muted-foreground">Total Saídas</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalSaidas.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Histórico de Movimentações */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Histórico de Movimentações</h3>
            <div className="space-y-3">
              {mockMovimentacoes.map((movimentacao) => (
                <Card key={movimentacao.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={movimentacao.tipo === "entrada" ? "default" : "secondary"}>
                            {movimentacao.tipo === "entrada" ? "Entrada" : "Saída"}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(movimentacao.data).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <h4 className="font-medium">{movimentacao.produto}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {movimentacao.quantidade} × R$ {movimentacao.valor.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          movimentacao.tipo === "entrada" ? "text-green-600" : "text-red-600"
                        }`}>
                          {movimentacao.tipo === "entrada" ? "+" : "-"}R$ {movimentacao.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {mockMovimentacoes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma movimentação encontrada</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
