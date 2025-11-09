import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Mail, User, Lock, Save } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user, changePassword, updateAccount } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const handleSaveNotifications = () => {
    toast.success("Preferências de notificação atualizadas!");
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingAccount(true);

    try {
      const result = await updateAccount(name, email);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro inesperado ao atualizar a conta.");
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      setIsChangingPassword(false);
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      setIsChangingPassword(false);
      return;
    }

    try {
      const result = await changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      if (result.success) {
        toast.success(result.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro inesperado ao alterar senha.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <AppLayout title="Configurações">
      <div className="max-w-4xl space-y-6">
        {/* Card de Notificações (simulado) */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Gerencie como você deseja receber notificações e atualizações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ... (conteúdo das notificações, não precisa mexer) ... */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="push-notifications"
                    className="text-base font-medium"
                  >
                    Notificações Push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações em tempo real no navegador
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center gap-2 pt-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <h4 className="font-medium">Notificações por Email</h4>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="email-notifications"
                    className="text-base font-medium"
                  >
                    Ativar Email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações por email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
            <Button onClick={handleSaveNotifications} className="mt-4">
              <Save className="w-4 h-4 mr-2" />
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>

        {/* Card de Configurações da Conta (conectado) */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Configurações da Conta
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Perfil</Label>
                <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                  {user?.role === "engineer" && "Engenheiro"}
                  {user?.role === "manager" && "Gestor de Obras"}
                  {user?.role === "client" && "Cliente"}
                </div>
              </div>
              <Button
                type="submit"
                className="mt-4"
                disabled={isUpdatingAccount}
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdatingAccount ? "Salvando..." : "Atualizar Informações"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Card de Alterar Senha (conectado) */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <Button
                type="submit"
                className="mt-4"
                disabled={isChangingPassword}
              >
                <Lock className="w-4 h-4 mr-2" />
                {isChangingPassword ? "Alterando..." : "Alterar Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
