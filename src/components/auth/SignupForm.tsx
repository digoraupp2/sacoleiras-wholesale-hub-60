
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SignupForm({ isLoading, setIsLoading }: SignupFormProps) {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'admin' | 'sacoleira'>('sacoleira');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nome) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Para sacoleiras, a senha é obrigatória
    if (tipo === 'sacoleira' && !password) {
      setError('Por favor, preencha a senha');
      return;
    }

    if (tipo === 'sacoleira' && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await signUp(email, password, nome, tipo);

      if (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Erro ao criar conta';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        const successMessage = tipo === 'admin' 
          ? 'Conta de administrador criada com sucesso! A senha padrão foi definida automaticamente. Verifique seu email para confirmar a conta.'
          : 'Conta criada com sucesso! Verifique seu email para confirmar a conta.';
        setSuccess(successMessage);
        
        toast({
          title: "Conta criada!",
          description: tipo === 'admin' 
            ? "Conta de administrador criada! Senha padrão definida automaticamente."
            : "Verifique seu email para confirmar a conta.",
        });

        // Clear form on success
        setEmail('');
        setPassword('');
        setNome('');
        setTipo('sacoleira');
      }
    } catch (err) {
      console.error('Signup catch error:', err);
      const errorMessage = 'Erro inesperado ao criar conta';
      setError(errorMessage);
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  // Clear errors when inputs change
  React.useEffect(() => {
    setError('');
    setSuccess('');
  }, [email, password, nome, tipo]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-nome">Nome completo</Label>
        <Input
          id="signup-nome"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-tipo">Tipo de usuário</Label>
        <Select 
          value={tipo} 
          onValueChange={(value: 'admin' | 'sacoleira') => setTipo(value)}
          disabled={isLoading}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sacoleira">Sacoleira</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {tipo === 'admin' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Para usuários administradores, a senha padrão será definida automaticamente pelo sistema.
          </AlertDescription>
        </Alert>
      )}
      
      {tipo === 'sacoleira' && (
        <div className="space-y-2">
          <Label htmlFor="signup-password">Senha</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={6}
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Criar Conta
      </Button>
    </form>
  );
}
