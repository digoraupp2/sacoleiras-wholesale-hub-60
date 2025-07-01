
import { useState } from "react"
import { LancamentosTabs } from "@/components/LancamentosTabs"
import { LancamentosContent } from "@/components/LancamentosContent"
import { EstoqueContent } from "@/components/EstoqueContent"

interface Lancamento {
  id: string
  produto: string
  produto_id: string
  valor: number
  quantidade: number
  categoria: string
  sacoleira: string
  sacoleira_id: string
  data: string
  total: number
  observacoes?: string
  tipo?: string
}

export default function Lancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Lançamentos e Estoque</h1>
        <p className="text-muted-foreground">
          Gerencie lançamentos de produtos e controle o estoque das sacoleiras
        </p>
      </div>

      <LancamentosTabs
        lancamentosContent={
          <LancamentosContent 
            lancamentos={lancamentos}
            setLancamentos={setLancamentos}
          />
        }
        estoqueContent={<EstoqueContent />}
      />
    </div>
  )
}
