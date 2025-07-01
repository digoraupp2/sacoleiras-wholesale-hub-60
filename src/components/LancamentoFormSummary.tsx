
import { Produto, Sacoleira } from "@/types/lancamento"

interface LancamentoFormSummaryProps {
  produtoSelecionado: Produto | undefined
  sacoleiraSelecionada: Sacoleira | undefined
  tipo: string
  quantidade: string
}

export function LancamentoFormSummary({
  produtoSelecionado,
  sacoleiraSelecionada,
  tipo,
  quantidade
}: LancamentoFormSummaryProps) {
  if (!produtoSelecionado || !tipo || !quantidade || parseInt(quantidade) <= 0) {
    return null
  }

  return (
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
  )
}
