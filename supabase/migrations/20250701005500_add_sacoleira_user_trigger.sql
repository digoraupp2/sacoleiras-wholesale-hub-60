
-- Função para criar sacoleira quando usuário sacoleira é criado
CREATE OR REPLACE FUNCTION public.handle_new_sacoleira_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário é do tipo sacoleira
  IF NEW.raw_user_meta_data->>'tipo_usuario' = 'sacoleira' THEN
    -- Criar registro na tabela sacoleiras
    INSERT INTO public.sacoleiras (
      nome, 
      telefone, 
      email, 
      cpf, 
      endereco, 
      user_id
    )
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'nome', 'Nome não informado'),
      NULL, -- telefone será preenchido posteriormente
      NEW.email,
      NULL, -- cpf será preenchido posteriormente
      NULL, -- endereco será preenchido posteriormente
      NEW.id
    );
    
    -- Atualizar o perfil do usuário com a referência da sacoleira criada
    UPDATE public.user_profiles 
    SET sacoleira_relacionada = (
      SELECT id FROM public.sacoleiras WHERE user_id = NEW.id
    )
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para novos usuários sacoleiras
DROP TRIGGER IF EXISTS on_auth_sacoleira_user_created ON auth.users;
CREATE TRIGGER on_auth_sacoleira_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_sacoleira_user();
