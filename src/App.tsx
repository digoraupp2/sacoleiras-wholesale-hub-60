
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import NovoProduto from "./pages/NovoProduto";
import Categorias from "./pages/Categorias";
import Sacoleiras from "./pages/Sacoleiras";
import NovaSacoleira from "./pages/NovaSacoleira";
import Movimentacoes from "./pages/Movimentacoes";
import Lancamentos from "./pages/Lancamentos";
import Precos from "./pages/Precos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/novo" element={<NovoProduto />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/sacoleiras" element={<Sacoleiras />} />
            <Route path="/sacoleiras/nova" element={<NovaSacoleira />} />
            <Route path="/movimentacoes" element={<Movimentacoes />} />
            <Route path="/lancamentos" element={<Lancamentos />} />
            <Route path="/precos" element={<Precos />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
