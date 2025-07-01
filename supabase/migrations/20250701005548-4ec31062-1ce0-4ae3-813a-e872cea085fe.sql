
-- Corrigir estrutura de RLS e triggers
-- 1. Primeiro, vamos garantir que as funções necessárias existam
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND tipo_usuario = 'admin'
  );
END;
$$;

-- 2. Criar função para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, nome, tipo_usuario)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'sacoleira')
  );
  RETURN NEW;
END;
$$;

-- 3. Criar trigger para novos usuários (se não existir)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Ativar RLS em todas as tabelas se ainda não estiver ativo
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sacoleiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precos_personalizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS básicas (DROP IF EXISTS para evitar erros)
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

-- Recriar políticas
CREATE POLICY "Admins can manage categories" ON public.categorias
FOR ALL USING (public.is_admin());

CREATE POLICY "All users can view categories" ON public.categorias
FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON public.produtos
FOR ALL USING (public.is_admin());

CREATE POLICY "All users can view products" ON public.produtos
FOR SELECT USING (true);

CREATE POLICY "Admins can manage sacoleiras" ON public.sacoleiras
FOR ALL USING (public.is_admin());

CREATE POLICY "Sacoleiras can view their own data" ON public.sacoleiras
FOR SELECT USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND sacoleira_relacionada = public.sacoleiras.id
  )
);

CREATE POLICY "Admins can manage all movements" ON public.movimentacoes
FOR ALL USING (public.is_admin());

CREATE POLICY "Sacoleiras can view their own movements" ON public.movimentacoes
FOR SELECT USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND sacoleira_relacionada = public.movimentacoes.sacoleira_id
  )
);

CREATE POLICY "Admins can manage custom prices" ON public.precos_personalizados
FOR ALL USING (public.is_admin());

CREATE POLICY "Sacoleiras can view their own prices" ON public.precos_personalizados
FOR SELECT USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND sacoleira_relacionada = public.precos_personalizados.sacoleira_id
  )
);

CREATE POLICY "Users can view their own profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
FOR ALL USING (public.is_admin());
