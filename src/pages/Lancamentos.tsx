
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LancamentoForm } from "@/components/LancamentoForm"
import { LancamentoFilters } from "@/components/LancamentoFilters"
import { LancamentoCard } from "@/components/LancamentoCard"

export default function Lancamentos() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")

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
    const matchesCategoria = filtroCategoria === "todas" || lancamento.categoria === filtroCategoria
    return matchesSearch && matchesCategoria
  })

  const handleSubmit = (formData: any) => {
    console.log("Novo lançamento:", formData)
    setShowForm(false)
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
        <LancamentoForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          produtos={mockProdutos}
          sacoleiras={mockSacoleiras}
        />
      )}

      <LancamentoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filtroCategoria={filtroCategoria}
        onCategoriaChange={setFiltroCategoria}
        categorias={categorias}
      />

      <div className="grid grid-cols-1 gap-4">
        {filteredLancamentos.map((lancamento) => (
          <LancamentoCard key={lancamento.id} lancamento={lancamento} />
        ))}
      </div>
    </div>
  )
}
