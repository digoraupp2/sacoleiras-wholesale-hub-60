
-- Criar tabela para armazenar os lançamentos
CREATE TABLE public.lancamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES public.produtos(id) NOT NULL,
  sacoleira_id UUID REFERENCES public.sacoleiras(id) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrega', 'devolucao')),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  valor_unitario NUMERIC NOT NULL,
  valor_total NUMERIC NOT NULL,
  observacoes TEXT,
  data_lancamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela lancamentos
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para lançamentos
CREATE POLICY "Allow authenticated users to view lancamentos" ON public.lancamentos
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert lancamentos" ON public.lancamentos
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update lancamentos" ON public.lancamentos
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete lancamentos" ON public.lancamentos
FOR DELETE TO authenticated USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lancamentos_updated_at BEFORE UPDATE ON public.lancamentos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para atualizar movimentações de estoque automaticamente
CREATE OR REPLACE FUNCTION handle_lancamento_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Para INSERT (novo lançamento)
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.movimentacoes (
      produto_id,
      sacoleira_id,
      tipo_movimentacao,
      quantidade,
      valor_unitario,
      observacoes,
      data_movimentacao
    ) VALUES (
      NEW.produto_id,
      NEW.sacoleira_id,
      NEW.tipo,
      NEW.quantidade,
      NEW.valor_unitario,
      NEW.observacoes,
      NEW.data_lancamento
    );
    RETURN NEW;
  END IF;
  
  -- Para UPDATE (lançamento modificado)
  IF TG_OP = 'UPDATE' THEN
    -- Atualizar a movimentação correspondente
    UPDATE public.movimentacoes SET
      produto_id = NEW.produto_id,
      sacoleira_id = NEW.sacoleira_id,
      tipo_movimentacao = NEW.tipo,
      quantidade = NEW.quantidade,
      valor_unitario = NEW.valor_unitario,
      observacoes = NEW.observacoes,
      data_movimentacao = NEW.data_lancamento
    WHERE produto_id = OLD.produto_id 
      AND sacoleira_id = OLD.sacoleira_id 
      AND data_movimentacao = OLD.data_lancamento;
    RETURN NEW;
  END IF;
  
  -- Para DELETE (lançamento excluído)
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.movimentacoes 
    WHERE produto_id = OLD.produto_id 
      AND sacoleira_id = OLD.sacoleira_id 
      AND data_movimentacao = OLD.data_lancamento;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_handle_lancamento_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.lancamentos
  FOR EACH ROW EXECUTE FUNCTION handle_lancamento_changes();

-- Adicionar índices para melhor performance
CREATE INDEX idx_lancamentos_produto_id ON public.lancamentos(produto_id);
CREATE INDEX idx_lancamentos_sacoleira_id ON public.lancamentos(sacoleira_id);
CREATE INDEX idx_lancamentos_data ON public.lancamentos(data_lancamento);
CREATE INDEX idx_movimentacoes_produto_sacoleira ON public.movimentacoes(produto_id, sacoleira_id);
