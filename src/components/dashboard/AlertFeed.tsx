import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockAlerts } from '@/data/mockData';

const severityConfig = {
  high: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  medium: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  low: { icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
};

export const AlertFeed = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Alertas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', config.bg)}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.project} • {new Date(alert.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
