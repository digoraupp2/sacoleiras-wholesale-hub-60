
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Package, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface Sacoleira {
  id: string
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

interface Movimentacao {
  id: string
  tipo_movimentacao: string
  produto_nome: string
  quantidade: number
  valor_unitario: number
  data_movimentacao: string
  observacoes?: string
}

interface EstoqueSacoleira {
  produto_id: string
  produto_nome: string
  preco_base: number
  quantidade_estoque: number
  valor_estoque: number
}

interface ExtractSacoleiraDialogProps {
  sacoleira: Sacoleira
  isOpen: boolean
  onClose: () => void
}

export function ExtractSacoleiraDialog({ sacoleira, isOpen, onClose }: ExtractSacoleiraDialogProps) {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [estoque, setEstoque] = useState<EstoqueSacoleira[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && sacoleira.id) {
      fetchMovimentacoes()
      fetchEstoque()
    }
  }, [isOpen, sacoleira.id])

  const fetchMovimentacoes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('movimentacoes')
        .select(`
          id,
          tipo_movimentacao,
          quantidade,
          valor_unitario,
          data_movimentacao,
          observacoes,
          produtos!inner(nome)
        `)
        .eq('sacoleira_id', sacoleira.id)
        .order('data_movimentacao', { ascending: false })

      if (error) {
        console.error('Erro ao buscar movimentações:', error)
        return
      }

      const formattedMovimentacoes = data?.map(mov => ({
        id: mov.id,
        tipo_movimentacao: mov.tipo_movimentacao,
        produto_nome: mov.produtos?.nome || 'Produto não encontrado',
        quantidade: mov.quantidade,
        valor_unitario: mov.valor_unitario || 0,
        data_movimentacao: mov.data_movimentacao,
        observacoes: mov.observacoes
      })) || []

      setMovimentacoes(formattedMovimentacoes)
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEstoque = async () => {
    try {
      const { data, error } = await supabase
        .from('estoque_sacoleiras')
        .select('*')
        .eq('sacoleira_id', sacoleira.id)

      if (error) {
        console.error('Erro ao buscar estoque:', error)
        return
      }

      setEstoque(data || [])
    } catch (error) {
      console.error('Erro ao buscar estoque:', error)
    }
  }

  // Corrigindo os cálculos dos totais - usando os tipos corretos do banco de dados
  const totalEntradas = movimentacoes
    .filter(mov => mov.tipo_movimentacao === 'entrega')
    .reduce((sum, mov) => sum + (mov.quantidade * mov.valor_unitario), 0)

  const totalSaidas = movimentacoes
    .filter(mov => mov.tipo_movimentacao === 'devolucao')
    .reduce((sum, mov) => sum + (mov.quantidade * mov.valor_unitario), 0)

  const totalProdutosEmEstoque = estoque.reduce((sum, item) => sum + item.quantidade_estoque, 0)
  const totalValorEmEstoque = estoque.reduce((sum, item) => sum + item.valor_estoque, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Extrato - {sacoleira.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Produtos em Estoque</p>
                <p className="text-2xl font-bold">{totalProdutosEmEstoque}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Total Entregas</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalEntradas.toFixed(2)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-muted-foreground">Total Devoluções</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalSaidas.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Estoque Atual */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Estoque Atual</h3>
            {estoque.length > 0 ? (
              <div className="space-y-3">
                {estoque.map((item) => (
                  <Card key={item.produto_id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.produto_nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            Preço unitário: R$ {item.preco_base.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.quantidade_estoque} unidades</p>
                          <p className="text-sm text-muted-foreground">
                            Valor total: R$ {item.valor_estoque.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-blue-800">Total em Estoque</h4>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-800">{totalProdutosEmEstoque} unidades</p>
                        <p className="font-bold text-blue-800">R$ {totalValorEmEstoque.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum produto em estoque</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Histórico de Movimentações */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Histórico de Movimentações</h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Carregando movimentações...</p>
              </div>
            ) : movimentacoes.length > 0 ? (
              <div className="space-y-3">
                {movimentacoes.map((movimentacao) => (
                  <Card key={movimentacao.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={movimentacao.tipo_movimentacao === "entrega" ? "default" : "secondary"}>
                              {movimentacao.tipo_movimentacao === "entrega" ? "Entrega" : "Devolução"}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {new Date(movimentacao.data_movimentacao).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <h4 className="font-medium">{movimentacao.produto_nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {movimentacao.quantidade} × R$ {movimentacao.valor_unitario.toFixed(2)}
                          </p>
                          {movimentacao.observacoes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Obs: {movimentacao.observacoes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            movimentacao.tipo_movimentacao === "entrega" ? "text-green-600" : "text-red-600"
                          }`}>
                            {movimentacao.tipo_movimentacao === "entrega" ? "+" : "-"}R$ {(movimentacao.quantidade * movimentacao.valor_unitario).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
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
