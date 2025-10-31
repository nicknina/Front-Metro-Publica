export type UserRole = 'engineer' | 'manager' | 'client';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export type ProjectStatus = 'em-andamento' | 'concluida' | 'atrasada';

export interface MockProject {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  thumbnailUrl: string;
  alertsCount: number;
}

export interface ComparisonPair {
  id: string;
  title: string;
  realPhotoUrl: string;
  bimRenderUrl: string;
  date: string;
  notes?: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface MockProjectDetails extends MockProject {
  timeline: TimelineEvent[];
  comparisonPairs: ComparisonPair[];
}

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@bimtrack.com',
    role: 'engineer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@bimtrack.com',
    role: 'manager',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  },
  {
    id: '3',
    name: 'Maria Costa',
    email: 'maria.costa@construtora.com',
    role: 'client',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  },
];

// Mock Projects
export const mockProjects: MockProject[] = [
  {
    id: '1',
    name: 'Edifício Alpha Tower',
    client: 'Construtora Premium',
    status: 'em-andamento',
    progress: 67,
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    alertsCount: 2,
  },
  {
    id: '2',
    name: 'Residencial Beta Gardens',
    client: 'Incorporadora Moderna',
    status: 'em-andamento',
    progress: 42,
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    alertsCount: 5,
  },
  {
    id: '3',
    name: 'Shopping Delta Plaza',
    client: 'GrupoCom Empreendimentos',
    status: 'atrasada',
    progress: 28,
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    alertsCount: 8,
  },
  {
    id: '4',
    name: 'Centro Empresarial Gamma',
    client: 'Construtora Excellence',
    status: 'concluida',
    progress: 100,
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    alertsCount: 0,
  },
  {
    id: '5',
    name: 'Ponte Epsilon',
    client: 'Governo Estadual',
    status: 'em-andamento',
    progress: 85,
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    alertsCount: 1,
  },
];

// Mock Project Details
export const mockProjectDetails: Record<string, MockProjectDetails> = {
  '1': {
    ...mockProjects[0],
    timeline: [
      { date: '2024-01-15', event: 'Início das fundações' },
      { date: '2024-03-20', event: 'Conclusão da estrutura 10º andar' },
      { date: '2024-06-10', event: 'Início da instalação de fachada' },
      { date: '2024-09-05', event: 'Início dos acabamentos internos' },
    ],
    comparisonPairs: [
      {
        id: 'comp-1',
        title: 'Fachada Leste - Semana 10',
        realPhotoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
        bimRenderUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800',
        date: '2024-09-15',
        notes: 'Instalação de vidros conforme especificado',
      },
      {
        id: 'comp-2',
        title: 'Hall Principal - Semana 12',
        realPhotoUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
        bimRenderUrl: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800',
        date: '2024-09-29',
        notes: 'Acabamento em mármore aplicado',
      },
      {
        id: 'comp-3',
        title: 'Fundação - Semana 2',
        realPhotoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
        bimRenderUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
        date: '2024-01-29',
        notes: 'Estrutura executada conforme projeto',
      },
    ],
  },
};

// Mock Alerts
export const mockAlerts = [
  {
    id: 'alert-1',
    message: 'Atraso na entrega de materiais',
    project: 'Shopping Delta Plaza',
    severity: 'high' as const,
    date: '2024-10-28',
  },
  {
    id: 'alert-2',
    message: 'Não conformidade detectada na fachada',
    project: 'Residencial Beta Gardens',
    severity: 'medium' as const,
    date: '2024-10-27',
  },
  {
    id: 'alert-3',
    message: 'Revisão de projeto arquitetônico necessária',
    project: 'Edifício Alpha Tower',
    severity: 'low' as const,
    date: '2024-10-25',
  },
  {
    id: 'alert-4',
    message: 'Ajuste na instalação elétrica requerido',
    project: 'Shopping Delta Plaza',
    severity: 'high' as const,
    date: '2024-10-24',
  },
];
