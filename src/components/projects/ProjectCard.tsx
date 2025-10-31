import { Link } from 'react-router-dom';
import { AlertCircle, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MockProject, ProjectStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: MockProject;
}

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' }> = {
  'em-andamento': { label: 'Em Andamento', variant: 'default' },
  'concluida': { label: 'Concluída', variant: 'success' },
  'atrasada': { label: 'Atrasada', variant: 'destructive' },
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const status = statusConfig[project.status];

  return (
    <Link to={`/obras/${project.id}`}>
      <Card className="overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={project.thumbnailUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          {project.alertsCount > 0 && (
            <div className="absolute top-3 right-3 bg-warning text-warning-foreground rounded-full px-3 py-1 flex items-center gap-1 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {project.alertsCount}
            </div>
          )}
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {project.client}
              </p>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-semibold text-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
