
import { supabase } from "@/integrations/supabase/client"

export const createUserForSacoleira = async (nome: string, sacoleiraId: string) => {
  try {
    // Gerar email baseado no nome
    const emailSlug = nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-') // Substitui espaços por hífen
    
    const email = `${emailSlug}-seller@mail.com`
    const password = '1234567890'
    
    console.log('Creating user for sacoleira:', { nome, email, sacoleiraId })
    
    // Criar usuário usando signUp
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          nome: nome,
          tipo_usuario: 'sacoleira'
        }
      }
    })
    
    if (error) {
      console.error('Error creating user:', error)
      throw error
    }
    
    console.log('User created successfully:', data.user?.id)
    
    // Aguardar um pouco para o trigger processar
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Atualizar a sacoleira com o user_id
    if (data.user?.id) {
      const { error: updateError } = await supabase
        .from('sacoleiras')
        .update({ user_id: data.user.id })
        .eq('id', sacoleiraId)
      
      if (updateError) {
        console.error('Error updating sacoleira with user_id:', updateError)
        // Não vamos falhar aqui, pois a sacoleira já foi criada
      } else {
        console.log('Sacoleira updated with user_id successfully')
      }
    }
    
    return { success: true, email, userId: data.user?.id }
  } catch (error) {
    console.error('Error in createUserForSacoleira:', error)
    return { success: false, error }
  }
}
