
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Users, Plus, Minus } from "lucide-react"
import { MovimentacaoForm } from "@/components/MovimentacaoForm"

export default function EstoqueSacoleiras() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("")
  const [filtroSacoleira, setFiltroSacoleira] = useState("")

  const mockProdutos = [
    { id: 1, nome: "Blusa Feminina Básica", categoria: "Roupas Femininas", precoVenda: 35.00 },
    { id: 2, nome: "Calça Jeans Masculina", categoria: "Roupas Masculinas", precoVenda: 89.90 },
    { id: 3, nome: "Vestido Floral", categoria: "Roupas Femininas", precoVenda: 59.90 },
    { id: 4, nome: "Tênis Esportivo", categoria: "Calçados", precoVenda: 120.00 },
    { id: 5, nome: "Jaqueta de Couro", categoria: "Roupas Femininas", precoVenda: 150.00 },
    { id: 6, nome: "Moleton Básico", categoria: "Roupas Unissex", precoVenda: 45.00 }
  ]

  const mockSacoleiras = [
    { id: 1, nome: "Maria Silva" },
    { id: 2, nome: "Ana Santos" },
    { id: 3, nome: "Carla Oliveira" },
    { id: 4, nome: "Rosa Costa" }
  ]

  const [movimentacoes, setMovimentacoes] = useState([
    { id: 1, produto: "Blusa Feminina Básica", sacoleira: "Maria Silva", tipo: "entrega", quantidade: 15, data: "2024-01-15" },
    { id: 2, produto: "Tênis Esportivo", sacoleira: "Maria Silva", tipo: "entrega", quantidade: 10, data: "2024-01-15" },
    { id: 3, produto: "Moleton Básico", sacoleira: "Maria Silva", tipo: "entrega", quantidade: 5, data: "2024-01-15" },
    { id: 4, produto: "Blusa Feminina Básica", sacoleira: "Maria Silva", tipo: "devolucao", quantidade: 3, data: "2024-01-16" },
    { id: 5, produto: "Tênis Esportivo", sacoleira: "Maria Silva", tipo: "devolucao", quantidade: 5, data: "2024-01-16" },
    { id: 6, produto: "Jaqueta de Couro", sacoleira: "Maria Silva", tipo: "entrega", quantidade: 5, data: "2024-01-17" }
  ])

  const calcularEstoque = () => {
    const estoque: { [key: string]: { [produto: string]: number } } = {}
    
    movimentacoes.forEach(mov => {
      if (!estoque[mov.sacoleira]) {
        estoque[mov.sacoleira] = {}
      }
      
      if (!estoque[mov.sacoleira][mov.produto]) {
        estoque[mov.sacoleira][mov.produto] = 0
      }
      
      if (mov.tipo === "entrega") {
        estoque[mov.sacoleira][mov.produto] += mov.quantidade
      } else {
        estoque[mov.sacoleira][mov.produto] -= mov.quantidade
      }
    })
    
    return estoque
  }

  const estoqueAtual = calcularEstoque()
  const categorias = [...new Set(mockProdutos.map(p => p.categoria))]

  const estoqueFiltered = Object.entries(estoqueAtual).filter(([sacoleira, produtos]) => {
    if (filtroSacoleira && sacoleira !== filtroSacoleira) return false
    
    const produtosSacoleira = Object.entries(produtos).filter(([produto, quantidade]) => {
      if (quantidade <= 0) return false
      if (searchTerm && !produto.toLowerCase().includes(searchTerm.toLowerCase())) return false
      
      const produtoInfo = mockProdutos.find(p => p.nome === produto)
      if (filtroCategoria && produtoInfo?.categoria !== filtroCategoria) return false
      
      return true
    })
    
    return produtosSacoleira.length > 0
  })

  const handleSubmit = (novaMovimentacao: any) => {
    setMovimentacoes([...movimentacoes, novaMovimentacao])
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Estoque das Sacoleiras</h1>
          <p className="text-muted-foreground">Controle o que cada sacoleira tem em estoque</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      {showForm && (
        <MovimentacaoForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          produtos={mockProdutos}
          sacoleiras={mockSacoleiras}
        />
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroSacoleira} onValueChange={setFiltroSacoleira}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as sacoleiras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as sacoleiras</SelectItem>
                {mockSacoleiras.map(sacoleira => (
                  <SelectItem key={sacoleira.id} value={sacoleira.nome}>{sacoleira.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estoque por Sacoleira */}
      <div className="space-y-4">
        {estoqueFiltered.map(([sacoleira, produtos]) => (
          <Card key={sacoleira}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">{sacoleira}</CardTitle>
                <Badge variant="outline">
                  {Object.values(produtos).reduce((total, qtd) => total + (qtd > 0 ? qtd : 0), 0)} itens
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(produtos).filter(([_, qtd]) => qtd > 0).map(([produto, quantidade]) => {
                  const produtoInfo = mockProdutos.find(p => p.nome === produto)
                  return (
                    <div key={produto} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        <h4 className="font-semibold">{produto}</h4>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">{produtoInfo?.categoria}</Badge>
                        <span className="text-lg font-bold text-primary">{quantidade} un.</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Valor total: R$ {((produtoInfo?.precoVenda || 0) * quantidade).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {estoqueFiltered.length === 0 && (
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
      )}
    </div>
  )
}
