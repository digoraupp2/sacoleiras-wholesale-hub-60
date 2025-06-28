
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Calendar, Package, Users } from "lucide-react"

export default function Lancamentos() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("")
  const [formData, setFormData] = useState({
    produto: "",
    valor: "",
    quantidade: "",
    categoria: "",
    sacoleira: "",
    observacoes: ""
  })

  const mockLancamentos = [
    {
      id: 1,
      produto: "Blusa Feminina Básica",
      valor: 35.00,
      quantidade: 5,
      categoria: "Roupas Femininas",
      sacoleira: "Maria Silva",
      data: "2024-01-15",
      total: 175.00
    },
    {
      id: 2,
      produto: "Calça Jeans Masculina",
      valor: 89.90,
      quantidade: 2,
      categoria: "Roupas Masculinas",
      sacoleira: "Ana Santos",
      data: "2024-01-14",
      total: 179.80
    },
    {
      id: 3,
      produto: "Vestido Floral",
      valor: 59.90,
      quantidade: 3,
      categoria: "Roupas Femininas",
      sacoleira: "Carla Oliveira",
      data: "2024-01-13",
      total: 179.70
    }
  ]

  const mockProdutos = [
    { id: 1, nome: "Blusa Feminina Básica", preco: 35.00, categoria: "Roupas Femininas" },
    { id: 2, nome: "Calça Jeans Masculina", preco: 89.90, categoria: "Roupas Masculinas" },
    { id: 3, nome: "Vestido Floral", preco: 59.90, categoria: "Roupas Femininas" },
    { id: 4, nome: "Tênis Esportivo", preco: 120.00, categoria: "Calçados" }
  ]

  const mockSacoleiras = [
    { id: 1, nome: "Maria Silva" },
    { id: 2, nome: "Ana Santos" },
    { id: 3, nome: "Carla Oliveira" },
    { id: 4, nome: "Rosa Costa" }
  ]

  const categorias = [...new Set(mockProdutos.map(p => p.categoria))]

  const filteredLancamentos = mockLancamentos.filter(lancamento => {
    const matchesSearch = lancamento.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lancamento.sacoleira.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = !filtroCategoria || lancamento.categoria === filtroCategoria
    return matchesSearch && matchesCategoria
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Novo lançamento:", formData)
    setShowForm(false)
    setFormData({ produto: "", valor: "", quantidade: "", categoria: "", sacoleira: "", observacoes: "" })
  }

  const handleProdutoChange = (produtoNome: string) => {
    const produto = mockProdutos.find(p => p.nome === produtoNome)
    if (produto) {
      setFormData({
        ...formData,
        produto: produto.nome,
        valor: produto.preco.toString(),
        categoria: produto.categoria
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lançamentos</h1>
          <p className="text-muted-foreground">Registre os produtos entregues às sacoleiras</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Lançamento
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Lançamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto *</Label>
                  <Select value={formData.produto} onValueChange={handleProdutoChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProdutos.map(produto => (
                        <SelectItem key={produto.id} value={produto.nome}>{produto.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sacoleira">Sacoleira *</Label>
                  <Select value={formData.sacoleira} onValueChange={(value) => setFormData({...formData, sacoleira: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma sacoleira" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSacoleiras.map(sacoleira => (
                        <SelectItem key={sacoleira.id} value={sacoleira.nome}>{sacoleira.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">Valor do Produto *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    placeholder="0,00"
                    required
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade *</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total">Total</Label>
                  <Input
                    id="total"
                    value={formData.valor && formData.quantidade ? 
                      `R$ ${(parseFloat(formData.valor) * parseInt(formData.quantidade)).toFixed(2)}` : 
                      "R$ 0,00"
                    }
                    readOnly
                    className="bg-gray-50 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Observações sobre o lançamento..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Salvar Lançamento</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Buscar lançamentos..."
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
          </div>
        </CardContent>
      </Card>

      {/* Lista de lançamentos */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLancamentos.map((lancamento) => (
          <Card key={lancamento.id} className="hover:shadow-md transition-shadow">
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
        ))}
      </div>
    </div>
  )
}
