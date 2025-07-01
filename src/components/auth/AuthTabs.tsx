
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthTabs() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Entrar</TabsTrigger>
        <TabsTrigger value="signup">Criar Conta</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Entrar na sua conta</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Criar nova conta</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
