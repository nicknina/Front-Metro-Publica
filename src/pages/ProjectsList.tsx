import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { mockProjects, ProjectStatus } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const ProjectsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filterButtons: Array<{ label: string; value: ProjectStatus | 'all' }> = [
    { label: 'Todas', value: 'all' },
    { label: 'Em Andamento', value: 'em-andamento' },
    { label: 'Concluídas', value: 'concluida' },
    { label: 'Atrasadas', value: 'atrasada' },
  ];

  return (
    <AppLayout title="Minhas Obras">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar obra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map(button => (
              <Button
                key={button.value}
                variant={statusFilter === button.value ? 'default' : 'outline'}
                onClick={() => setStatusFilter(button.value)}
                className="whitespace-nowrap"
              >
                {button.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Exibindo {filteredProjects.length} de {mockProjects.length} obras
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma obra encontrada com os filtros aplicados</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectsList;
