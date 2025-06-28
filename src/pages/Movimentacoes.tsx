
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, TrendingUp, TrendingDown, Package } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Movimentacoes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const { userProfile, isAdmin } = useAuth()
  
  const mockMovimentacoes = [
    {
      id: 1,
      data: "2024-01-15",
      tipo: "entrega",
      sacoleira: "Maria Silva Santos",
      sacoleira_id: "sacoleira-1",
      produto: "Blusa Feminina Básica",
      quantidade: 10,
      valorUnitario: 35.00,
      valorTotal: 350.00,
      observacoes: "Entrega programada"
    },
    {
      id: 2,
      data: "2024-01-14",
      tipo: "venda",
      sacoleira: "Ana Costa Oliveira",
      sacoleira_id: "sacoleira-2", 
      produto: "Calça Jeans Masculina",
      quantidade: 5,
      valorUnitario: 89.90,
      valorTotal: 449.50,
      observacoes: "Venda realizada na feira"
    },
    {
      id: 3,
      data: "2024-01-14",
      tipo: "devolucao",
      sacoleira: "Maria Silva Santos",
      sacoleira_id: "sacoleira-1",
      produto: "Vestido Floral",
      quantidade: 2,
      valorUnitario: 59.90,
      valorTotal: 119.80,
      observacoes: "Produto com defeito"
    },
    {
      id: 4,
      data: "2024-01-13",
      tipo: "entrega",
      sacoleira: "Carla Mendes",
      sacoleira_id: "sacoleira-3",
      produto: "Blusa Feminina Básica",
      quantidade: 15,
      valorUnitario: 35.00,
      valorTotal: 525.00,
      observacoes: ""
    }
  ]

  // Filtrar movimentações baseado no tipo de usuário
  let movimentacoesParaExibir = mockMovimentacoes;
  
  // Se não for admin, mostrar apenas as movimentações da própria sacoleira
  if (!isAdmin && userProfile?.sacoleira_relacionada) {
    movimentacoesParaExibir = mockMovimentacoes.filter(
      movimentacao => movimentacao.sacoleira_id === userProfile.sacoleira_relacionada
    )
  }

  const filteredMovimentacoes = movimentacoesParaExibir.filter(mov => {
    const matchesSearch = mov.sacoleira.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.produto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFiltro === "todos" || mov.tipo === tipoFiltro
    return matchesSearch && matchesTipo
  })

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "entrega":
        return <TrendingUp className="w-4 h-4" />
      case "devolucao":
        return <TrendingDown className="w-4 h-4" />
      case "venda":
        return <Package className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "entrega":
        return "bg-blue-100 text-blue-800"
      case "devolucao":
        return "bg-red-100 text-red-800"
      case "venda":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Movimentações</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Histórico de entregas, vendas e devoluções" 
              : "Seu histórico de movimentações"
            }
          </p>
        </div>
        {isAdmin && (
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Movimentação
          </Button>
        )}
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder={isAdmin ? "Buscar por sacoleira ou produto..." : "Buscar por produto..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de movimentação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="entrega">Entregas</SelectItem>
                <SelectItem value="venda">Vendas</SelectItem>
                <SelectItem value="devolucao">Devoluções</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isAdmin ? "Histórico de Movimentações" : "Suas Movimentações"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMovimentacoes.length > 0 ? (
              filteredMovimentacoes.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getTipoColor(mov.tipo)}`}>
                      {getTipoIcon(mov.tipo)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {isAdmin && <h3 className="font-semibold">{mov.sacoleira}</h3>}
                        <Badge className={`${getTipoColor(mov.tipo)} border-0`}>
                          {mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{mov.produto}</p>
                      <p className="text-xs text-muted-foreground">{mov.data}</p>
                      {mov.observacoes && (
                        <p className="text-xs text-muted-foreground italic">"{mov.observacoes}"</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">{mov.quantidade} un.</p>
                    <p className="text-sm text-muted-foreground">R$ {mov.valorUnitario.toFixed(2)} cada</p>
                    <p className="font-bold text-accent">R$ {mov.valorTotal.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {!isAdmin ? "Nenhuma movimentação encontrada para você." : "Nenhuma movimentação encontrada."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
