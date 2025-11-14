// src/pages/ProjectDetails.tsx
import { useState } from "react";
import axios, { AxiosError } from "axios"; // <-- MUDANÇA: Importamos o AxiosError

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

// --- MUDANÇA: Interfaces mais específicas (sem 'any') ---
// Define o que esperamos para cada item (ex: cadeira_aluno)
interface ResultadoItem {
  detectado: number;
  esperado: number;
  status: string;
}

// Define a linha inteira do resultado
interface ResultadoAnalise {
  dia: number;
  imagem: string;
  // Isso permite colunas dinâmicas (cadeira_aluno, mesa_aluno, etc)
  // mas garante que o valor delas seja um dos tipos que esperamos.
  [key: string]: number | string | ResultadoItem;
}

// Interface para a resposta de erro da nossa API Flask
interface ErroAPI {
  erro: string;
}
// --- Fim das Mudanças na Interface ---

export function ProjectDetails() {
  const [planejamentoFile, setPlanejamentoFile] = useState<File | null>(null);
  const [imagensFiles, setImagensFiles] = useState<FileList | null>(null);

  const [resultados, setResultados] = useState<ResultadoAnalise[]>([]);
  const [colunas, setColunas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanejamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPlanejamentoFile(e.target.files[0]);
    }
  };

  const handleImagensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagensFiles(e.target.files);
    }
  };

  const handleSubmit = async () => {
    if (!planejamentoFile || !imagensFiles || imagensFiles.length === 0) {
      toast({
        title: "Erro",
        description:
          "Por favor, selecione o arquivo de planejamento e pelo menos uma imagem.",
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

    // --- MUDANÇA: Bloco try/catch atualizado ---
    try {
      const response = await axios.post<ResultadoAnalise[]>(
        "http://localhost:5000/processar-projeto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const colunasDinamicas = Object.keys(response.data[0]).filter(
          (key) => key !== "dia" && key !== "imagem"
        );
        setColunas(colunasDinamicas);
        setResultados(response.data);
        toast({
          title: "Sucesso!",
          description: "Análise concluída. Veja os resultados abaixo.",
        });
      } else {
        toast({
          title: "Aviso",
          description:
            "A análise foi concluída, mas nenhum resultado foi retornado.",
          variant: "default",
        });
      }
    } catch (error) {
      // <-- MUDANÇA: 'any' removido. O tipo padrão 'unknown' será usado.
      console.error("Erro ao processar:", error);

      let errorMessage = "Não foi possível conectar ao servidor de análise.";

      // Verificamos se o erro é um erro do Axios
      if (axios.isAxiosError(error)) {
        // Agora podemos acessar 'error.response' com segurança
        const axiosError = error as AxiosError<ErroAPI>; // Dizemos ao TS que esperamos a interface ErroAPI
        if (axiosError.response?.data?.erro) {
          errorMessage = axiosError.response.data.erro;
        }
      } else if (error instanceof Error) {
        // Se for um erro genérico
        errorMessage = error.message;
      }

      toast({
        title: "Erro de API",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    // --- Fim das Mudanças no try/catch ---
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detalhes do Projeto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg mb-8 bg-card">
        <div>
          <Label htmlFor="planejamento" className="text-lg font-semibold">
            1. Arquivo de Planejamento (.xlsx)
          </Label>
          <Input
            id="planejamento"
            type="file"
            accept=".xlsx"
            onChange={handlePlanejamentoChange}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="imagens" className="text-lg font-semibold">
            2. Fotos dos Dias (.png, .jpg)
          </Label>
          <Input
            id="imagens"
            type="file"
            accept="image/png, image/jpeg"
            multiple
            onChange={handleImagensChange}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Segure Ctrl/Cmd para selecionar as 5 imagens.
          </p>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button onClick={handleSubmit} disabled={isLoading} size="lg">
            {isLoading ? "Processando..." : "Iniciar Análise e Gerar Relatório"}
          </Button>
        </div>
      </div>

      {/* Seção de Resultados */}
      {resultados.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Relatório de Comparação</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Dia</TableHead>
                  <TableHead className="font-bold">Imagem</TableHead>
                  {colunas.map((col) => (
                    <TableHead key={col} className="font-bold capitalize">
                      {col.replace(/_/g, " ")}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((linha) => (
                  <TableRow key={linha.dia}>
                    <TableCell className="font-medium">{linha.dia}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {linha.imagem}
                    </TableCell>
                    {colunas.map((col) => (
                      <TableCell key={col}>
                        {/* Verificamos se o item existe antes de tentar acessá-lo */}
                        {linha[col] && typeof linha[col] === "object" ? (
                          <>
                            <span
                              className={
                                (linha[col] as ResultadoItem).status.startsWith(
                                  "❌"
                                )
                                  ? "text-red-500"
                                  : "text-green-600"
                              }
                            >
                              {(linha[col] as ResultadoItem).detectado} /{" "}
                              {(linha[col] as ResultadoItem).esperado}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({(linha[col] as ResultadoItem).status})
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
