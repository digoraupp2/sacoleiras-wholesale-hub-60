
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface Produto {
  id: string
  nome: string
  categoria: string
  precoVenda: number
}

interface Sacoleira {
  id: string
  nome: string
}

interface MovimentacaoFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  produtos: Produto[]
  sacoleiras: Sacoleira[]
}

export function MovimentacaoForm({ onSubmit, onCancel, produtos, sacoleiras }: MovimentacaoFormProps) {
  const [produtoId, setProdutoId] = useState("")
  const [sacoleiraId, setSacoleiraId] = useState("")
  const [tipo, setTipo] = useState("")
  const [quantidade, setQuantidade] = useState("")

  const produtoSelecionado = produtos.find(p => p.id === produtoId)
  const sacoleiraSelecionada = sacoleiras.find(s => s.id === sacoleiraId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!produtoSelecionado || !sacoleiraSelecionada || !tipo || !quantidade) {
      return
    }

    const novaMovimentacao = {
      id: Date.now(),
      produto: produtoSelecionado.nome,
      sacoleira: sacoleiraSelecionada.nome,
      tipo,
      quantidade: parseInt(quantidade),
      data: new Date().toISOString().split('T')[0]
    }

    onSubmit(novaMovimentacao)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Nova Movimentação</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Select value={produtoId} onValueChange={setProdutoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map(produto => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sacoleira">Sacoleira</Label>
              <Select value={sacoleiraId} onValueChange={setSacoleiraId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma sacoleira" />
                </SelectTrigger>
                <SelectContent>
                  {sacoleiras.map(sacoleira => (
                    <SelectItem key={sacoleira.id} value={sacoleira.id}>
                      {sacoleira.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Movimentação</Label>
              <Select value={tipo} onValueChange={setTipo}>
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
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Digite a quantidade"
              />
            </div>
          </div>

          {produtoSelecionado && tipo && quantidade && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Resumo da Movimentação</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Produto: {produtoSelecionado.nome}</div>
                <div>Sacoleira: {sacoleiraSelecionada?.nome}</div>
                <div>Tipo: {tipo === 'entrega' ? 'Entrega' : 'Devolução'}</div>
                <div>Quantidade: {quantidade} un.</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Registrar Movimentação</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
