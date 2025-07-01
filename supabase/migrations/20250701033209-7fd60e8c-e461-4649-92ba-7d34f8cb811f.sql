
-- Primeiro, vamos limpar os triggers conflitantes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_sacoleira_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_sacoleira ON auth.users;

-- Remover as funções antigas que podem estar causando conflito
DROP FUNCTION IF EXISTS public.handle_new_sacoleira_user();

-- Recriar a função handle_new_user de forma mais robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sacoleira_id uuid;
  existing_profile_id uuid;
BEGIN
  -- Verificar se já existe um perfil para este usuário
  SELECT id INTO existing_profile_id 
  FROM public.user_profiles 
  WHERE id = NEW.id;
  
  -- Se não existe perfil, criar um
  IF existing_profile_id IS NULL THEN
    INSERT INTO public.user_profiles (id, nome, tipo_usuario)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
      COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'sacoleira')
    );
  END IF;
  
  -- Se for sacoleira, criar registro na tabela sacoleiras (apenas se não existir)
  IF COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'sacoleira') = 'sacoleira' THEN
    -- Verificar se já existe uma sacoleira para este usuário
    SELECT id INTO sacoleira_id 
    FROM public.sacoleiras 
    WHERE user_id = NEW.id;
    
    -- Se não existe, criar
    IF sacoleira_id IS NULL THEN
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
        NULL,
        NEW.email,
        NULL,
        NULL,
        NEW.id
      )
      RETURNING id INTO sacoleira_id;
      
      -- Atualizar o perfil com a referência da sacoleira
      UPDATE public.user_profiles 
      SET sacoleira_relacionada = sacoleira_id
      WHERE id = NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Se houver violação de constraint única, apenas logar e continuar
    RAISE LOG 'Unique constraint violation in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Em caso de outros erros, logar e continuar
    RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Criar apenas um trigger unificado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Garantir que o índice único existe (caso não exista)
CREATE UNIQUE INDEX IF NOT EXISTS idx_sacoleiras_user_id ON public.sacoleiras(user_id);
