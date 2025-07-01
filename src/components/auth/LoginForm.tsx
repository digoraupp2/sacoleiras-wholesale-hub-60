
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function LoginForm({ isLoading, setIsLoading }: LoginFormProps) {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme seu email antes de fazer login';
        } else if (error.message.includes('Invalid refresh token')) {
          errorMessage = 'Sessão expirada. Tente fazer login novamente';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao sistema.",
        });
      }
    } catch (err) {
      console.error('Login catch error:', err);
      const errorMessage = 'Erro inesperado ao fazer login';
      setError(errorMessage);
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  // Clear error when inputs change
  React.useEffect(() => {
    setError('');
  }, [email, password]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Entrar
      </Button>
    </form>
  );
}
