
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
  preco_base: number
  categoria: string
}

interface Sacoleira {
  id: string
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
  const [tipo, setTipo] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [loading, setLoading] = useState(false)

  const produtoSelecionado = produtos.find(p => p.id === produtoId)
  const sacoleiraSelecionada = sacoleiras.find(s => s.id === sacoleiraId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!produtoSelecionado || !sacoleiraSelecionada || !tipo || !quantidade) {
      return
    }

    const quantidadeNum = parseInt(quantidade)
    if (quantidadeNum <= 0) {
      return
    }

    setLoading(true)
    
    try {
      const novoLancamento = {
        produto: produtoSelecionado.nome,
        valor: produtoSelecionado.preco_base,
        quantidade: quantidadeNum,
        categoria: produtoSelecionado.categoria,
        sacoleira: sacoleiraSelecionada.nome,
        sacoleira_id: sacoleiraSelecionada.id,
        data: new Date().toISOString().split('T')[0],
        total: produtoSelecionado.preco_base * quantidadeNum,
        observacoes: observacoes.trim(),
        tipo: tipo
      }

      await onSubmit(novoLancamento)
      
      // Resetar formulário após sucesso
      setProdutoId("")
      setSacoleiraId("")
      setTipo("")
      setQuantidade("")
      setObservacoes("")
    } catch (error) {
      console.error("Erro ao criar lançamento:", error)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = produtoSelecionado && sacoleiraSelecionada && tipo && quantidade && parseInt(quantidade) > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Novo Lançamento</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} disabled={loading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto *</Label>
              <Select value={produtoId} onValueChange={setProdutoId} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map(produto => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} - R$ {produto.preco_base.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sacoleira">Sacoleira *</Label>
              <Select value={sacoleiraId} onValueChange={setSacoleiraId} disabled={loading}>
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
              <Label htmlFor="tipo">Tipo de Movimentação *</Label>
              <Select value={tipo} onValueChange={setTipo} disabled={loading}>
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
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Digite a quantidade"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Input
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Digite observações sobre o lançamento"
              disabled={loading}
            />
          </div>

          {produtoSelecionado && tipo && quantidade && parseInt(quantidade) > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Resumo do Lançamento</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Produto: {produtoSelecionado.nome}</div>
                <div>Valor unitário: R$ {produtoSelecionado.preco_base.toFixed(2)}</div>
                <div>Tipo: {tipo === 'entrega' ? 'Entrega' : 'Devolução'}</div>
                <div>Quantidade: {quantidade} un.</div>
                <div className="font-bold">Total: R$ {(produtoSelecionado.preco_base * parseInt(quantidade)).toFixed(2)}</div>
              </div>
              {sacoleiraSelecionada && (
                <div className="mt-2 text-sm">
                  <strong>Sacoleira:</strong> {sacoleiraSelecionada.nome}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={!isFormValid || loading}
            >
              {loading ? "Criando..." : "Criar Lançamento"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
