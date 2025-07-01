
-- Adicionar coluna de pagamento na tabela lancamentos
ALTER TABLE public.lancamentos 
ADD COLUMN pagamento BOOLEAN DEFAULT FALSE;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.lancamentos.pagamento IS 'Indica se o lançamento foi pago pela sacoleira';
