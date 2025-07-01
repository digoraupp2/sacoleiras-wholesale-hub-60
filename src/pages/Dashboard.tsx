
import { useState, useEffect } from "react"
import { MetricCard } from "@/components/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, TrendingUp, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

interface DashboardMetrics {
  total_produtos: number
  sacoleiras_ativas: number
  lancamentos_mes: number
  faturamento_mes: number
  produtos_em_falta: number
  pedidos_pendentes: number
}

interface SacoleiraMetrics {
  produtos_em_estoque: number
  lancamentos_mes: number
  faturamento_mes: number
  ultimo_lancamento: string
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
  const [sacoleiraMetrics, setSacoleiraMetrics] = useState<SacoleiraMetrics | null>(null)
  const [lancamentosRecentes, setLancamentosRecentes] = useState<LancamentoRecente[]>([])
  const [topSacoleiras, setTopSacoleiras] = useState<TopSacoleira[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { isAdmin, userProfile } = useAuth()

  useEffect(() => {
    if (isAdmin) {
      fetchAdminDashboardData()
    } else {
      fetchSacoleirasDashboardData()
    }
  }, [isAdmin, userProfile])

  const fetchAdminDashboardData = async () => {
    try {
      setLoading(true)
      
      // Buscar métricas do dashboard para admin
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

  const fetchSacoleirasDashboardData = async () => {
    try {
      setLoading(true)
      
      if (!userProfile?.sacoleira_relacionada) {
        console.log('Sacoleira relacionada não encontrada')
        setLoading(false)
        return
      }

      console.log('=== BUSCANDO DADOS DASHBOARD SACOLEIRA ===')
      console.log('Sacoleira ID:', userProfile.sacoleira_relacionada)

      // Buscar produtos em estoque da sacoleira
      const { data: estoqueData, error: estoqueError } = await supabase
        .from('estoque_sacoleiras')
        .select('quantidade_estoque')
        .eq('sacoleira_id', userProfile.sacoleira_relacionada)

      let produtosEmEstoque = 0
      if (estoqueError) {
        console.error('Erro ao buscar estoque:', estoqueError)
      } else {
        produtosEmEstoque = estoqueData?.reduce((total, item) => total + (item.quantidade_estoque || 0), 0) || 0
      }

      // Buscar lançamentos do mês da sacoleira
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)

      const { data: lancamentosData, error: lancamentosError } = await supabase
        .from('lancamentos')
        .select('valor_total, data_lancamento')
        .eq('sacoleira_id', userProfile.sacoleira_relacionada)
        .gte('data_lancamento', inicioMes.toISOString())

      let lancamentosMes = 0
      let faturamentoMes = 0
      if (lancamentosError) {
        console.error('Erro ao buscar lançamentos:', lancamentosError)
      } else {
        lancamentosMes = lancamentosData?.length || 0
        faturamentoMes = lancamentosData?.reduce((total, lanc) => total + Number(lanc.valor_total || 0), 0) || 0
      }

      // Buscar último lançamento
      const { data: ultimoLancamentoData, error: ultimoLancamentoError } = await supabase
        .from('lancamentos')
        .select('data_lancamento')
        .eq('sacoleira_id', userProfile.sacoleira_relacionada)
        .order('data_lancamento', { ascending: false })
        .limit(1)

      let ultimoLancamento = 'Nenhum lançamento'
      if (ultimoLancamentoError) {
        console.error('Erro ao buscar último lançamento:', ultimoLancamentoError)
      } else if (ultimoLancamentoData && ultimoLancamentoData.length > 0) {
        const data = new Date(ultimoLancamentoData[0].data_lancamento)
        ultimoLancamento = data.toLocaleDateString('pt-BR')
      }

      setSacoleiraMetrics({
        produtos_em_estoque: produtosEmEstoque,
        lancamentos_mes: lancamentosMes,
        faturamento_mes: faturamentoMes,
        ultimo_lancamento: ultimoLancamento
      })

      // Buscar lançamentos recentes da sacoleira
      const { data: lancamentosRecentesData, error: lancamentosRecentesError } = await supabase
        .from('lancamentos')
        .select(`
          tipo,
          quantidade,
          data_lancamento,
          produto_id,
          sacoleira_id
        `)
        .eq('sacoleira_id', userProfile.sacoleira_relacionada)
        .order('data_lancamento', { ascending: false })
        .limit(3)

      if (lancamentosRecentesError) {
        console.error('Erro ao buscar lançamentos recentes:', lancamentosRecentesError)
      } else if (lancamentosRecentesData && lancamentosRecentesData.length > 0) {
        // Buscar nomes dos produtos
        const produtoIds = lancamentosRecentesData.map(l => l.produto_id).filter(Boolean)
        const { data: produtosData } = await supabase
          .from('produtos')
          .select('id, nome')
          .in('id', produtoIds)

        const produtosMap = new Map((produtosData || []).map(p => [p.id, p.nome]))

        // Buscar nome da sacoleira
        const { data: sacoleiraData } = await supabase
          .from('sacoleiras')
          .select('nome')
          .eq('id', userProfile.sacoleira_relacionada)
          .single()

        const nomesSacoleira = sacoleiraData?.nome || 'Sacoleira'

        const lancamentosFormatados = lancamentosRecentesData.map(lanc => ({
          tipo: lanc.tipo || '',
          sacoleira: nomesSacoleira,
          produto: produtosMap.get(lanc.produto_id) || 'Produto não encontrado',
          quantidade: lanc.quantidade || 0,
          data_lancamento: lanc.data_lancamento || ''
        }))

        setLancamentosRecentes(lancamentosFormatados)
      }

    } catch (error) {
      console.error('Erro inesperado ao carregar dados da sacoleira:', error)
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

  const fallbackSacoleiraMetrics = {
    produtos_em_estoque: 0,
    lancamentos_mes: 0,
    faturamento_mes: 0,
    ultimo_lancamento: 'Nenhum lançamento'
  }

  const currentMetrics = metrics || fallbackMetrics
  const currentSacoleiraMetrics = sacoleiraMetrics || fallbackSacoleiraMetrics

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Visão geral do seu negócio de atacado" : "Suas informações e estatísticas"}
          </p>
        </div>
        <div className="text-center py-8">
          <p>Carregando dados do dashboard...</p>
        </div>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio de atacado</p>
        </div>

        {/* Métricas principais para Admin */}
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

        {/* Cards de atividades recentes para Admin */}
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

  // Dashboard para Sacoleira
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu Dashboard</h1>
        <p className="text-muted-foreground">Suas informações e estatísticas pessoais</p>
      </div>

      {/* Métricas para Sacoleira */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Produtos em Estoque"
          value={currentSacoleiraMetrics.produtos_em_estoque}
          icon={Package}
          color="accent"
        />
        <MetricCard
          title="Lançamentos (Mês)"
          value={currentSacoleiraMetrics.lancamentos_mes}
          icon={TrendingUp}
        />
        <MetricCard
          title="Faturamento (Mês)"
          value={`R$ ${Number(currentSacoleiraMetrics.faturamento_mes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="accent"
        />
        <MetricCard
          title="Último Lançamento"
          value={currentSacoleiraMetrics.ultimo_lancamento}
          icon={AlertTriangle}
        />
      </div>

      {/* Card de lançamentos recentes para Sacoleira */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meus Lançamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lancamentosRecentes.length > 0 ? (
                lancamentosRecentes.map((lanc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {lanc.tipo === 'entrega' ? 'Entrega' : 'Devolução'} - {lanc.produto}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(lanc.data_lancamento).toLocaleDateString('pt-BR')}
                      </p>
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
      </div>
    </div>
  )
}
