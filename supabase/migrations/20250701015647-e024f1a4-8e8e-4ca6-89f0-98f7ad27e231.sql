
-- Primeiro, vamos verificar e dropar qualquer dependência da view
DROP VIEW IF EXISTS public.estoque_sacoleiras CASCADE;

-- Recriar a view completamente sem SECURITY DEFINER
CREATE VIEW public.estoque_sacoleiras AS
SELECT 
    s.id as sacoleira_id,
    s.nome as sacoleira_nome,
    p.id as produto_id,
    p.nome as produto_nome,
    p.preco_base,
    COALESCE(
        SUM(
            CASE 
                WHEN m.tipo_movimentacao = 'entrega' THEN m.quantidade
                WHEN m.tipo_movimentacao = 'devolucao' THEN -m.quantidade
                ELSE 0
            END
        ), 0
    ) as quantidade_estoque,
    COALESCE(
        SUM(
            CASE 
                WHEN m.tipo_movimentacao = 'entrega' THEN m.quantidade
                WHEN m.tipo_movimentacao = 'devolucao' THEN -m.quantidade
                ELSE 0
            END
        ) * p.preco_base, 0
    ) as valor_estoque
FROM public.sacoleiras s
CROSS JOIN public.produtos p
LEFT JOIN public.movimentacoes m ON m.sacoleira_id = s.id AND m.produto_id = p.id
GROUP BY s.id, s.nome, p.id, p.nome, p.preco_base;

-- Garantir que as tabelas subjacentes tenham RLS habilitado
ALTER TABLE public.sacoleiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;

-- Recriar as políticas RLS se necessário
DROP POLICY IF EXISTS "Allow authenticated users to view sacoleiras" ON public.sacoleiras;
CREATE POLICY "Allow authenticated users to view sacoleiras" ON public.sacoleiras
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to view products" ON public.produtos;
CREATE POLICY "Allow authenticated users to view products" ON public.produtos
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to view movements" ON public.movimentacoes;
CREATE POLICY "Allow authenticated users to view movements" ON public.movimentacoes
FOR SELECT TO authenticated USING (true);
