
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package } from "lucide-react"

interface Produto {
  id: string
  nome: string
  categoria: string
  precoVenda: number
}

interface EstoqueCardProps {
  sacoleira: string
  produtos: { [produto: string]: number }
  mockProdutos: Produto[]
}

export function EstoqueCard({ sacoleira, produtos, mockProdutos }: EstoqueCardProps) {
  const produtosEmEstoque = Object.entries(produtos).filter(([_, qtd]) => qtd > 0)
  const totalItens = Object.values(produtos).reduce((total, qtd) => total + (qtd > 0 ? qtd : 0), 0)
  const valorTotalEmEstoque = produtosEmEstoque.reduce((total, [produto, quantidade]) => {
    const produtoInfo = mockProdutos.find(p => p.nome === produto)
    return total + ((produtoInfo?.precoVenda || 0) * quantidade)
  }, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">{sacoleira}</CardTitle>
          <Badge variant="outline">
            {totalItens} itens
          </Badge>
          <Badge variant="secondary">
            R$ {valorTotalEmEstoque.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {produtosEmEstoque.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtosEmEstoque.map(([produto, quantidade]) => {
              const produtoInfo = mockProdutos.find(p => p.nome === produto)
              return (
                <div key={produto} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">{produto}</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{produtoInfo?.categoria || 'Sem categoria'}</Badge>
                    <span className="text-lg font-bold text-primary">{quantidade} un.</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valor total: R$ {((produtoInfo?.precoVenda || 0) * quantidade).toFixed(2)}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Esta sacoleira não possui produtos em estoque</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
