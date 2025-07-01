
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EstoqueItem {
  sacoleira_id: string;
  sacoleira_nome: string;
  produto_id: string;
  produto_nome: string;
  preco_base: number;
  quantidade_estoque: number;
  valor_estoque: number;
}

export const useEstoqueData = () => {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        console.log('No user found, skipping estoque fetch');
        setEstoque([]);
        return;
      }

      console.log('Fetching estoque data for user:', user.id);

      const { data, error } = await supabase
        .from('estoque_sacoleiras')
        .select('*')
        .order('sacoleira_nome', { ascending: true })
        .order('produto_nome', { ascending: true });

      if (error) {
        console.error('Error fetching estoque:', error);
        setError('Erro ao carregar dados do estoque');
        return;
      }

      console.log('Estoque data fetched:', data?.length, 'items');
      setEstoque(data || []);
    } catch (err) {
      console.error('Unexpected error fetching estoque:', err);
      setError('Erro inesperado ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, [user]);

  return {
    estoque,
    loading,
    error,
    refetch: fetchEstoque,
  };
};
