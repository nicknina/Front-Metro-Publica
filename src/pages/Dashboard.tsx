import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Building2,
  ArrowRight,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  getProjects,
  ProjectWithAnalysis,
  resetData,
} from "@/lib/projectStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Cores para os gráficos
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectWithAnalysis[]>([]);
  const [activeProject, setActiveProject] =
    useState<ProjectWithAnalysis | null>(null);

  const loadData = () => {
    const allProjects = getProjects();
    setProjects(allProjects);
    // Pega o primeiro projeto que tem análise feita
    const analyzed = allProjects.find((p) => p.hasAnalysis);
    setActiveProject(analyzed || null);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("project-updated", loadData);
    return () => window.removeEventListener("project-updated", loadData);
  }, []);

  // --- ESTADO 1: DASHBOARD VAZIO (Nenhuma obra analisada) ---
  if (!activeProject) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-card p-8 rounded-full border shadow-lg">
              <Building2 className="w-16 h-16 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-3xl font-bold tracking-tight">
              Bem-vindo ao BIMTrack
            </h2>
            <p className="text-muted-foreground text-lg">
              Sua central de inteligência de obras está pronta. Adicione os
              dados da sua primeira obra para gerar insights com IA.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="gap-2 text-md px-8 h-12"
              onClick={() => navigate("/obras/1")}
            >
              <BarChart3 className="w-5 h-5" />
              Analisar Minha Obra
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 opacity-50 pointer-events-none select-none blur-[2px]">
            {/* Fake cards ao fundo para dar vontade de usar */}
            <div className="w-32 h-20 bg-muted rounded-lg border"></div>
            <div className="w-32 h-20 bg-muted rounded-lg border"></div>
            <div className="w-32 h-20 bg-muted rounded-lg border"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // --- DADOS MOCKADOS PARA "ENCHER LINGUIÇA" (Baseados nos dados reais se possível) ---

  // Gráfico 1: Comparativo Real (Extraído do resultado da IA se disponível, ou mock)
  // Se tivermos dados reais da API salvos, poderíamos processar aqui.
  // Vamos criar um cenário baseados no progresso.
  const comparisonData = [
    {
      name: "Cadeiras",
      planejado: 30,
      executado: activeProject.progress > 50 ? 30 : 15,
    },
    {
      name: "Mesas",
      planejado: 30,
      executado: activeProject.progress > 50 ? 30 : 12,
    },
    { name: "Lousas", planejado: 1, executado: 1 },
    {
      name: "Projetores",
      planejado: 1,
      executado: activeProject.progress > 80 ? 1 : 0,
    },
    { name: "Extintores", planejado: 2, executado: 2 },
  ];

  // Gráfico 2: Evolução Semanal (Mock puro para ficar bonito)
  const evolutionData = [
    { name: "Sem 1", progresso: 10, eficiencia: 80 },
    { name: "Sem 2", progresso: 25, eficiencia: 85 },
    { name: "Sem 3", progresso: 40, eficiencia: 75 },
    { name: "Sem 4", progresso: 55, eficiencia: 90 },
    { name: "Atual", progresso: activeProject.progress, eficiencia: 95 },
  ];

  // Gráfico 3: Distribuição de Status (Pizza)
  const pieData = [
    { name: "Conforme", value: activeProject.progress },
    { name: "Pendente", value: 100 - activeProject.progress },
  ];

  // --- ESTADO 2: DASHBOARD CHEIO (Com dados e gráficos) ---
  return (
    <AppLayout title="Visão Geral da Obra">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header com Status Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Progresso Global</CardDescription>
              <CardTitle className="text-4xl font-bold text-primary flex items-baseline gap-2">
                {activeProject.progress}%
                <span className="text-sm font-normal text-muted-foreground">
                  concluído
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-primary/20 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${activeProject.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                +5% em relação à semana passada
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Divergências Detectadas</CardDescription>
              <CardTitle className="text-4xl font-bold flex items-baseline gap-2 text-amber-600">
                {activeProject.alertsCount}
                <span className="text-sm font-normal text-muted-foreground">
                  itens
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mt-2">
                Itens que não correspondem ao planejamento inicial (ex: falta de
                material ou excesso).
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-xs mt-2 text-amber-600"
                onClick={() => navigate(`/obras/${activeProject.id}`)}
              >
                Ver detalhes <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Eficiência da Equipe</CardDescription>
              <CardTitle className="text-4xl font-bold flex items-baseline gap-2 text-green-600">
                92%
                <span className="text-sm font-normal text-muted-foreground">
                  index
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mt-2">
                Cálculo baseado na velocidade de instalação vs cronograma
                previsto no Excel.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras: Planejado x Executado */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                Planejado vs Executado
              </CardTitle>
              <CardDescription>
                Comparativo item a item da última aferição IA
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="planejado"
                    name="Meta"
                    fill="#e2e8f0"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="executado"
                    name="Realizado"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Área: Evolução */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                Curva S de Evolução
              </CardTitle>
              <CardDescription>
                Histórico de progresso acumulado nas últimas semanas
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData}>
                  <defs>
                    <linearGradient id="colorProg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="progresso"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorProg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Feed e Info Extra */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-card">
            <CardHeader>
              <CardTitle>Status dos Itens</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#22c55e" : "#e2e8f0"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x="50%"
                      dy="-10"
                      fontSize="24"
                      fontWeight="bold"
                      fill="#333"
                    >
                      {activeProject.progress}%
                    </tspan>
                    <tspan x="50%" dy="20" fontSize="12" fill="#888">
                      Concluído
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle>Próximas Atividades Sugeridas</CardTitle>
              <CardDescription>
                IA preditiva baseada no ritmo atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Conferência de Acabamentos",
                  date: "Amanhã",
                  priority: "Alta",
                },
                {
                  title: "Instalação de Elétrica (Sala 2)",
                  date: "Em 2 dias",
                  priority: "Média",
                },
                {
                  title: "Reunião de Alinhamento com Empreiteiro",
                  date: "Sexta-feira",
                  priority: "Baixa",
                },
              ].map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "Alta"
                          ? "bg-red-500"
                          : task.priority === "Média"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Previsão: {task.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Agendar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Botão de Reset (Para testes) */}
        <div className="flex justify-center pt-10 pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs"
            onClick={() => {
              resetData();
              window.location.reload();
            }}
          >
            [Dev] Resetar Demo
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
