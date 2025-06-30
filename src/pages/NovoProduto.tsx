
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, X, Check } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

export default function NovoProduto() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    precoCusto: "",
    precoVenda: "",
    estoque: "",
    status: "ativo"
  })
  const [fotos, setFotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categorias = [
    { id: 1, nome: "Roupas Femininas" },
    { id: 2, nome: "Roupas Masculinas" },
    { id: 3, nome: "Calçados" },
    { id: 4, nome: "Acessórios" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validações
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome do produto é obrigatório.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.categoria) {
      toast({
        title: "Erro",
        description: "Categoria é obrigatória.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.precoCusto || parseFloat(formData.precoCusto) <= 0) {
      toast({
        title: "Erro",
        description: "Preço de custo deve ser maior que zero.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.precoVenda || parseFloat(formData.precoVenda) <= 0) {
      toast({
        title: "Erro",
        description: "Preço de venda deve ser maior que zero.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.estoque || parseInt(formData.estoque) < 0) {
      toast({
        title: "Erro",
        description: "Quantidade em estoque deve ser maior ou igual a zero.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simular salvamento (aqui seria a integração com banco de dados)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Produto salvo:", {
        ...formData,
        fotos,
        precoCusto: parseFloat(formData.precoCusto),
        precoVenda: parseFloat(formData.precoVenda),
        estoque: parseInt(formData.estoque)
      })

      toast({
        title: "Produto criado com sucesso!",
        description: `O produto "${formData.nome}" foi adicionado ao catálogo.`,
      })

      navigate("/produtos")
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro ao salvar o produto. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target?.result) {
              setFotos(prev => [...prev, e.target!.result as string])
            }
          }
          reader.readAsDataURL(file)
        } else {
          toast({
            title: "Arquivo inválido",
            description: "Por favor, selecione apenas arquivos de imagem.",
            variant: "destructive"
          })
        }
      })
    }
  }

  const removeImage = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/produtos">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Produto</h1>
          <p className="text-muted-foreground">Adicione um novo produto ao seu catálogo</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: Blusa Feminina Básica"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <select
                  id="categoria"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="precoCusto">Preço de Custo *</Label>
                <Input
                  id="precoCusto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoCusto}
                  onChange={(e) => handleInputChange('precoCusto', e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precoVenda">Preço de Venda *</Label>
                <Input
                  id="precoVenda"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoVenda}
                  onChange={(e) => handleInputChange('precoVenda', e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estoque">Quantidade em Estoque *</Label>
                <Input
                  id="estoque"
                  type="number"
                  min="0"
                  value={formData.estoque}
                  onChange={(e) => handleInputChange('estoque', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descreva o produto..."
                rows={3}
              />
            </div>

            {/* Upload de Fotos */}
            <div className="space-y-4">
              <Label>Fotos do Produto</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Clique para fazer upload ou arraste as imagens aqui
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="upload-images"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('upload-images')?.click()}>
                    Selecionar Imagens
                  </Button>
                </div>
              </div>

              {/* Preview das fotos */}
              {fotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fotos.map((foto, index) => (
                    <div key={index} className="relative">
                      <img
                        src={foto}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-6 h-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Salvar Produto
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/produtos">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
