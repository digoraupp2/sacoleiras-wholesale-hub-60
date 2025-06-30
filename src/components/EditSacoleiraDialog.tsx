
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

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

interface EditSacoleiraDialogProps {
  sacoleira: Sacoleira
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedSacoleira: Sacoleira) => void
}

export function EditSacoleiraDialog({ sacoleira, isOpen, onClose, onUpdate }: EditSacoleiraDialogProps) {
  const [formData, setFormData] = useState({
    nome: sacoleira.nome,
    cpf: sacoleira.cpf,
    telefone: sacoleira.telefone,
    email: sacoleira.email,
    endereco: sacoleira.endereco
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('sacoleiras')
        .update({
          nome: formData.nome,
          cpf: formData.cpf,
          telefone: formData.telefone,
          email: formData.email,
          endereco: formData.endereco
        })
        .eq('id', sacoleira.id)

      if (error) {
        console.error('Erro ao atualizar sacoleira:', error)
        toast({
          title: "Erro",
          description: "Erro ao atualizar sacoleira. Tente novamente.",
          variant: "destructive"
        })
        return
      }

      const updatedSacoleira = {
        ...sacoleira,
        ...formData
      }
      
      onUpdate(updatedSacoleira)
      toast({
        title: "Sacoleira atualizada",
        description: "Os dados da sacoleira foram atualizados com sucesso."
      })
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar sacoleira:', error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar sacoleira. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Sacoleira</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
