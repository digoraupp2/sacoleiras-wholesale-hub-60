
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Package, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useProdutosData } from "@/hooks/useProdutosData"
import { useAuth } from "@/contexts/AuthContext"

interface Produto {
  id: string
  nome: string
  categoria: string
  precoCusto: number
  precoVenda: number
  estoque: number
  status: string
  foto: string
}

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState("")
  const { produtos, loading, deleteProduto } = useProdutosData()
  const { toast } = useToast()
  const { isAdmin } = useAuth()

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (produto: any) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para editar produtos.",
        variant: "destructive"
      })
      return
    }
    console.log("Editando produto:", produto)
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Edição do produto ${produto.nome} será implementada em breve.`,
    })
  }

  const handleEstoque = (produto: any) => {
    console.log("Gerenciando estoque do produto:", produto)
    toast({
      title: "Estoque atualizado",
      description: `Estoque do produto ${produto.nome} foi consultado.`,
    })
  }

  const handleDelete = async (produto: any) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para excluir produtos.",
        variant: "destructive"
      })
      return
    }
    const success = await deleteProduto(produto.id)
    if (success) {
      toast({
        title: "Produto excluído",
        description: `O produto ${produto.nome} foi removido com sucesso.`,
        variant: "destructive"
      })
    }
  }

  const handleStatusToggle = (produto: any) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para alterar o status dos produtos.",
        variant: "destructive"
      })
      return
    }
    // Esta funcionalidade precisa ser implementada no backend
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Alteração de status será implementada em breve.`,
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-8">
          <p>Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
        </div>
        {isAdmin && (
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/produtos/novo">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Link>
          </Button>
        )}
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
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProdutos.map((produto) => (
          <Card key={produto.id} className="product-card">
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={produto.foto} 
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{produto.nome}</h3>
                  <div className="flex gap-2">
                    <Badge 
                      variant={produto.status === "ativo" ? "default" : "secondary"}
                      className={isAdmin ? "cursor-pointer" : ""}
                      onClick={isAdmin ? () => handleStatusToggle(produto) : undefined}
                    >
                      {produto.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{produto.categoria}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Custo: R$ {produto.precoCusto.toFixed(2)}</p>
                    <p className="font-bold text-accent">Venda: R$ {produto.precoVenda.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Estoque</p>
                    <p className={`font-bold ${produto.estoque < 10 ? 'text-destructive' : 'text-foreground'}`}>
                      {produto.estoque} un.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(produto)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEstoque(produto)}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Estoque
                  </Button>
                  {isAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o produto "{produto.nome}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(produto)} className="bg-destructive hover:bg-destructive/90">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente alterar os filtros de busca.' : 'Comece adicionando seu primeiro produto.'}
            </p>
            {!searchTerm && isAdmin && (
              <Button asChild>
                <Link to="/produtos/novo">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
