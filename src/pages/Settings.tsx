import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';

const Settings = () => {
  return (
    <AppLayout title="Configurações">
      <Card className="shadow-card">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Página de configurações em desenvolvimento</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Settings;
