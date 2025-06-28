
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, DollarSign } from "lucide-react"

export default function Precos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    sacoleira: "",
    produto: "",
    precoPersonalizado: ""
  })
  
  const mockPrecos = [
    {
      id: 1,
      sacoleira: "Maria Silva Santos",
      produto: "Blusa Feminina Básica",
      precoOriginal: 35.00,
      precoPersonalizado: 32.00,
      desconto: 8.57
    },
    {
      id: 2,
      sacoleira: "Ana Costa Oliveira",
      produto: "Calça Jeans Masculina",
      precoOriginal: 89.90,
      precoPersonalizado: 85.00,
      desconto: 5.45
    },
    {
      id: 3,
      sacoleira: "Maria Silva Santos",
      produto: "Vestido Floral",
      precoOriginal: 59.90,
      precoPersonalizado: 55.00,
      desconto: 8.18
    }
  ]

  const mockSacoleiras = [
    { id: 1, nome: "Maria Silva Santos" },
    { id: 2, nome: "Ana Costa Oliveira" },
    { id: 3, nome: "Carla Mendes" }
  ]

  const mockProdutos = [
    { id: 1, nome: "Blusa Feminina Básica", precoVenda: 35.00 },
    { id: 2, nome: "Calça Jeans Masculina", precoVenda: 89.90 },
    { id: 3, nome: "Vestido Floral", precoVenda: 59.90 }
  ]

  const filteredPrecos = mockPrecos.filter(preco =>
    preco.sacoleira.toLowerCase().includes(searchTerm.toLowerCase()) ||
    preco.produto.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Novo preço personalizado:", formData)
    setShowForm(false)
    setFormData({ sacoleira: "", produto: "", precoPersonalizado: "" })
  }

  const calculateDiscount = (original: number, personalizado: number) => {
    return ((original - personalizado) / original * 100).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Preços Personalizados</h1>
          <p className="text-muted-foreground">Defina preços especiais para suas sacoleiras</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Preço
        </Button>
      </div>

      {/* Formulário de novo preço personalizado */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Preço Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sacoleira">Sacoleira *</Label>
                  <select
                    id="sacoleira"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.sacoleira}
                    onChange={(e) => setFormData({...formData, sacoleira: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma sacoleira</option>
                    {mockSacoleiras.map(sacoleira => (
                      <option key={sacoleira.id} value={sacoleira.nome}>{sacoleira.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="produto">Produto *</Label>
                  <select
                    id="produto"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.produto}
                    onChange={(e) => setFormData({...formData, produto: e.target.value})}
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {mockProdutos.map(produto => (
                      <option key={produto.id} value={produto.nome}>
                        {produto.nome} - R$ {produto.precoVenda.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precoPersonalizado">Preço Personalizado *</Label>
                  <Input
                    id="precoPersonalizado"
                    type="number"
                    step="0.01"
                    value={formData.precoPersonalizado}
                    onChange={(e) => setFormData({...formData, precoPersonalizado: e.target.value})}
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Salvar</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Buscar por sacoleira ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de preços personalizados */}
      <div className="space-y-4">
        {filteredPrecos.map((preco) => (
          <Card key={preco.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{preco.produto}</h3>
                    <p className="text-sm text-muted-foreground">Para: {preco.sacoleira}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Preço Original</p>
                      <p className="font-medium text-lg">R$ {preco.precoOriginal.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Preço Personalizado</p>
                      <p className="font-bold text-lg text-accent">R$ {preco.precoPersonalizado.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Desconto</p>
                      <Badge variant="secondary">{preco.desconto}%</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
