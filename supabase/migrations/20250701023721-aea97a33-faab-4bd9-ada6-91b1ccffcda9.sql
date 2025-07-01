
-- First, drop any existing constraint (if it exists)
ALTER TABLE public.movimentacoes DROP CONSTRAINT IF EXISTS movimentacoes_tipo_movimentacao_check;

-- Check what values currently exist
SELECT DISTINCT tipo_movimentacao FROM public.movimentacoes;

-- Update any rows that don't match our expected values
UPDATE public.movimentacoes 
SET tipo_movimentacao = CASE 
  WHEN tipo_movimentacao = 'devolução' THEN 'devolucao'
  WHEN tipo_movimentacao NOT IN ('entrega', 'devolucao') THEN 'entrega'
  ELSE tipo_movimentacao
END;

-- Verify the data is clean
SELECT DISTINCT tipo_movimentacao FROM public.movimentacoes;

-- Add the constraint
ALTER TABLE public.movimentacoes ADD CONSTRAINT movimentacoes_tipo_movimentacao_check 
CHECK (tipo_movimentacao IN ('entrega', 'devolucao'));
