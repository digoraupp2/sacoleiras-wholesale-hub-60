
import { useState, useEffect } from "react"
import { LancamentoForm } from "@/components/LancamentoForm"
import { LancamentoFilters } from "@/components/LancamentoFilters"
import { LancamentoCard } from "@/components/LancamentoCard"
import { LancamentosHeader } from "@/components/LancamentosHeader"
import { LancamentosLoading } from "@/components/LancamentosLoading"
import { LancamentosEmpty } from "@/components/LancamentosEmpty"
import { useAuth } from "@/contexts/AuthContext"
import { useLancamentosData } from "@/hooks/useLancamentosData"
import { useLancamentoSubmission } from "@/hooks/useLancamentoSubmission"
import { Lancamento } from "@/types/lancamento"

interface LancamentosContentProps {
  lancamentos: Lancamento[]
  setLancamentos: React.Dispatch<React.SetStateAction<Lancamento[]>>
}

export function LancamentosContent({ lancamentos, setLancamentos }: LancamentosContentProps) {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const { userProfile, isAdmin } = useAuth()
  
  const { produtos, sacoleiras, loading, fetchLancamentos } = useLancamentosData()
  const { handleSubmit: submitLancamento } = useLancamentoSubmission()

  useEffect(() => {
    const loadLancamentos = async () => {
      const data = await fetchLancamentos()
      setLancamentos(data)
    }
    loadLancamentos()
  }, [fetchLancamentos, setLancamentos])

  const categorias = [...new Set(produtos.map(p => p.categoria))]

  // Os lançamentos já vêm filtrados do hook useLancamentosData baseado no tipo de usuário
  // Não precisamos filtrar novamente aqui
  const filteredLancamentos = lancamentos.filter(lancamento => {
    const matchesSearch = lancamento.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lancamento.sacoleira.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = filtroCategoria === "todas" || lancamento.categoria === filtroCategoria
    return matchesSearch && matchesCategoria
  })

  const handleFormSubmit = async (formData: any) => {
    const novoLancamento = await submitLancamento(formData)
    if (novoLancamento) {
      setLancamentos(prev => [novoLancamento, ...prev])
      setShowForm(false)
    }
  }

  if (loading) {
    return <LancamentosLoading />
  }

  return (
    <div className="space-y-6">
      <LancamentosHeader onNewLancamento={() => setShowForm(true)} />

      {showForm && isAdmin && (
        <LancamentoForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          produtos={produtos}
          sacoleiras={sacoleiras}
        />
      )}

      <LancamentoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filtroCategoria={filtroCategoria}
        onCategoriaChange={setFiltroCategoria}
        categorias={categorias}
      />

      <div className="grid grid-cols-1 gap-4">
        {filteredLancamentos.length > 0 ? (
          filteredLancamentos.map((lancamento) => (
            <LancamentoCard key={lancamento.id} lancamento={lancamento} />
          ))
        ) : (
          <LancamentosEmpty />
        )}
      </div>
    </div>
  )
}
