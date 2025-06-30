
-- Adicionar colunas necessárias à tabela sacoleiras
ALTER TABLE public.sacoleiras 
ADD COLUMN IF NOT EXISTS cpf TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Criar índice único para garantir que cada usuário tenha apenas uma sacoleira
CREATE UNIQUE INDEX IF NOT EXISTS idx_sacoleiras_user_id ON public.sacoleiras(user_id);

-- Função para criar sacoleira automaticamente quando um usuário se cadastra como sacoleira
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

-- Criar trigger para executar a função após inserir usuário
DROP TRIGGER IF EXISTS on_auth_user_created_sacoleira ON auth.users;
CREATE TRIGGER on_auth_user_created_sacoleira
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_sacoleira_user();
