
import { useState } from "react"
import { LancamentosTabs } from "@/components/LancamentosTabs"
import { LancamentosContent } from "@/components/LancamentosContent"
import { EstoqueContent } from "@/components/EstoqueContent"

interface Lancamento {
  id: number
  produto: string
  valor: number
  quantidade: number
  categoria: string
  sacoleira: string
  sacoleira_id: string
  data: string
  total: number
  observacoes?: string
}

export default function Lancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([
    {
      id: 1,
      produto: "Blusa Feminina Básica",
      valor: 35.00,
      quantidade: 5,
      categoria: "Roupas Femininas",
      sacoleira: "Maria Silva",
      sacoleira_id: "1",
      data: "2024-01-15",
      total: 175.00
    },
    {
      id: 2,
      produto: "Calça Jeans Masculina",
      valor: 89.90,
      quantidade: 2,
      categoria: "Roupas Masculinas",
      sacoleira: "Ana Santos",
      sacoleira_id: "2",
      data: "2024-01-14",
      total: 179.80
    },
    {
      id: 3,
      produto: "Vestido Floral",
      valor: 59.90,
      quantidade: 3,
      categoria: "Roupas Femininas",
      sacoleira: "Carla Oliveira",
      sacoleira_id: "3",
      data: "2024-01-13",
      total: 179.70
    }
  ])

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
