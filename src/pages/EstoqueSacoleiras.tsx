import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MovimentacaoForm } from "@/components/MovimentacaoForm"
import { EstoqueFilters } from "@/components/EstoqueFilters"
import { EstoqueCard } from "@/components/EstoqueCard"
import { EstoqueEmpty } from "@/components/EstoqueEmpty"
import { useEstoque } from "@/hooks/useEstoque"

export default function EstoqueSacoleiras() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroSacoleira, setFiltroSacoleira] = useState("todas")

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
    { id: 1, produto: "Blusa Feminina Básica", sacoleira: "Maria Silva", tipo: "entrega" as const, quantidade: 15, data: "2024-01-15" },
    { id: 2, produto: "Tênis Esportivo", sacoleira: "Maria Silva", tipo: "entrega" as const, quantidade: 10, data: "2024-01-15" },
    { id: 3, produto: "Moleton Básico", sacoleira: "Maria Silva", tipo: "entrega" as const, quantidade: 5, data: "2024-01-15" },
    { id: 4, produto: "Blusa Feminina Básica", sacoleira: "Maria Silva", tipo: "devolucao" as const, quantidade: 3, data: "2024-01-16" },
    { id: 5, produto: "Tênis Esportivo", sacoleira: "Maria Silva", tipo: "devolucao" as const, quantidade: 5, data: "2024-01-16" },
    { id: 6, produto: "Jaqueta de Couro", sacoleira: "Maria Silva", tipo: "entrega" as const, quantidade: 5, data: "2024-01-17" }
  ])

  const categorias = [...new Set(mockProdutos.map(p => p.categoria))]
  const { estoqueFiltered } = useEstoque(movimentacoes, mockProdutos, searchTerm, filtroCategoria === "todas" ? "" : filtroCategoria, filtroSacoleira === "todas" ? "" : filtroSacoleira)

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

      <EstoqueFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        filtroSacoleira={filtroSacoleira}
        setFiltroSacoleira={setFiltroSacoleira}
        categorias={categorias}
        sacoleiras={mockSacoleiras}
      />

      <div className="space-y-4">
        {estoqueFiltered.map(([sacoleira, produtos]) => (
          <EstoqueCard
            key={sacoleira}
            sacoleira={sacoleira}
            produtos={produtos}
            mockProdutos={mockProdutos}
          />
        ))}
      </div>

      {estoqueFiltered.length === 0 && (
        <EstoqueEmpty
          filtroSacoleira={filtroSacoleira === "todas" ? "" : filtroSacoleira}
          filtroCategoria={filtroCategoria === "todas" ? "" : filtroCategoria}
          searchTerm={searchTerm}
        />
      )}
    </div>
  )
}
