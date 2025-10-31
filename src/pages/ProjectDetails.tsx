import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ImageComparator } from '@/components/projects/ImageComparator';
import { mockProjects, mockProjectDetails } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Calendar, Box, Camera } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedComparison, setSelectedComparison] = useState('0');

  const project = mockProjects.find(p => p.id === id);
  const projectDetails = id ? mockProjectDetails[id] : null;

  if (!project || !projectDetails) {
    return <Navigate to="/obras" replace />;
  }

  const statusConfig = {
    'em-andamento': { label: 'Em Andamento', variant: 'default' as const },
    'concluida': { label: 'Concluída', variant: 'success' as const },
    'atrasada': { label: 'Atrasada', variant: 'destructive' as const },
  };

  const status = statusConfig[project.status];

  return (
    <AppLayout title={project.name}>
      <div className="space-y-6">
        {/* Project Header */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{project.name}</h2>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {project.client}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground">{project.progress}%</div>
                <div className="text-sm text-muted-foreground">Progresso</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={project.progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="comparativo" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="comparativo">Comparativo (Fotos/BIM)</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="visao-geral" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectDetails.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-24 text-sm text-muted-foreground shrink-0">
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex-1 pb-4 border-l-2 border-muted pl-4">
                        <p className="text-foreground">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documentos">
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Documentos serão exibidos aqui</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparativo" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Selecionar Comparação</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedComparison} onValueChange={setSelectedComparison}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {projectDetails.comparisonPairs.map((pair, index) => (
                      <SelectItem key={pair.id} value={index.toString()}>
                        {pair.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <ImageComparator pair={projectDetails.comparisonPairs[parseInt(selectedComparison)]} />

            {/* AR/BIM Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" size="lg" className="h-auto py-4">
                <Box className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Visualizar Modelo 3D</div>
                  <div className="text-xs text-muted-foreground">Abrir viewer BIM interativo</div>
                </div>
              </Button>
              <Button variant="outline" size="lg" className="h-auto py-4">
                <Camera className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Abrir em AR</div>
                  <div className="text-xs text-muted-foreground">Visualizar no local com câmera</div>
                </div>
              </Button>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="equipe">
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Informações da equipe serão exibidas aqui</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
