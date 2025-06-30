
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Tag, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Categoria {
  id: number
  nome: string
  descricao: string
  status: string
  produtosCount: number
}

export default function Categorias() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    status: "ativa"
  })
  const { toast } = useToast()
  
  const [categorias, setCategorias] = useState<Categoria[]>([
    {
      id: 1,
      nome: "Roupas Femininas",
      descricao: "Blusas, vestidos, saias e acessórios femininos",
      status: "ativa",
      produtosCount: 45
    },
    {
      id: 2,
      nome: "Roupas Masculinas", 
      descricao: "Camisas, calças, bermudas masculinas",
      status: "ativa",
      produtosCount: 32
    },
    {
      id: 3,
      nome: "Calçados",
      descricao: "Sapatos, tênis, sandálias",
      status: "ativa",
      produtosCount: 28
    },
    {
      id: 4,
      nome: "Acessórios",
      descricao: "Bolsas, cintos, bijuterias",
      status: "inativa",
      produtosCount: 15
    }
  ])

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório.",
        variant: "destructive"
      })
      return
    }

    if (editingCategory) {
      // Editando categoria existente
      setCategorias(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, nome: formData.nome, descricao: formData.descricao, status: formData.status }
          : cat
      ))
      toast({
        title: "Categoria atualizada",
        description: `A categoria "${formData.nome}" foi atualizada com sucesso.`,
      })
    } else {
      // Criando nova categoria
      const newCategory: Categoria = {
        id: Date.now(),
        nome: formData.nome,
        descricao: formData.descricao,
        status: formData.status,
        produtosCount: 0
      }
      setCategorias(prev => [...prev, newCategory])
      toast({
        title: "Categoria criada",
        description: `A categoria "${formData.nome}" foi criada com sucesso.`,
      })
    }

    setShowForm(false)
    setEditingCategory(null)
    setFormData({ nome: "", descricao: "", status: "ativa" })
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategory(categoria)
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao,
      status: categoria.status
    })
    setShowForm(true)
  }

  const handleDelete = (categoria: Categoria) => {
    if (categoria.produtosCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: `A categoria "${categoria.nome}" possui ${categoria.produtosCount} produtos associados.`,
        variant: "destructive"
      })
      return
    }

    setCategorias(prev => prev.filter(cat => cat.id !== categoria.id))
    toast({
      title: "Categoria excluída",
      description: `A categoria "${categoria.nome}" foi removida com sucesso.`,
      variant: "destructive"
    })
  }

  const handleStatusToggle = (categoria: Categoria) => {
    const newStatus = categoria.status === "ativa" ? "inativa" : "ativa"
    setCategorias(prev => prev.map(cat => 
      cat.id === categoria.id ? { ...cat, status: newStatus } : cat
    ))
    toast({
      title: "Status atualizado",
      description: `Categoria "${categoria.nome}" está agora ${newStatus}.`,
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCategory(null)
    setFormData({ nome: "", descricao: "", status: "ativa" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">Organize seus produtos por categoria</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Formulário de categoria */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Categoria *</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Roupas Femininas"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva os tipos de produtos desta categoria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Check className="w-4 h-4 mr-2" />
                  {editingCategory ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategorias.map((categoria) => (
          <Card key={categoria.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Tag className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{categoria.nome}</h3>
                    <p className="text-sm text-muted-foreground">{categoria.produtosCount} produtos</p>
                  </div>
                </div>
                <Badge 
                  variant={categoria.status === "ativa" ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => handleStatusToggle(categoria)}
                >
                  {categoria.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{categoria.descricao}</p>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(categoria)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a categoria "{categoria.nome}"? 
                        {categoria.produtosCount > 0 && (
                          <span className="text-destructive block mt-2">
                            Esta categoria possui {categoria.produtosCount} produtos associados e não pode ser excluída.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(categoria)} 
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={categoria.produtosCount > 0}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategorias.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma categoria encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente alterar os filtros de busca.' : 'Comece criando sua primeira categoria.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Categoria
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
