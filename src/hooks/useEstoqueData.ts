
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

      if (!user?.id) {
        console.log('No user found, skipping estoque fetch');
        setEstoque([]);
        setProdutos([]);
        setSacoleiras([]);
        return;
      }

      console.log('=== FETCHING ESTOQUE DATA ===');
      console.log('User ID:', user.id);

      // Buscar dados do estoque via view
      const { data: estoqueData, error: estoqueError } = await supabase
        .from('estoque_sacoleiras')
        .select('*')
        .order('sacoleira_nome', { ascending: true })
        .order('produto_nome', { ascending: true });

      if (estoqueError) {
        console.error('Error fetching estoque via view:', estoqueError);
        // Fallback: tentar buscar diretamente das tabelas
        console.log('Tentando fallback...');
        
        const { data: movimentacoesData, error: movError } = await supabase
          .from('movimentacoes')
          .select(`
            sacoleira_id,
            produto_id,
            tipo_movimentacao,
            quantidade,
            valor_unitario
          `);

        if (movError) {
          console.error('Error fetching movimentacoes:', movError);
          setError('Erro ao carregar dados do estoque');
          return;
        }

        console.log('Movimentações encontradas:', movimentacoesData?.length || 0);
        setEstoque([]);
      } else {
        console.log('Estoque data fetched via view:', estoqueData?.length || 0);
        setEstoque(estoqueData || []);
      }

      // Buscar produtos
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          preco_base,
          categoria_id,
          categorias!inner(nome)
        `)
        .order('nome');

      if (produtosError) {
        console.error('Error fetching produtos:', produtosError);
        // Tentar sem join com categorias
        const { data: produtosSemCategoria, error: produtosSemCategoriaError } = await supabase
          .from('produtos')
          .select('id, nome, preco_base')
          .order('nome');

        if (produtosSemCategoriaError) {
          console.error('Error fetching produtos sem categoria:', produtosSemCategoriaError);
        } else {
          const produtosFormatados = (produtosSemCategoria || []).map(produto => ({
            id: produto.id,
            nome: produto.nome,
            categoria: 'Sem categoria',
            precoVenda: Number(produto.preco_base || 0)
          }));
          setProdutos(produtosFormatados);
        }
      } else {
        const produtosFormatados = (produtosData || []).map(produto => ({
          id: produto.id,
          nome: produto.nome,
          categoria: produto.categorias?.nome || 'Sem categoria',
          precoVenda: Number(produto.preco_base || 0)
        }));
        setProdutos(produtosFormatados);
      }

      // Buscar sacoleiras ativas
      const { data: sacoleirasData, error: sacoleirasError } = await supabase
        .from('sacoleiras')
        .select('id, nome')
        .order('nome');

      if (sacoleirasError) {
        console.error('Error fetching sacoleiras:', sacoleirasError);
      } else {
        console.log('Sacoleiras fetched:', sacoleirasData?.length || 0);
        setSacoleiras(sacoleirasData || []);
      }

    } catch (err) {
      console.error('Unexpected error fetching estoque:', err);
      setError('Erro inesperado ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && userProfile?.id) {
      console.log('Iniciando fetch de estoque para user:', user.id);
      fetchEstoque();
    } else {
      console.log('Aguardando autenticação completa...');
      setLoading(false);
    }
  }, [user?.id, userProfile?.id]); // Apenas IDs para evitar loops

  return {
    estoque,
    produtos,
    sacoleiras,
    loading,
    error,
    refetch: fetchEstoque,
  };
};
