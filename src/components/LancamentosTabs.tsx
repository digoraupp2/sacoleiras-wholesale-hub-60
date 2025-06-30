
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Warehouse } from "lucide-react"

interface LancamentosTabsProps {
  lancamentosContent: React.ReactNode
  estoqueContent: React.ReactNode
}

export function LancamentosTabs({ lancamentosContent, estoqueContent }: LancamentosTabsProps) {
  return (
    <Tabs defaultValue="lancamentos" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="lancamentos" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Lançamentos
        </TabsTrigger>
        <TabsTrigger value="estoque" className="flex items-center gap-2">
          <Warehouse className="w-4 h-4" />
          Estoque Sacoleiras
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="lancamentos" className="mt-6">
        {lancamentosContent}
      </TabsContent>
      
      <TabsContent value="estoque" className="mt-6">
        {estoqueContent}
      </TabsContent>
    </Tabs>
  )
}
