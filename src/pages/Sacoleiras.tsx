
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, User, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export default function Sacoleiras() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const mockSacoleiras = [
    {
      id: 1,
      nome: "Maria Silva Santos",
      cpf: "123.456.789-00",
      telefone: "(11) 99999-1234",
      email: "maria.silva@email.com",
      endereco: "Rua das Flores, 123 - São Paulo/SP",
      status: "ativa",
      produtosEmPosse: 45,
      valorEmPosse: 2450.00,
      ultimaMovimentacao: "2024-01-15"
    },
    {
      id: 2,
      nome: "Ana Costa Oliveira",
      cpf: "987.654.321-00", 
      telefone: "(11) 98888-5678",
      email: "ana.costa@email.com",
      endereco: "Av. Principal, 456 - São Paulo/SP",
      status: "ativa",
      produtosEmPosse: 32,
      valorEmPosse: 1890.00,
      ultimaMovimentacao: "2024-01-14"
    },
    {
      id: 3,
      nome: "Carla Mendes",
      cpf: "456.789.123-00",
      telefone: "(11) 97777-9012", 
      email: "carla.mendes@email.com",
      endereco: "Rua do Comércio, 789 - São Paulo/SP",
      status: "inativa",
      produtosEmPosse: 0,
      valorEmPosse: 0,
      ultimaMovimentacao: "2023-12-20"
    }
  ]

  const filteredSacoleiras = mockSacoleiras.filter(sacoleira =>
    sacoleira.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sacoleira.cpf.includes(searchTerm) ||
    sacoleira.telefone.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sacoleiras</h1>
          <p className="text-muted-foreground">Gerencie suas parceiras de vendas</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/sacoleiras/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Sacoleira
          </Link>
        </Button>
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
                placeholder="Buscar por nome, CPF ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de sacoleiras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSacoleiras.map((sacoleira) => (
          <Card key={sacoleira.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{sacoleira.nome}</h3>
                    <p className="text-sm text-muted-foreground">CPF: {sacoleira.cpf}</p>
                  </div>
                </div>
                <Badge variant={sacoleira.status === "ativa" ? "default" : "secondary"}>
                  {sacoleira.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{sacoleira.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{sacoleira.endereco}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Produtos em Posse</p>
                  <p className="font-bold text-lg">{sacoleira.produtosEmPosse}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor em Posse</p>
                  <p className="font-bold text-lg text-accent">R$ {sacoleira.valorEmPosse.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Extrato
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
