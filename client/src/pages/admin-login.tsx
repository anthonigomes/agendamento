import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para o painel administrativo...",
        });
        setLocation("/admin");
      } else {
        toast({
          title: "Senha incorreta",
          description: "Por favor, tente novamente.",
          variant: "destructive",
        });
        setPassword("");
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md" data-testid="card-login">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="h-6 w-6 text-primary" data-testid="icon-lock" />
          </div>
          <CardTitle className="text-2xl" data-testid="login-title">Área Administrativa</CardTitle>
          <CardDescription data-testid="login-description">
            Digite a senha do administrador para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha do administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
                data-testid="input-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? "Verificando..." : "Entrar"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              Voltar para início
            </Button>
          </form>
        </CardContent>
      </Card>

      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground" data-testid="footer">
        Sistema desenvolvido pelo Prof. Antonio Gomes
      </footer>
    </div>
  );
}
