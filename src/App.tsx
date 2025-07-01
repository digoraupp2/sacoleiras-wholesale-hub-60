
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import NovoProduto from "./pages/NovoProduto";
import Categorias from "./pages/Categorias";
import Sacoleiras from "./pages/Sacoleiras";
import NovaSacoleira from "./pages/NovaSacoleira";
import Estoque from "./pages/Estoque";
import Lancamentos from "./pages/Lancamentos";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/produtos" element={
              <ProtectedRoute>
                <Layout>
                  <Produtos />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/produtos/novo" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <NovoProduto />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/categorias" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <Categorias />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/sacoleiras" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <Sacoleiras />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/sacoleiras/nova" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <NovaSacoleira />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/estoque" element={
              <ProtectedRoute>
                <Layout>
                  <Estoque />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/lancamentos" element={
              <ProtectedRoute>
                <Layout>
                  <Lancamentos />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
