import { mockProjects, MockProject } from "@/data/mockData";

const STORAGE_KEY = "metro_publica_projects_v2";

// --- NOVOS TIPOS PARA EVITAR O USO DE 'ANY' ---

// Representa o detalhe de um item (ex: Cadeira)
export interface AnalysisItem {
  detectado: number;
  esperado: number;
  status: string;
}

// Representa uma linha completa de dados (Dia + Imagem + Itens)
export interface AnalysisData {
  dia: number;
  imagem: string;
  // Permite propriedades dinâmicas (ex: cadeira_aluno, mesa_prof)
  // que podem ser string, number ou o objeto AnalysisItem
  [key: string]: number | string | AnalysisItem;
}

// Estendemos o tipo do projeto para incluir dados da análise
export interface ProjectWithAnalysis extends MockProject {
  hasAnalysis: boolean;
  lastAnalysisDate?: string;
  analysisData?: AnalysisData[]; // ✅ Agora usamos o tipo correto em vez de 'any'
}

// --- FIM DOS NOVOS TIPOS ---

// Converte os mocks iniciais para o novo formato (resetado)
const initialProjects: ProjectWithAnalysis[] = mockProjects.map((p) => ({
  ...p,
  hasAnalysis: false, // Começa sem análise (Dashboard vazio)
  progress: 0, // Começa zerado
  status: "em-andamento",
  alertsCount: 0,
}));

export const getProjects = (): ProjectWithAnalysis[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Se não tiver nada salvo, inicia com os dados resetados
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
  return initialProjects;
};

export const getProjectById = (id: string) => {
  return getProjects().find((p) => p.id === id);
};

export const saveAnalysisResult = (
  id: string,
  progress: number,
  alerts: number,
  rawData: AnalysisData[] // ✅ Agora usamos o tipo correto aqui também
) => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index !== -1) {
    projects[index].progress = Math.round(progress);
    projects[index].alertsCount = alerts;
    projects[index].hasAnalysis = true; // <--- A MÁGICA: Libera o Dashboard
    projects[index].lastAnalysisDate = new Date().toISOString();
    projects[index].analysisData = rawData;

    // Atualiza status
    if (progress >= 100) projects[index].status = "concluida";
    else projects[index].status = "em-andamento";

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    // Avisa o app que mudou
    window.dispatchEvent(new Event("project-updated"));
  }
};

// Função para resetar tudo (útil para testes)
export const resetData = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("project-updated"));
};
