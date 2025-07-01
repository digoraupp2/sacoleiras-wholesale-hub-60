
import { useToast } from "@/hooks/use-toast"

export function validateLancamentoForm(
  produtoId: string,
  sacoleiraId: string,
  tipo: string,
  quantidade: string
) {
  const { toast } = useToast()
  
  let isValid = true
  let errors: string[] = []

  if (!produtoId) {
    errors.push("Produto é obrigatório")
    isValid = false
  }

  if (!sacoleiraId) {
    errors.push("Sacoleira é obrigatória")
    isValid = false
  }

  if (!tipo) {
    errors.push("Tipo de movimentação é obrigatório")
    isValid = false
  }

  if (!quantidade || parseInt(quantidade) <= 0) {
    errors.push("Quantidade deve ser maior que zero")
    isValid = false
  }

  if (!isValid) {
    toast({
      title: "Erro de validação",
      description: errors.join(", "),
      variant: "destructive",
    })
  }

  return { isValid, errors }
}
