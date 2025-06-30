
import { MetricCard } from "@/components/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, TrendingUp, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react"

export default function Dashboard() {
  const mockData = {
    totalProdutos: 1248,
    sacoleirasAtivas: 34,
    lancamentosMes: 856,
    faturamentoMes: 'R$ 45.230',
    produtosEmFalta: 12,
    pedidosPendentes: 8
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
          value={mockData.totalProdutos}
          icon={Package}
          trend={{ value: "+12% este mês", isPositive: true }}
        />
        <MetricCard
          title="Sacoleiras Ativas"
          value={mockData.sacoleirasAtivas}
          icon={Users}
          trend={{ value: "+3 novas", isPositive: true }}
          color="accent"
        />
        <MetricCard
          title="Lançamentos (Mês)"
          value={mockData.lancamentosMes}
          icon={TrendingUp}
          trend={{ value: "+8% vs mês anterior", isPositive: true }}
        />
        <MetricCard
          title="Faturamento (Mês)"
          value={mockData.faturamentoMes}
          icon={DollarSign}
          trend={{ value: "+15%", isPositive: true }}
          color="accent"
        />
        <MetricCard
          title="Produtos em Falta"
          value={mockData.produtosEmFalta}
          icon={AlertTriangle}
          color="destructive"
        />
        <MetricCard
          title="Pedidos Pendentes"
          value={mockData.pedidosPendentes}
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
              {[
                { tipo: "Entrega", sacoleira: "Maria Silva", produto: "Blusa Feminina", qtd: 10 },
                { tipo: "Venda", sacoleira: "Ana Costa", produto: "Calça Jeans", qtd: 5 },
                { tipo: "Devolução", sacoleira: "João Santos", produto: "Vestido Floral", qtd: 2 },
              ].map((lanc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{lanc.tipo} - {lanc.sacoleira}</p>
                    <p className="text-sm text-muted-foreground">{lanc.produto}</p>
                  </div>
                  <span className="font-bold">{lanc.qtd} un.</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Sacoleiras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nome: "Maria Silva", vendas: "R$ 8.450", produtos: 45 },
                { nome: "Ana Costa", vendas: "R$ 6.230", produtos: 32 },
                { nome: "Carla Oliveira", vendas: "R$ 5.890", produtos: 28 },
              ].map((sacoleira, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{sacoleira.nome}</p>
                    <p className="text-sm text-muted-foreground">{sacoleira.produtos} produtos</p>
                  </div>
                  <span className="font-bold text-accent">{sacoleira.vendas}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
