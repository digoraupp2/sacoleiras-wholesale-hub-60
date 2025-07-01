
import { useState } from "react"
import { LancamentosTabs } from "@/components/LancamentosTabs"
import { LancamentosContent } from "@/components/LancamentosContent"
import { EstoqueRealContent } from "@/components/EstoqueRealContent"
import { Lancamento } from "@/types/lancamento"

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
        estoqueContent={<EstoqueRealContent />}
      />
    </div>
  )
}
