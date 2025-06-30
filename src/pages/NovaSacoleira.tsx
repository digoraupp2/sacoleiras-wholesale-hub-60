
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function NovaSacoleira() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
    observacoes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('sacoleiras')
        .insert([
          {
            nome: formData.nome,
            cpf: formData.cpf,
            telefone: formData.telefone,
            email: formData.email,
            endereco: formData.endereco
          }
        ])
        .select()

      if (error) {
        console.error('Erro ao cadastrar sacoleira:', error)
        toast({
          title: "Erro",
          description: "Erro ao cadastrar sacoleira. Tente novamente.",
          variant: "destructive"
        })
        return
      }

      console.log("Sacoleira cadastrada:", data)
      toast({
        title: "Sucesso",
        description: "Sacoleira cadastrada com sucesso!"
      })
      navigate("/sacoleiras")
    } catch (error) {
      console.error('Erro ao cadastrar sacoleira:', error)
      toast({
        title: "Erro",
        description: "Erro ao cadastrar sacoleira. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/sacoleiras">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Sacoleira</h1>
          <p className="text-muted-foreground">Cadastre uma nova parceira de vendas</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Sacoleira</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Maria Silva Santos"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: formatPhone(e.target.value)})}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="maria@email.com"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço Completo *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  placeholder="Rua, número, bairro, cidade - UF"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Anotações sobre a sacoleira..."
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Sacoleira"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/sacoleiras">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
