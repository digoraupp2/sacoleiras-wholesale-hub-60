
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LancamentoForm } from "@/components/LancamentoForm"
import { LancamentoFilters } from "@/components/LancamentoFilters"
import { LancamentoCard } from "@/components/LancamentoCard"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

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

interface Produto {
  id: string
  nome: string
  preco_base: number
  categoria: string
}

interface Sacoleira {
  id: string
  nome: string
}

interface LancamentosContentProps {
  lancamentos: Lancamento[]
  setLancamentos: React.Dispatch<React.SetStateAction<Lancamento[]>>
}

export function LancamentosContent({ lancamentos, setLancamentos }: LancamentosContentProps) {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [sacoleiras, setSacoleiras] = useState<Sacoleira[]>([])
  const [loading, setLoading] = useState(true)
  const { userProfile, isAdmin } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Buscar produtos
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          preco_base,
          categorias (nome)
        `)
        .order('nome')

      if (produtosError) {
        console.error('Erro ao buscar produtos:', produtosError)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos.",
          variant: "destructive"
        })
      } else {
        const produtosFormatados = produtosData?.map(produto => ({
          id: produto.id,
          nome: produto.nome,
          preco_base: produto.preco_base,
          categoria: produto.categorias?.nome || 'Sem categoria'
        })) || []
        setProdutos(produtosFormatados)
      }

      // Buscar sacoleiras
      const { data: sacoleirasData, error: sacoleirasError } = await supabase
        .from('sacoleiras')
        .select('id, nome')
        .order('nome')

      if (sacoleirasError) {
        console.error('Erro ao buscar sacoleiras:', sacoleirasError)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as sacoleiras.",
          variant: "destructive"
        })
      } else {
        console.log('Sacoleiras carregadas:', sacoleirasData?.length || 0)
        setSacoleiras(sacoleirasData || [])
      }

    } catch (error) {
      console.error('Erro inesperado ao carregar dados:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dados.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const categorias = [...new Set(produtos.map(p => p.categoria))]

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-8">
          <p>Carregando dados...</p>
        </div>
      </div>
    )
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
          produtos={produtos}
          sacoleiras={sacoleiras}
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
