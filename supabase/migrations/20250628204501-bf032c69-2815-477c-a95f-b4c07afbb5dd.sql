
-- Ativar RLS (Row Level Security) para todas as tabelas
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sacoleiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precos_personalizados ENABLE ROW LEVEL SECURITY;

-- Criar políticas para categorias (somente admins podem gerenciar)
CREATE POLICY "Admins can manage categories" ON public.categorias
FOR ALL USING (public.is_admin());

CREATE POLICY "All users can view categories" ON public.categorias
FOR SELECT USING (true);

-- Criar políticas para produtos (somente admins podem gerenciar)
CREATE POLICY "Admins can manage products" ON public.produtos
FOR ALL USING (public.is_admin());

CREATE POLICY "All users can view products" ON public.produtos
FOR SELECT USING (true);

-- Criar políticas para sacoleiras
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

-- Criar políticas para movimentações
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

-- Criar políticas para preços personalizados
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

-- Criar políticas para user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
FOR ALL USING (public.is_admin());
