
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface Produto {
  id: number
  nome: string
  preco: number
  categoria: string
}

interface Sacoleira {
  id: number
  nome: string
}

interface LancamentoFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  produtos: Produto[]
  sacoleiras: Sacoleira[]
}

export function LancamentoForm({ onSubmit, onCancel, produtos, sacoleiras }: LancamentoFormProps) {
  const [produtoId, setProdutoId] = useState("")
  const [sacoleiraId, setSacoleiraId] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [observacoes, setObservacoes] = useState("")

  const produtoSelecionado = produtos.find(p => p.id.toString() === produtoId)
  const sacoleiraSelecionada = sacoleiras.find(s => s.id.toString() === sacoleiraId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!produtoSelecionado || !sacoleiraSelecionada || !quantidade) {
      return
    }

    const novoLancamento = {
      id: Date.now(),
      produto: produtoSelecionado.nome,
      valor: produtoSelecionado.preco,
      quantidade: parseInt(quantidade),
      categoria: produtoSelecionado.categoria,
      sacoleira: sacoleiraSelecionada.nome,
      data: new Date().toISOString().split('T')[0],
      total: produtoSelecionado.preco * parseInt(quantidade),
      observacoes
    }

    onSubmit(novoLancamento)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Novo Lançamento</CardTitle>
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
                    <SelectItem key={produto.id} value={produto.id.toString()}>
                      {produto.nome} - R$ {produto.preco.toFixed(2)}
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
                    <SelectItem key={sacoleira.id} value={sacoleira.id.toString()}>
                      {sacoleira.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Input
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Digite observações sobre o lançamento"
            />
          </div>

          {produtoSelecionado && quantidade && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Resumo do Lançamento</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Produto: {produtoSelecionado.nome}</div>
                <div>Valor unitário: R$ {produtoSelecionado.preco.toFixed(2)}</div>
                <div>Quantidade: {quantidade} un.</div>
                <div className="font-bold">Total: R$ {(produtoSelecionado.preco * parseInt(quantidade)).toFixed(2)}</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Criar Lançamento</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
