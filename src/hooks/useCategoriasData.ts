
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface Categoria {
  id: string
  nome: string
  descricao: string
  status: string
  produtosCount: number
}

export function useCategoriasData() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      console.log("Buscando categorias...")
      
      const { data, error } = await supabase
        .from('categorias')
        .select(`
          id,
          nome,
          descricao,
          produtos (id)
        `)
        .order('nome')
      
      if (error) {
        console.error('Erro ao buscar categorias:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias.",
          variant: "destructive"
        })
        return
      }
      
      console.log("Categorias encontradas:", data?.length || 0)
      
      // Transformar dados para o formato esperado
      const categoriasFormatadas = data?.map(categoria => ({
        id: categoria.id,
        nome: categoria.nome,
        descricao: categoria.descricao || '',
        status: "ativa",
        produtosCount: categoria.produtos?.length || 0
      })) || []
      
      setCategorias(categoriasFormatadas)
    } catch (error) {
      console.error('Erro inesperado ao buscar categorias:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar categorias.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createCategoria = async (nome: string, descricao: string) => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .insert([{
          nome: nome.trim(),
          descricao: descricao.trim()
        }])
        .select()
        .single()
      
      if (error) {
        console.error('Erro ao criar categoria:', error)
        toast({
          title: "Erro",
          description: "Não foi possível criar a categoria.",
          variant: "destructive"
        })
        return null
      }
      
      const novaCategoria = {
        id: data.id,
        nome: data.nome,
        descricao: data.descricao || '',
        status: "ativa",
        produtosCount: 0
      }
      
      setCategorias(prev => [...prev, novaCategoria])
      return novaCategoria
    } catch (error) {
      console.error('Erro inesperado ao criar categoria:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar categoria.",
        variant: "destructive"
      })
      return null
    }
  }

  const updateCategoria = async (id: string, nome: string, descricao: string) => {
    try {
      const { error } = await supabase
        .from('categorias')
        .update({
          nome: nome.trim(),
          descricao: descricao.trim()
        })
        .eq('id', id)
      
      if (error) {
        console.error('Erro ao atualizar categoria:', error)
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a categoria.",
          variant: "destructive"
        })
        return false
      }
      
      setCategorias(prev => prev.map(cat => 
        cat.id === id 
          ? { ...cat, nome: nome.trim(), descricao: descricao.trim() }
          : cat
      ))
      return true
    } catch (error) {
      console.error('Erro inesperado ao atualizar categoria:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar categoria.",
        variant: "destructive"
      })
      return false
    }
  }

  const deleteCategoria = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Erro ao excluir categoria:', error)
        toast({
          title: "Erro",
          description: "Não foi possível excluir a categoria.",
          variant: "destructive"
        })
        return false
      }
      
      setCategorias(prev => prev.filter(cat => cat.id !== id))
      return true
    } catch (error) {
      console.error('Erro inesperado ao excluir categoria:', error)
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir categoria.",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  return {
    categorias,
    loading,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria
  }
}
