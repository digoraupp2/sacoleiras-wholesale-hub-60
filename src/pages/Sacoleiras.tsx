
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { SacoleiraCard } from "@/components/SacoleiraCard"
import { supabase } from "@/integrations/supabase/client"

interface Sacoleira {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco: string
  status: string
  produtosEmPosse: number
  valorEmPosse: number
  ultimaMovimentacao: string
}

export default function Sacoleiras() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sacoleiras, setSacoleiras] = useState<Sacoleira[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSacoleiras()
  }, [])

  const fetchSacoleiras = async () => {
    try {
      const { data, error } = await supabase
        .from('sacoleiras')
        .select('*')
        .order('nome')

      if (error) {
        console.error('Erro ao buscar sacoleiras:', error)
        return
      }

      // Para cada sacoleira, buscar informações de estoque
      const sacoleirasWithEstoque = await Promise.all(
        (data || []).map(async (sacoleira) => {
          const { data: estoque } = await supabase
            .from('estoque_sacoleiras')
            .select('quantidade_estoque, valor_estoque')
            .eq('sacoleira_id', sacoleira.id)

          const { data: ultimaMovimentacao } = await supabase
            .from('movimentacoes')
            .select('data_movimentacao')
            .eq('sacoleira_id', sacoleira.id)
            .order('data_movimentacao', { ascending: false })
            .limit(1)

          const totalProdutos = estoque?.reduce((sum, item) => sum + item.quantidade_estoque, 0) || 0
          const totalValor = estoque?.reduce((sum, item) => sum + item.valor_estoque, 0) || 0

          return {
            id: sacoleira.id,
            nome: sacoleira.nome,
            cpf: "000.000.000-00", // Valor padrão já que não existe na tabela
            telefone: sacoleira.telefone || "Não informado",
            email: "email@exemplo.com", // Valor padrão já que não existe na tabela
            endereco: sacoleira.endereco || "Não informado",
            status: totalProdutos > 0 ? "ativa" : "inativa",
            produtosEmPosse: totalProdutos,
            valorEmPosse: totalValor,
            ultimaMovimentacao: ultimaMovimentacao?.[0]?.data_movimentacao || "Nunca"
          }
        })
      )

      setSacoleiras(sacoleirasWithEstoque)
    } catch (error) {
      console.error('Erro ao buscar sacoleiras:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSacoleiras = sacoleiras.filter(sacoleira =>
    sacoleira.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sacoleira.cpf.includes(searchTerm) ||
    sacoleira.telefone.includes(searchTerm)
  )

  const handleUpdateSacoleira = (updatedSacoleira: Sacoleira) => {
    setSacoleiras(prev => 
      prev.map(sacoleira => 
        sacoleira.id === updatedSacoleira.id ? updatedSacoleira : sacoleira
      )
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sacoleiras</h1>
            <p className="text-muted-foreground">Gerencie suas parceiras de vendas</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p>Carregando sacoleiras...</p>
        </div>
      </div>
    )
  }

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
          <SacoleiraCard
            key={sacoleira.id}
            sacoleira={sacoleira}
            onUpdate={handleUpdateSacoleira}
          />
        ))}
      </div>

      {filteredSacoleiras.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma sacoleira encontrada</p>
        </div>
      )}
    </div>
  )
}
