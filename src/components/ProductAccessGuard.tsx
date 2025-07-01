
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

interface ProductAccessGuardProps {
  children: React.ReactNode
  action: 'create' | 'edit' | 'delete'
}

export function ProductAccessGuard({ children, action }: ProductAccessGuardProps) {
  const { isAdmin, userProfile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (userProfile && !isAdmin) {
      const actionMessages = {
        create: 'criar produtos',
        edit: 'editar produtos', 
        delete: 'excluir produtos'
      }
      
      toast({
        title: "Acesso negado",
        description: `Você não tem permissão para ${actionMessages[action]}.`,
        variant: "destructive"
      })
      
      navigate('/produtos', { replace: true })
    }
  }, [isAdmin, userProfile, action, navigate, toast])

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
