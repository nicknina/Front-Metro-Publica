import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { mockProjects } from '@/data/mockData';
import { Briefcase, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const activeProjects = mockProjects.filter(p => p.status === 'em-andamento');
  const completedProjects = mockProjects.filter(p => p.status === 'concluida');
  const totalAlerts = mockProjects.reduce((acc, p) => acc + p.alertsCount, 0);

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Obras em Andamento"
            value={activeProjects.length}
            icon={Briefcase}
            variant="default"
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="Obras Concluídas"
            value={completedProjects.length}
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Alertas Críticos"
            value={totalAlerts}
            icon={AlertTriangle}
            variant="warning"
            trend={{ value: -15, isPositive: false }}
          />
        </div>

        {/* Active Projects and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Obras Mais Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProjects.slice(0, 5).map(project => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{project.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{project.client}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{project.progress}%</div>
                        <div className="text-xs text-muted-foreground">progresso</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Feed */}
          <div>
            <AlertFeed />
          </div>
        </div>

        {/* Recent Projects Grid */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Projetos Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.slice(0, 3).map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
