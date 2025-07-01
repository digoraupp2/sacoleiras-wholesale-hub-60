
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Produto, Sacoleira } from "@/types/lancamento"

interface LancamentoFormSelectsProps {
  produtoId: string
  setProdutoId: (value: string) => void
  sacoleiraId: string
  setSacoleiraId: (value: string) => void
  tipo: string
  setTipo: (value: string) => void
  produtos: Produto[]
  sacoleiras: Sacoleira[]
  loading: boolean
}

export function LancamentoFormSelects({
  produtoId,
  setProdutoId,
  sacoleiraId,
  setSacoleiraId,
  tipo,
  setTipo,
  produtos,
  sacoleiras,
  loading
}: LancamentoFormSelectsProps) {
  return (
    <>
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
      </div>
    </>
  )
}
