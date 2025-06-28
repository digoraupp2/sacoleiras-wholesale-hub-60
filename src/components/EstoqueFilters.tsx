
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface EstoqueFiltrosProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  filtroCategoria: string
  setFiltroCategoria: (value: string) => void
  filtroSacoleira: string
  setFiltroSacoleira: (value: string) => void
  categorias: string[]
  sacoleiras: { id: number; nome: string }[]
}

export function EstoqueFilters({
  searchTerm,
  setSearchTerm,
  filtroCategoria,
  setFiltroCategoria,
  filtroSacoleira,
  setFiltroSacoleira,
  categorias,
  sacoleiras
}: EstoqueFiltrosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categorias.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroSacoleira} onValueChange={setFiltroSacoleira}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as sacoleiras" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as sacoleiras</SelectItem>
              {sacoleiras.map(sacoleira => (
                <SelectItem key={sacoleira.id} value={sacoleira.nome}>{sacoleira.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
