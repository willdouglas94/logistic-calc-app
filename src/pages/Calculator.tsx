import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Package, Clock, Tag, ClipboardCheck, Archive, LogOut, History } from "lucide-react";
import { auth, calculations } from "@/lib/auth";
import { toast } from "sonner";

const Calculator = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.getCurrentUser());
  const [supplierName, setSupplierName] = useState("");
  const [palletCount, setPalletCount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [results, setResults] = useState<{
    startTime: string;
    unloadingEnd: string;
    labelingEnd: string;
    inspectionEnd: string;
    storageEnd: string;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const addMinutesToTime = (timeString: string, minutes: number): string => {
    const [hours, mins] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = Math.round(totalMinutes % 60);
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  };

  const calculateTimes = () => {
    const pallets = parseFloat(palletCount);
    if (!pallets || pallets <= 0) {
      toast.error("Por favor, insira uma quantidade válida de paletes");
      return;
    }
    if (!supplierName.trim()) {
      toast.error("Por favor, insira o nome do fornecedor");
      return;
    }
    if (!startTime) {
      toast.error("Por favor, insira a hora inicial");
      return;
    }

    const unloadingDuration = (pallets * 71) / 60;
    const labelingDuration = (pallets * 106) / 60;
    const inspectionDuration = (pallets * 55) / 60;
    const storageDuration = (pallets * 170) / 60;

    const unloadingEnd = addMinutesToTime(startTime, unloadingDuration);
    const labelingEnd = addMinutesToTime(unloadingEnd, labelingDuration);
    const inspectionEnd = addMinutesToTime(labelingEnd, inspectionDuration);
    const storageEnd = addMinutesToTime(inspectionEnd, storageDuration);

    setResults({
      startTime,
      unloadingEnd,
      labelingEnd,
      inspectionEnd,
      storageEnd,
    });
  };

  const saveCalculation = () => {
    if (!results || !user) {
      toast.error("Erro ao salvar: dados incompletos");
      return;
    }

    try {
      calculations.save({
        userId: user.id,
        supplierName,
        palletCount: parseFloat(palletCount),
        startTime: results.startTime,
        unloadingTime: results.unloadingEnd,
        labelingTime: results.labelingEnd,
        inspectionTime: results.inspectionEnd,
        storageTime: results.storageEnd,
        totalTime: results.storageEnd,
      });

      toast.success("Cálculo salvo com sucesso! Redirecionando para o histórico...");
      
      // Reset form
      setSupplierName("");
      setPalletCount("");
      setStartTime("");
      setResults(null);
      
      // Navigate to history after a short delay
      setTimeout(() => {
        navigate("/history");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar cálculo:", error);
      toast.error("Erro ao salvar cálculo. Tente novamente.");
    }
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    navigate("/auth");
  };


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calculadora Logística</h1>
            <p className="text-muted-foreground">Olá, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/history")}>
              <History className="h-4 w-4 mr-2" />
              Histórico
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novo Cálculo</CardTitle>
            <CardDescription>
              Insira os dados para calcular os tempos de operação logística
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="supplier">Nome do Fornecedor</Label>
                <Input
                  id="supplier"
                  placeholder="Ex: Fornecedor ABC"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pallets">Quantidade de Paletes</Label>
                <Input
                  id="pallets"
                  type="number"
                  min="1"
                  placeholder="Ex: 50"
                  value={palletCount}
                  onChange={(e) => setPalletCount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora Inicial</Label>
                <Input
                  id="time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculateTimes} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Calcular Tempos
            </Button>

            {results && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Resultados - Tempos de Conclusão</h3>
                  <div className="grid gap-3">
                    <Card className="border-accent/30 bg-accent/10">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <Clock className="h-6 w-6 text-accent-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">🕓 Tempo Inicial</p>
                            <p className="text-xl font-bold">{results.startTime}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <Package className="h-6 w-6 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">🚚 Tempo Final de Descarregamento</p>
                            <p className="text-xl font-bold">{results.unloadingEnd}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <Tag className="h-6 w-6 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">🏷️ Tempo Final de Etiquetagem</p>
                            <p className="text-xl font-bold">{results.labelingEnd}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <ClipboardCheck className="h-6 w-6 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">📋 Tempo Final de Conferência</p>
                            <p className="text-xl font-bold">{results.inspectionEnd}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <Archive className="h-6 w-6 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">🏠 Tempo Final de Guarda</p>
                            <p className="text-xl font-bold">{results.storageEnd}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Button onClick={saveCalculation} className="w-full" variant="default">
                    Salvar Cálculo
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
