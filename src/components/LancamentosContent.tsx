
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LancamentoForm } from "@/components/LancamentoForm"
import { LancamentoFilters } from "@/components/LancamentoFilters"
import { LancamentoCard } from "@/components/LancamentoCard"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

interface Lancamento {
  id: number
  produto: string
  valor: number
  quantidade: number
  categoria: string
  sacoleira: string
  sacoleira_id: string
  data: string
  total: number
  observacoes?: string
  tipo?: string
}

interface LancamentosContentProps {
  lancamentos: Lancamento[]
  setLancamentos: React.Dispatch<React.SetStateAction<Lancamento[]>>
}

export function LancamentosContent({ lancamentos, setLancamentos }: LancamentosContentProps) {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const { userProfile, isAdmin } = useAuth()
  const { toast } = useToast()

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

  // Filtrar lançamentos baseado no tipo de usuário
  let lancamentosParaExibir = lancamentos;
  
  // Se não for admin, mostrar apenas os lançamentos da própria sacoleira
  if (!isAdmin && userProfile?.sacoleira_relacionada) {
    lancamentosParaExibir = lancamentos.filter(
      lancamento => lancamento.sacoleira_id === userProfile.sacoleira_relacionada
    )
  }

  const filteredLancamentos = lancamentosParaExibir.filter(lancamento => {
    const matchesSearch = lancamento.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lancamento.sacoleira.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filtroCategoria === "todas" || lancamento.categoria === filtroCategoria
    return matchesSearch && matchesCategoria
  })

  const handleSubmit = (formData: any) => {
    try {
      console.log("Novo lançamento:", formData)
      
      // Adicionar o novo lançamento à lista
      const novoLancamento: Lancamento = {
        ...formData,
        id: Date.now() // Gerar um ID único baseado no timestamp
      }
      
      setLancamentos(prev => [novoLancamento, ...prev])
      setShowForm(false)
      
      const tipoTexto = formData.tipo === 'entrega' ? 'entregue' : 'devolvido'
      
      toast({
        title: "Lançamento criado com sucesso!",
        description: `${formData.produto} foi ${tipoTexto} para ${formData.sacoleira}`,
      })
    } catch (error) {
      console.error("Erro ao criar lançamento:", error)
      toast({
        title: "Erro ao criar lançamento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lançamentos</h2>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Registre os produtos entregues às sacoleiras" 
              : "Seus lançamentos de produtos"
            }
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lançamento
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
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
        {filteredLancamentos.length > 0 ? (
          filteredLancamentos.map((lancamento) => (
            <LancamentoCard key={lancamento.id} lancamento={lancamento} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {!isAdmin ? "Nenhum lançamento encontrado para você." : "Nenhum lançamento encontrado."}
          </div>
        )}
      </div>
    </div>
  )
}
