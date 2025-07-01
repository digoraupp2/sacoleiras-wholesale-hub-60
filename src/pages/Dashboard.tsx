
import { useState, useEffect } from "react"
import { MetricCard } from "@/components/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, TrendingUp, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DashboardMetrics {
  total_produtos: number
  sacoleiras_ativas: number
  lancamentos_mes: number
  faturamento_mes: number
  produtos_em_falta: number
  pedidos_pendentes: number
}

interface LancamentoRecente {
  tipo: string
  sacoleira: string
  produto: string
  quantidade: number
  data_lancamento: string
}

interface TopSacoleira {
  nome: string
  total_produtos: number
  total_vendas: number
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [lancamentosRecentes, setLancamentosRecentes] = useState<LancamentoRecente[]>([])
  const [topSacoleiras, setTopSacoleiras] = useState<TopSacoleira[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Buscar métricas do dashboard
      const { data: metricsData, error: metricsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single()

      if (metricsError) {
        console.error('Erro ao buscar métricas:', metricsError)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as métricas do dashboard.",
          variant: "destructive"
        })
      } else {
        setMetrics(metricsData)
      }

      // Buscar lançamentos recentes
      const { data: lancamentosData, error: lancamentosError } = await supabase
        .from('lancamentos_recentes')
        .select('*')
        .limit(3)

      if (lancamentosError) {
        console.error('Erro ao buscar lançamentos recentes:', lancamentosError)
      } else {
        setLancamentosRecentes(lancamentosData || [])
      }

      // Buscar top sacoleiras
      const { data: topSacoleirasData, error: topSacoleirasError } = await supabase
        .from('top_sacoleiras')
        .select('*')
        .limit(3)

      if (topSacoleirasError) {
        console.error('Erro ao buscar top sacoleiras:', topSacoleirasError)
      } else {
        setTopSacoleiras(topSacoleirasData || [])
      }

    } catch (error) {
      console.error('Erro inesperado:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dados do dashboard.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Dados de fallback caso não consiga carregar do banco
  const fallbackMetrics = {
    total_produtos: 0,
    sacoleiras_ativas: 0,
    lancamentos_mes: 0,
    faturamento_mes: 0,
    produtos_em_falta: 0,
    pedidos_pendentes: 0
  }

  const currentMetrics = metrics || fallbackMetrics

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio de atacado</p>
        </div>
        <div className="text-center py-8">
          <p>Carregando dados do dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio de atacado</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total de Produtos"
          value={currentMetrics.total_produtos}
          icon={Package}
          trend={{ value: "+12% este mês", isPositive: true }}
        />
        <MetricCard
          title="Sacoleiras Ativas"
          value={currentMetrics.sacoleiras_ativas}
          icon={Users}
          trend={{ value: "+3 novas", isPositive: true }}
          color="accent"
        />
        <MetricCard
          title="Lançamentos (Mês)"
          value={currentMetrics.lancamentos_mes}
          icon={TrendingUp}
          trend={{ value: "+8% vs mês anterior", isPositive: true }}
        />
        <MetricCard
          title="Faturamento (Mês)"
          value={`R$ ${Number(currentMetrics.faturamento_mes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={{ value: "+15%", isPositive: true }}
          color="accent"
        />
        <MetricCard
          title="Produtos em Falta"
          value={currentMetrics.produtos_em_falta}
          icon={AlertTriangle}
          color="destructive"
        />
        <MetricCard
          title="Pedidos Pendentes"
          value={currentMetrics.pedidos_pendentes}
          icon={ShoppingCart}
        />
      </div>

      {/* Cards de atividades recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lançamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lancamentosRecentes.length > 0 ? (
                lancamentosRecentes.map((lanc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {lanc.tipo === 'entrega' ? 'Entrega' : 'Devolução'} - {lanc.sacoleira}
                      </p>
                      <p className="text-sm text-muted-foreground">{lanc.produto}</p>
                    </div>
                    <span className="font-bold">{lanc.quantidade} un.</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Nenhum lançamento recente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Sacoleiras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSacoleiras.length > 0 ? (
                topSacoleiras.map((sacoleira, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{sacoleira.nome}</p>
                      <p className="text-sm text-muted-foreground">{sacoleira.total_produtos} produtos</p>
                    </div>
                    <span className="font-bold text-accent">
                      R$ {Number(sacoleira.total_vendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Nenhuma sacoleira encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
