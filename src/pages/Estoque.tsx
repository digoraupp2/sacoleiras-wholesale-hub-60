
import { useEstoqueData } from "@/hooks/useEstoqueData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Estoque() {
  const { estoque, loading, error } = useEstoqueData()

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (estoque.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum estoque encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Não há produtos em estoque no momento.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estoque das Sacoleiras</h1>
        <p className="text-muted-foreground">
          Visualize o estoque de produtos por sacoleira
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {estoque.map((item) => (
          <Card key={`${item.sacoleira_id}-${item.produto_id}`} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{item.produto_nome}</CardTitle>
              <CardDescription className="text-sm font-medium text-primary">
                {item.sacoleira_nome}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Quantidade:</span>
                <Badge variant={item.quantidade_estoque > 5 ? "default" : "destructive"}>
                  {item.quantidade_estoque} unidades
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Preço Base:</span>
                <span className="font-medium">
                  R$ {item.preco_base.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor Total:</span>
                <span className="font-bold text-lg">
                  R$ {item.valor_estoque.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Resumo do Estoque</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total de Itens:</span>
            <div className="font-semibold">{estoque.length} itens diferentes</div>
          </div>
          <div>
            <span className="text-muted-foreground">Quantidade Total:</span>
            <div className="font-semibold">
              {estoque.reduce((sum, item) => sum + item.quantidade_estoque, 0)} unidades
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Valor Total:</span>
            <div className="font-semibold">
              R$ {estoque.reduce((sum, item) => sum + item.valor_estoque, 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
