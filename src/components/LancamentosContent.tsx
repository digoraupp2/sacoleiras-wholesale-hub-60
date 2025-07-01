
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
  id: string
  produto: string
  produto_id: string
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
    fetchLancamentos()
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

  const fetchLancamentos = async () => {
    try {
      console.log("Buscando lançamentos do banco de dados...")
      
      const { data, error } = await supabase
        .from('lancamentos')
        .select(`
          id,
          tipo,
          quantidade,
          valor_unitario,
          valor_total,
          observacoes,
          data_lancamento,
          produtos (
            id,
            nome,
            categorias (nome)
          ),
          sacoleiras (
            id,
            nome
          )
        `)
        .order('data_lancamento', { ascending: false })

      if (error) {
        console.error('Erro ao buscar lançamentos:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os lançamentos.",
          variant: "destructive"
        })
        return
      }

      console.log("Lançamentos encontrados:", data?.length || 0)
      
      // Transformar dados para o formato esperado
      const lancamentosFormatados = data?.map(lancamento => ({
        id: lancamento.id,
        produto: lancamento.produtos?.nome || 'Produto não encontrado',
        produto_id: lancamento.produtos?.id || '',
        valor: lancamento.valor_unitario,
        quantidade: lancamento.quantidade,
        categoria: lancamento.produtos?.categorias?.nome || 'Sem categoria',
        sacoleira: lancamento.sacoleiras?.nome || 'Sacoleira não encontrada',
        sacoleira_id: lancamento.sacoleiras?.id || '',
        data: lancamento.data_lancamento.split('T')[0],
        total: lancamento.valor_total,
        observacoes: lancamento.observacoes || '',
        tipo: lancamento.tipo
      })) || []
      
      setLancamentos(lancamentosFormatados)
    } catch (error) {
      console.error('Erro inesperado ao buscar lançamentos:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar lançamentos.",
        variant: "destructive"
      })
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

  const handleSubmit = async (formData: any) => {
    try {
      console.log("Criando novo lançamento:", formData)
      
      // Salvar no banco de dados
      const { data, error } = await supabase
        .from('lancamentos')
        .insert([{
          produto_id: formData.produto_id,
          sacoleira_id: formData.sacoleira_id,
          tipo: formData.tipo,
          quantidade: formData.quantidade,
          valor_unitario: formData.valor_unitario,
          valor_total: formData.valor_total,
          observacoes: formData.observacoes || null,
          data_lancamento: formData.data_lancamento
        }])
        .select(`
          id,
          tipo,
          quantidade,
          valor_unitario,
          valor_total,
          observacoes,
          data_lancamento,
          produtos (
            id,
            nome,
            categorias (nome)
          ),
          sacoleiras (
            id,
            nome
          )
        `)
        .single()

      if (error) {
        console.error('Erro ao salvar lançamento:', error)
        toast({
          title: "Erro ao criar lançamento",
          description: "Não foi possível salvar o lançamento. Tente novamente.",
          variant: "destructive",
        })
        return
      }

      console.log("Lançamento salvo com sucesso:", data)
      
      // Adicionar o novo lançamento à lista local
      const novoLancamento: Lancamento = {
        id: data.id,
        produto: data.produtos?.nome || '',
        produto_id: data.produtos?.id || '',
        valor: data.valor_unitario,
        quantidade: data.quantidade,
        categoria: data.produtos?.categorias?.nome || 'Sem categoria',
        sacoleira: data.sacoleiras?.nome || '',
        sacoleira_id: data.sacoleiras?.id || '',
        data: data.data_lancamento.split('T')[0],
        total: data.valor_total,
        observacoes: data.observacoes || '',
        tipo: data.tipo
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
