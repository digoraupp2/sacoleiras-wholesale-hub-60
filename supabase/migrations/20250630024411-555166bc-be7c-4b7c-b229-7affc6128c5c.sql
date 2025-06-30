
-- Adicionar colunas para controle de estoque na tabela de movimentações
-- Já existe a tabela movimentacoes, vamos garantir que ela tenha os campos necessários

-- Verificar se precisamos adicionar alguma coluna (caso não exista)
DO $$ 
BEGIN
    -- Adicionar coluna data_movimentacao se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'movimentacoes' AND column_name = 'data_movimentacao') THEN
        ALTER TABLE movimentacoes ADD COLUMN data_movimentacao TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Inserir alguns dados de exemplo para demonstração
INSERT INTO movimentacoes (sacoleira_id, produto_id, tipo_movimentacao, quantidade, valor_unitario, data_movimentacao, observacoes)
VALUES 
    -- Sacoleira Maria Silva (assumindo que existe uma sacoleira com este nome)
    ((SELECT id FROM sacoleiras WHERE nome LIKE '%Maria Silva%' LIMIT 1),
     (SELECT id FROM produtos LIMIT 1 OFFSET 0),
     'entrada',
     15,
     35.00,
     '2024-01-15',
     'Entrega inicial de produtos'),
    
    ((SELECT id FROM sacoleiras WHERE nome LIKE '%Maria Silva%' LIMIT 1),
     (SELECT id FROM produtos LIMIT 1 OFFSET 1),
     'entrada', 
     10,
     89.90,
     '2024-01-15',
     'Entrega de calças jeans'),
     
    ((SELECT id FROM sacoleiras WHERE nome LIKE '%Maria Silva%' LIMIT 1),
     (SELECT id FROM produtos LIMIT 1 OFFSET 0),
     'saida',
     3,
     35.00,
     '2024-01-16',
     'Venda realizada'),
     
    -- Sacoleira Ana Costa
    ((SELECT id FROM sacoleiras WHERE nome LIKE '%Ana Costa%' LIMIT 1),
     (SELECT id FROM produtos LIMIT 1 OFFSET 0),
     'entrada',
     20,
     35.00,
     '2024-01-14',
     'Entrega de produtos'),
     
    ((SELECT id FROM sacoleiras WHERE nome LIKE '%Ana Costa%' LIMIT 1),
     (SELECT id FROM produtos LIMIT 1 OFFSET 2),
     'entrada',
     8,
     59.90,
     '2024-01-14',
     'Entrega de vestidos');

-- Criar uma view para calcular o estoque atual de cada sacoleira
CREATE OR REPLACE VIEW estoque_sacoleiras AS
WITH movimentacoes_com_sinal AS (
  SELECT 
    m.sacoleira_id,
    m.produto_id,
    p.nome as produto_nome,
    p.preco_base,
    CASE 
      WHEN m.tipo_movimentacao = 'entrada' THEN m.quantidade
      WHEN m.tipo_movimentacao = 'saida' THEN -m.quantidade
      ELSE 0
    END as quantidade_com_sinal,
    CASE 
      WHEN m.tipo_movimentacao = 'entrada' THEN (m.quantidade * COALESCE(m.valor_unitario, p.preco_base))
      WHEN m.tipo_movimentacao = 'saida' THEN -(m.quantidade * COALESCE(m.valor_unitario, p.preco_base))
      ELSE 0
    END as valor_com_sinal
  FROM movimentacoes m
  JOIN produtos p ON m.produto_id = p.id
  WHERE m.sacoleira_id IS NOT NULL AND m.produto_id IS NOT NULL
)
SELECT 
  s.id as sacoleira_id,
  s.nome as sacoleira_nome,
  mcs.produto_id,
  mcs.produto_nome,
  mcs.preco_base,
  SUM(mcs.quantidade_com_sinal) as quantidade_estoque,
  SUM(mcs.valor_com_sinal) as valor_estoque
FROM sacoleiras s
LEFT JOIN movimentacoes_com_sinal mcs ON s.id = mcs.sacoleira_id
GROUP BY s.id, s.nome, mcs.produto_id, mcs.produto_nome, mcs.preco_base
HAVING SUM(mcs.quantidade_com_sinal) > 0;
