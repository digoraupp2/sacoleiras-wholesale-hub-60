
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MovimentacaoForm } from "@/components/MovimentacaoForm";
import { EstoqueFilters } from "@/components/EstoqueFilters";
import { EstoqueCard } from "@/components/EstoqueCard";
import { EstoqueEmpty } from "@/components/EstoqueEmpty";
import { useEstoqueData } from "@/hooks/useEstoqueData";
import { useAuth } from "@/contexts/AuthContext";

// Interface para manter compatibilidade com EstoqueCard
interface ProdutoFormatado {
  id: string;
  nome: string;
  categoria: string;
  precoVenda: number;
}

// Interface para manter compatibilidade com EstoqueFilters
interface SacoleiraFormatada {
  id: string;
  nome: string;
}

export function EstoqueRealContent() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroSacoleira, setFiltroSacoleira] = useState("todas");
  const { isAdmin } = useAuth();
  const { estoque, produtos, sacoleiras, loading, error, refetch } = useEstoqueData();

  // Transform estoque data to match the expected format
  const estoqueGrouped = estoque.reduce((acc, item) => {
    const sacoleiraName = item.sacoleira_nome;
    if (!acc[sacoleiraName]) {
      acc[sacoleiraName] = {};
    }
    if (item.quantidade_estoque > 0) {
      acc[sacoleiraName][item.produto_nome] = item.quantidade_estoque;
    }
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Formatar produtos para manter compatibilidade com EstoqueCard
  const produtosFormatados: ProdutoFormatado[] = produtos.map(produto => ({
    id: produto.id,
    nome: produto.nome,
    categoria: produto.categoria,
    precoVenda: produto.precoVenda
  }));

  // Formatar sacoleiras para manter compatibilidade com EstoqueFilters
  const sacoleirasFormatadas: SacoleiraFormatada[] = sacoleiras.map(sacoleira => ({
    id: sacoleira.id,
    nome: sacoleira.nome
  }));

  const categorias = [...new Set(produtos.map(p => p.categoria))];

  // Filter estoque based on search and filters
  const estoqueFiltered = Object.entries(estoqueGrouped).filter(([sacoleira, produtosEstoque]) => {
    const matchesSearch = sacoleira.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSacoleira = filtroSacoleira === "todas" || sacoleira === filtroSacoleira;
    
    if (filtroCategoria === "todas") {
      return matchesSearch && matchesSacoleira;
    }
    
    const hasProductsInCategory = Object.keys(produtosEstoque).some(produtoNome => {
      const produtoInfo = produtos.find(p => p.nome === produtoNome);
      return produtoInfo?.categoria === filtroCategoria;
    });
    
    return matchesSearch && matchesSacoleira && hasProductsInCategory;
  });

  const handleSubmit = async (novaMovimentacao: any) => {
    console.log('New movimentação:', novaMovimentacao);
    setShowForm(false);
    // Refresh data after adding new movement
    await refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando estoque...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
            className="ml-2"
          >
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Estoque das Sacoleiras</h2>
          <p className="text-muted-foreground">Controle o que cada sacoleira tem em estoque</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Movimentação
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
        <MovimentacaoForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          produtos={produtos}
          sacoleiras={sacoleiras}
        />
      )}

      <EstoqueFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        filtroSacoleira={filtroSacoleira}
        setFiltroSacoleira={setFiltroSacoleira}
        categorias={categorias}
        sacoleiras={sacoleirasFormatadas}
      />

      <div className="space-y-4">
        {estoqueFiltered.map(([sacoleira, produtosEstoque]) => (
          <EstoqueCard
            key={sacoleira}
            sacoleira={sacoleira}
            produtos={produtosEstoque}
            mockProdutos={produtosFormatados}
          />
        ))}
      </div>

      {estoqueFiltered.length === 0 && (
        <EstoqueEmpty
          filtroSacoleira={filtroSacoleira === "todas" ? "" : filtroSacoleira}
          filtroCategoria={filtroCategoria === "todas" ? "" : filtroCategoria}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}
