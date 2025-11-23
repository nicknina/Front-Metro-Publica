import { useState } from "react";
import axios, { AxiosError } from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

// --- Interfaces ---
interface ResultadoItem {
  detectado: number;
  esperado: number;
  status: string;
}

interface ResultadoAnalise {
  dia: number;
  imagem: string;
  [key: string]: number | string | ResultadoItem;
}

interface ErroAPI {
  erro: string;
}

export function ProjectDetails() {
  const { toast } = useToast();
  const [planejamentoFile, setPlanejamentoFile] = useState<File | null>(null);
  const [imagensFiles, setImagensFiles] = useState<FileList | null>(null);

  const [resultados, setResultados] = useState<ResultadoAnalise[]>([]);
  const [colunas, setColunas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers de Arquivo ---
  const handlePlanejamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPlanejamentoFile(e.target.files[0]);
  };

  const handleImagensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImagensFiles(e.target.files);
  };

  // --- Envio para a API ---
  const handleSubmit = async () => {
    if (!planejamentoFile || !imagensFiles || imagensFiles.length === 0) {
      toast({
        title: "Arquivos faltando",
        description:
          "Por favor, selecione o arquivo de planejamento e as fotos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResultados([]);
    setColunas([]);

    const formData = new FormData();
    formData.append("planejamento", planejamentoFile);
    for (let i = 0; i < imagensFiles.length; i++) {
      formData.append("imagens", imagensFiles[i]);
    }

    try {
      const response = await axios.post<ResultadoAnalise[]>(
        "http://localhost:5000/processar-projeto",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data && response.data.length > 0) {
        const colunasDinamicas = Object.keys(response.data[0]).filter(
          (key) => key !== "dia" && key !== "imagem"
        );
        setColunas(colunasDinamicas);
        setResultados(response.data);
        toast({
          title: "Sucesso!",
          description: "Análise concluída com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      let errorMessage = "Não foi possível conectar ao servidor.";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErroAPI>;
        if (axiosError.response?.data?.erro)
          errorMessage = axiosError.response.data.erro;
      }
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Exportar Excel (Formato Tabela Cruzada) ---
  const handleExportExcel = () => {
    if (resultados.length === 0) return;

    // 1. Cabeçalho: Dia, Item 1, Item 2, ...
    const header = ["Dia", ...colunas.map((c) => c.replace(/_/g, " "))];

    // 2. Linhas de Dados: Dia, "0/0 OK", "10/10 OK"...
    const rows = resultados.map((r) => {
      const dadosColunas = colunas.map((c) => {
        const item = r[c] as ResultadoItem;
        // Formata a célula exatamente como no seu exemplo: "30/30 ✅ OK"
        const icon = item.status === "OK" ? "✅" : "❌";
        return `${item.detectado}/${item.esperado} ${icon} ${item.status}`;
      });
      return [r.dia, ...dadosColunas];
    });

    // 3. Monta o CSV (usando ponto e vírgula para Excel BR)
    const BOM = "\uFEFF"; // Adiciona BOM para acentos funcionarem no Excel
    const csvContent =
      BOM + [header.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "relatorio_acompanhamento.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Gera o Resumo Explicativo em Texto ---
  const generateSummary = () => {
    const issues: JSX.Element[] = [];
    let issueCount = 0;

    resultados.forEach((r) => {
      colunas.forEach((c) => {
        const item = r[c] as ResultadoItem;
        const nomeItem = c.replace(/_/g, " ");

        // Se não estiver OK (falta)
        if (item.status !== "OK") {
          issueCount++;
          issues.push(
            <li key={`${r.dia}-${c}`} className="text-sm text-red-600">
              <strong>Dia {r.dia}:</strong> Faltam{" "}
              {item.esperado - item.detectado} unidades de{" "}
              <strong>{nomeItem}</strong>. (Detectado: {item.detectado} / Meta:{" "}
              {item.esperado})
            </li>
          );
        }
        // Se tiver Excesso (detectado > esperado) - A API retorna OK, mas podemos avisar visualmente
        else if (item.detectado > item.esperado) {
          issueCount++;
          issues.push(
            <li key={`${r.dia}-${c}`} className="text-sm text-amber-600">
              <strong>Dia {r.dia}:</strong> Excesso de{" "}
              {item.detectado - item.esperado} unidades de{" "}
              <strong>{nomeItem}</strong>. (Detectado: {item.detectado} / Meta:{" "}
              {item.esperado})
            </li>
          );
        }
      });
    });

    if (issueCount === 0) {
      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800">Execução Perfeita</h4>
            <p className="text-sm text-green-700">
              Todos os itens detectados correspondem exatamente ao planejamento.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div className="w-full">
          <h4 className="font-semibold text-amber-800 mb-2">
            Atenção aos seguintes pontos ({issueCount}):
          </h4>
          <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto pr-2">
            {issues}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <AppLayout title="Análise de Progresso da Obra">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Card de Upload e Ação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Search className="w-5 h-5 text-primary" />
                Nova Análise
              </CardTitle>
              <CardDescription>
                Carregue o planejamento e as fotos para gerar o comparativo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Planejamento */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    1. Planilha de Planejamento
                  </Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-muted/50 transition-all cursor-pointer relative group">
                    <FileSpreadsheet className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground text-center px-4 truncate w-full font-medium">
                      {planejamentoFile ? (
                        <span className="text-foreground">
                          {planejamentoFile.name}
                        </span>
                      ) : (
                        "Clique para selecionar o .xlsx"
                      )}
                    </span>
                    <Input
                      type="file"
                      accept=".xlsx"
                      onChange={handlePlanejamentoChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Input Imagens */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    2. Fotos do Local (Dia 1 a 5)
                  </Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-muted/50 transition-all cursor-pointer relative group">
                    <Upload className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground text-center px-4 font-medium">
                      {imagensFiles ? (
                        <span className="text-foreground">
                          {imagensFiles.length} fotos selecionadas
                        </span>
                      ) : (
                        "Selecione as 5 imagens"
                      )}
                    </span>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagensChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t flex justify-end py-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                size="lg"
                className="w-full md:w-auto font-semibold shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processando Inteligência Artificial...
                  </>
                ) : (
                  "Iniciar Análise Comparativa"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Card de Resumo (Aparece após análise) */}
          <Card className="shadow-sm border-border/60 flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-lg">Resumo Executivo</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {resultados.length > 0 ? (
                generateSummary()
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground border rounded-lg border-dashed">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">
                    Aguardando processamento para exibir o resumo das
                    divergências.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Resultados Detalhada */}
        {resultados.length > 0 && (
          <Card className="shadow-md border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b bg-muted/10">
              <div>
                <CardTitle>Relatório Detalhado</CardTitle>
                <CardDescription>
                  Comparativo item a item por dia de execução.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="shadow-sm border-primary/20 hover:bg-primary/5 text-primary"
                onClick={handleExportExcel}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Relatório Excel
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[80px] font-bold text-center">
                        Dia
                      </TableHead>
                      <TableHead className="w-[180px] font-bold">
                        Imagem Analisada
                      </TableHead>
                      {colunas.map((col) => (
                        <TableHead
                          key={col}
                          className="font-bold capitalize text-center min-w-[140px]"
                        >
                          {col.replace(/_/g, " ")}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((linha) => (
                      <TableRow key={linha.dia} className="hover:bg-muted/5">
                        <TableCell className="font-bold text-center text-lg text-muted-foreground/80">
                          {linha.dia}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[150px] font-mono bg-muted/10">
                          {linha.imagem}
                        </TableCell>
                        {colunas.map((col) => {
                          const item = linha[col] as ResultadoItem;
                          // Lógica de Cores e Badges
                          let statusColor =
                            "bg-green-100 text-green-700 border-green-200 hover:bg-green-100";
                          let statusText = "OK";

                          if (item.status !== "OK") {
                            statusColor =
                              "bg-red-100 text-red-700 border-red-200 hover:bg-red-100";
                            statusText = `Falta ${
                              item.esperado - item.detectado
                            }`;
                          } else if (item.detectado > item.esperado) {
                            statusColor =
                              "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100";
                            statusText = `+${
                              item.detectado - item.esperado
                            } Extra`;
                          }

                          return (
                            <TableCell key={col} className="text-center p-2">
                              <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-md transition-colors hover:bg-muted/10">
                                <div className="flex items-baseline gap-1">
                                  <span
                                    className={`text-lg font-bold ${
                                      item.detectado < item.esperado
                                        ? "text-red-600"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {item.detectado}
                                  </span>
                                  <span className="text-xs text-muted-foreground font-medium">
                                    / {item.esperado}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] h-5 px-2 shadow-sm ${statusColor}`}
                                >
                                  {statusText}
                                </Badge>
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
