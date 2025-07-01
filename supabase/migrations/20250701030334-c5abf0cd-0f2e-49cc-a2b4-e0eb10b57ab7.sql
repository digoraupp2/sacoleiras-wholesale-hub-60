
-- Criar tabela de lançamentos se não existir (para o dashboard)
CREATE TABLE IF NOT EXISTS public.dashboard_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_produtos INTEGER DEFAULT 0,
  sacoleiras_ativas INTEGER DEFAULT 0,
  lancamentos_mes INTEGER DEFAULT 0,
  faturamento_mes NUMERIC DEFAULT 0,
  produtos_em_falta INTEGER DEFAULT 0,
  pedidos_pendentes INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar view para métricas do dashboard
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM produtos) as total_produtos,
  (SELECT COUNT(*) FROM sacoleiras) as sacoleiras_ativas,
  (SELECT COUNT(*) FROM lancamentos WHERE EXTRACT(MONTH FROM data_lancamento) = EXTRACT(MONTH FROM CURRENT_DATE)) as lancamentos_mes,
  (SELECT COALESCE(SUM(valor_total), 0) FROM lancamentos WHERE EXTRACT(MONTH FROM data_lancamento) = EXTRACT(MONTH FROM CURRENT_DATE)) as faturamento_mes,
  (SELECT COUNT(*) FROM produtos WHERE estoque_minimo <= 5) as produtos_em_falta,
  (SELECT COUNT(*) FROM lancamentos WHERE tipo = 'entrega' AND data_lancamento >= CURRENT_DATE - INTERVAL '7 days') as pedidos_pendentes;

-- Criar view para lançamentos recentes do dashboard
CREATE OR REPLACE VIEW public.lancamentos_recentes AS
SELECT 
  l.tipo,
  s.nome as sacoleira,
  p.nome as produto,
  l.quantidade,
  l.data_lancamento
FROM lancamentos l
JOIN sacoleiras s ON l.sacoleira_id = s.id
JOIN produtos p ON l.produto_id = p.id
ORDER BY l.data_lancamento DESC
LIMIT 10;

-- Criar view para top sacoleiras
CREATE OR REPLACE VIEW public.top_sacoleiras AS
SELECT 
  s.nome,
  COUNT(l.id) as total_produtos,
  SUM(l.valor_total) as total_vendas
FROM sacoleiras s
LEFT JOIN lancamentos l ON s.id = l.sacoleira_id
WHERE l.tipo = 'entrega'
GROUP BY s.id, s.nome
ORDER BY total_vendas DESC
LIMIT 5;

-- Inserir algumas categorias padrão se não existirem
INSERT INTO public.categorias (nome, descricao) 
SELECT 'Roupas Femininas', 'Blusas, vestidos, saias e acessórios femininos'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome = 'Roupas Femininas');

INSERT INTO public.categorias (nome, descricao) 
SELECT 'Roupas Masculinas', 'Camisas, calças, bermudas masculinas'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome = 'Roupas Masculinas');

INSERT INTO public.categorias (nome, descricao) 
SELECT 'Calçados', 'Sapatos, tênis, sandálias'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome = 'Calçados');

INSERT INTO public.categorias (nome, descricao) 
SELECT 'Acessórios', 'Bolsas, cintos, bijuterias'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nome = 'Acessórios');

-- Inserir alguns produtos exemplo se não existirem
DO $$
DECLARE
    categoria_feminina_id UUID;
    categoria_masculina_id UUID;
    categoria_calcados_id UUID;
BEGIN
    -- Pegar IDs das categorias
    SELECT id INTO categoria_feminina_id FROM categorias WHERE nome = 'Roupas Femininas' LIMIT 1;
    SELECT id INTO categoria_masculina_id FROM categorias WHERE nome = 'Roupas Masculinas' LIMIT 1;
    SELECT id INTO categoria_calcados_id FROM categorias WHERE nome = 'Calçados' LIMIT 1;
    
    -- Inserir produtos exemplo
    INSERT INTO public.produtos (nome, categoria_id, preco_base, estoque_minimo)
    SELECT 'Blusa Feminina Básica', categoria_feminina_id, 35.00, 10
    WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Blusa Feminina Básica');
    
    INSERT INTO public.produtos (nome, categoria_id, preco_base, estoque_minimo)
    SELECT 'Calça Jeans Masculina', categoria_masculina_id, 89.90, 5
    WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Calça Jeans Masculina');
    
    INSERT INTO public.produtos (nome, categoria_id, preco_base, estoque_minimo)
    SELECT 'Tênis Esportivo', categoria_calcados_id, 120.00, 3
    WHERE NOT EXISTS (SELECT 1 FROM produtos WHERE nome = 'Tênis Esportivo');
END $$;
