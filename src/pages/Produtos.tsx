
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Package, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Produto {
  id: number
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
  const { toast } = useToast()
  
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: 1,
      nome: "Blusa Feminina Básica",
      categoria: "Roupas Femininas",
      precoCusto: 15.00,
      precoVenda: 35.00,
      estoque: 120,
      status: "ativo",
      foto: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      nome: "Calça Jeans Masculina",
      categoria: "Roupas Masculinas", 
      precoCusto: 45.00,
      precoVenda: 89.90,
      estoque: 85,
      status: "ativo",
      foto: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      nome: "Vestido Floral",
      categoria: "Roupas Femininas",
      precoCusto: 28.00,
      precoVenda: 59.90,
      estoque: 5,
      status: "ativo",
      foto: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop"
    }
  ])

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (produto: Produto) => {
    console.log("Editando produto:", produto)
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Edição do produto ${produto.nome} será implementada em breve.`,
    })
  }

  const handleEstoque = (produto: Produto) => {
    console.log("Gerenciando estoque do produto:", produto)
    toast({
      title: "Estoque atualizado",
      description: `Estoque do produto ${produto.nome} foi consultado.`,
    })
  }

  const handleDelete = (produto: Produto) => {
    setProdutos(prev => prev.filter(p => p.id !== produto.id))
    toast({
      title: "Produto excluído",
      description: `O produto ${produto.nome} foi removido com sucesso.`,
      variant: "destructive"
    })
  }

  const handleStatusToggle = (produto: Produto) => {
    const newStatus = produto.status === "ativo" ? "inativo" : "ativo"
    setProdutos(prev => prev.map(p => 
      p.id === produto.id ? { ...p, status: newStatus } : p
    ))
    toast({
      title: "Status atualizado",
      description: `Produto ${produto.nome} está agora ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/produtos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
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
                      className="cursor-pointer"
                      onClick={() => handleStatusToggle(produto)}
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(produto)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEstoque(produto)}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Estoque
                  </Button>
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
            {!searchTerm && (
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
