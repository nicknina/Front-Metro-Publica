import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { mockProjects } from "@/data/mockData";
import { Briefcase, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const activeProjects = mockProjects.filter(
    (p) => p.status === "em-andamento"
  );
  const completedProjects = mockProjects.filter(
    (p) => p.status === "concluida"
  );
  const totalAlerts = mockProjects.reduce((acc, p) => acc + p.alertsCount, 0);

  return <AppLayout title="Dashboard" children={""}></AppLayout>;
};

export default Dashboard;
