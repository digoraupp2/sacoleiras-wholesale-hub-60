
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, User, Phone, MapPin, FileText } from "lucide-react"
import { useState } from "react"
import { EditSacoleiraDialog } from "./EditSacoleiraDialog"
import { ExtractSacoleiraDialog } from "./ExtractSacoleiraDialog"

interface Sacoleira {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco: string
  status: string
  produtosEmPosse: number
  valorEmPosse: number
  ultimaMovimentacao: string
}

interface SacoleiraCardProps {
  sacoleira: Sacoleira
  onUpdate: (updatedSacoleira: Sacoleira) => void
}

export function SacoleiraCard({ sacoleira, onUpdate }: SacoleiraCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isExtractDialogOpen, setIsExtractDialogOpen] = useState(false)

  const handleEdit = () => {
    setIsEditDialogOpen(true)
  }

  const handleViewExtract = () => {
    setIsExtractDialogOpen(true)
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{sacoleira.nome}</h3>
                <p className="text-sm text-muted-foreground">CPF: {sacoleira.cpf}</p>
              </div>
            </div>
            <Badge variant={sacoleira.status === "ativa" ? "default" : "secondary"}>
              {sacoleira.status}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{sacoleira.telefone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{sacoleira.endereco}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Produtos em Posse</p>
              <p className="font-bold text-lg">{sacoleira.produtosEmPosse}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Valor em Posse</p>
              <p className="font-bold text-lg text-accent">R$ {sacoleira.valorEmPosse.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={handleViewExtract}>
              <FileText className="w-4 h-4 mr-2" />
              Ver Extrato
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditSacoleiraDialog
        sacoleira={sacoleira}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={onUpdate}
      />

      <ExtractSacoleiraDialog
        sacoleira={sacoleira}
        isOpen={isExtractDialogOpen}
        onClose={() => setIsExtractDialogOpen(false)}
      />
    </>
  )
}
