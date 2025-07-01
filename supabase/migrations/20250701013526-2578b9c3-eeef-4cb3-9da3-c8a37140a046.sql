
-- Primeiro, vamos limpar e recriar todas as políticas RLS corretamente
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categorias;
DROP POLICY IF EXISTS "All users can view categories" ON public.categorias;
DROP POLICY IF EXISTS "Admins can manage products" ON public.produtos;
DROP POLICY IF EXISTS "All users can view products" ON public.produtos;
DROP POLICY IF EXISTS "Admins can manage sacoleiras" ON public.sacoleiras;
DROP POLICY IF EXISTS "Sacoleiras can view their own data" ON public.sacoleiras;
DROP POLICY IF EXISTS "Admins can manage all movements" ON public.movimentacoes;
DROP POLICY IF EXISTS "Sacoleiras can view their own movements" ON public.movimentacoes;
DROP POLICY IF EXISTS "Admins can manage custom prices" ON public.precos_personalizados;
DROP POLICY IF EXISTS "Sacoleiras can view their own prices" ON public.precos_personalizados;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Recriar a função is_admin de forma mais robusta
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND tipo_usuario = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Criar função para verificar se usuário é sacoleira
CREATE OR REPLACE FUNCTION public.is_sacoleira()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND tipo_usuario = 'sacoleira'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Função para obter sacoleira_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_sacoleira_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN (
    SELECT sacoleira_relacionada 
    FROM public.user_profiles 
    WHERE id = auth.uid()
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Garantir que RLS está habilitado em todas as tabelas (exceto views)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sacoleiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precos_personalizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Recriar políticas RLS mais permissivas para evitar problemas
-- Categorias
CREATE POLICY "Allow authenticated users to view categories" ON public.categorias
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage categories" ON public.categorias
FOR ALL TO authenticated USING (public.is_admin());

-- Produtos
CREATE POLICY "Allow authenticated users to view products" ON public.produtos
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage products" ON public.produtos
FOR ALL TO authenticated USING (public.is_admin());

-- Sacoleiras
CREATE POLICY "Allow admins to manage sacoleiras" ON public.sacoleiras
FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Allow sacoleiras to view their own data" ON public.sacoleiras
FOR SELECT TO authenticated USING (
  public.is_admin() OR id = public.get_current_sacoleira_id()
);

-- Movimentações
CREATE POLICY "Allow admins to manage all movements" ON public.movimentacoes
FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Allow sacoleiras to view their own movements" ON public.movimentacoes
FOR SELECT TO authenticated USING (
  public.is_admin() OR sacoleira_id = public.get_current_sacoleira_id()
);

-- Preços personalizados
CREATE POLICY "Allow admins to manage custom prices" ON public.precos_personalizados
FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Allow sacoleiras to view their own prices" ON public.precos_personalizados
FOR SELECT TO authenticated USING (
  public.is_admin() OR sacoleira_id = public.get_current_sacoleira_id()
);

-- User profiles
CREATE POLICY "Allow users to view their own profile" ON public.user_profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON public.user_profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow admins to view all profiles" ON public.user_profiles
FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Allow admins to manage all profiles" ON public.user_profiles
FOR ALL TO authenticated USING (public.is_admin());

-- Corrigir o trigger para criação de usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_sacoleira_user_created ON auth.users;

-- Função unificada para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sacoleira_id uuid;
BEGIN
  -- Criar perfil do usuário
  INSERT INTO public.user_profiles (id, nome, tipo_usuario)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'sacoleira')
  );
  
  -- Se for sacoleira, criar registro na tabela sacoleiras
  IF COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'sacoleira') = 'sacoleira' THEN
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
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, log e continue
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Criar trigger unificado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
