
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

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  precoVenda: number;
}

interface Sacoleira {
  id: string;
  nome: string;
}

export const useEstoqueData = () => {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [sacoleiras, setSacoleiras] = useState<Sacoleira[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        console.log('No user found, skipping estoque fetch');
        setEstoque([]);
        setProdutos([]);
        setSacoleiras([]);
        setLoading(false);
        return;
      }

      console.log('Fetching estoque data for user:', user.id);

      // Buscar dados do estoque
      const { data: estoqueData, error: estoqueError } = await supabase
        .from('estoque_sacoleiras')
        .select('*')
        .order('sacoleira_nome', { ascending: true })
        .order('produto_nome', { ascending: true });

      if (estoqueError) {
        console.error('Error fetching estoque:', estoqueError);
        setError('Erro ao carregar dados do estoque');
        return;
      }

      // Buscar produtos com categorias
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          preco_base,
          categorias!inner(nome)
        `)
        .order('nome');

      if (produtosError) {
        console.error('Error fetching produtos:', produtosError);
      }

      // Buscar sacoleiras ativas
      const { data: sacoleirasData, error: sacoleirasError } = await supabase
        .from('sacoleiras')
        .select('id, nome')
        .order('nome');

      if (sacoleirasError) {
        console.error('Error fetching sacoleiras:', sacoleirasError);
      }

      // Transformar dados dos produtos
      const produtosFormatados = (produtosData || []).map(produto => ({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categorias?.nome || 'Sem categoria',
        precoVenda: Number(produto.preco_base || 0)
      }));

      console.log('Estoque data fetched:', estoqueData?.length, 'items');
      console.log('Produtos fetched:', produtosFormatados.length, 'items');
      console.log('Sacoleiras fetched:', sacoleirasData?.length, 'items');

      setEstoque(estoqueData || []);
      setProdutos(produtosFormatados);
      setSacoleiras(sacoleirasData || []);
    } catch (err) {
      console.error('Unexpected error fetching estoque:', err);
      setError('Erro inesperado ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Só buscar dados se o usuário estiver autenticado
    if (user && userProfile) {
      fetchEstoque();
    }
  }, [user?.id, userProfile?.id]); // Mudança: usar apenas IDs específicos

  return {
    estoque,
    produtos,
    sacoleiras,
    loading,
    error,
    refetch: fetchEstoque,
  };
};
