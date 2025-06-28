
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MovimentacaoFormProps {
  onSubmit: (movimentacao: any) => void
  onCancel: () => void
  produtos: any[]
  sacoleiras: any[]
}

export function MovimentacaoForm({ onSubmit, onCancel, produtos, sacoleiras }: MovimentacaoFormProps) {
  const [formData, setFormData] = useState({
    produto: "",
    sacoleira: "",
    tipo: "",
    quantidade: "",
    observacoes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      quantidade: parseInt(formData.quantidade),
      data: new Date().toISOString(),
      id: Date.now()
    })
    setFormData({ produto: "", sacoleira: "", tipo: "", quantidade: "", observacoes: "" })
  }

  const produtoSelecionado = produtos.find(p => p.nome === formData.produto)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Movimentação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Movimentação *</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrega">Entrega</SelectItem>
                  <SelectItem value="devolucao">Devolução</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sacoleira">Sacoleira *</Label>
              <Select value={formData.sacoleira} onValueChange={(value) => setFormData({...formData, sacoleira: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma sacoleira" />
                </SelectTrigger>
                <SelectContent>
                  {sacoleiras.map(sacoleira => (
                    <SelectItem key={sacoleira.id} value={sacoleira.nome}>{sacoleira.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="produto">Produto *</Label>
              <Select value={formData.produto} onValueChange={(value) => setFormData({...formData, produto: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map(produto => (
                    <SelectItem key={produto.id} value={produto.nome}>{produto.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                placeholder="0"
                required
              />
            </div>

            {produtoSelecionado && (
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input
                  value={produtoSelecionado.categoria}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}

            {produtoSelecionado && formData.quantidade && (
              <div className="space-y-2">
                <Label>Valor Total</Label>
                <Input
                  value={`R$ ${(produtoSelecionado.precoVenda * parseInt(formData.quantidade)).toFixed(2)}`}
                  readOnly
                  className="bg-gray-50 font-bold"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <textarea
              id="observacoes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações sobre a movimentação..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Salvar Movimentação</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
