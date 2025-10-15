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
    unloading: number;
    labeling: number;
    inspection: number;
    storage: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

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

    const unloading = (pallets * 71) / 60;
    const labeling = (pallets * 106) / 60;
    const inspection = (pallets * 55) / 60;
    const storage = (pallets * 170) / 60;
    const total = unloading + labeling + inspection + storage;

    setResults({
      unloading,
      labeling,
      inspection,
      storage,
      total,
    });
  };

  const saveCalculation = () => {
    if (!results || !user) return;

    calculations.save({
      userId: user.id,
      supplierName,
      palletCount: parseFloat(palletCount),
      startTime,
      unloadingTime: results.unloading,
      labelingTime: results.labeling,
      inspectionTime: results.inspection,
      storageTime: results.storage,
      totalTime: results.total,
    });

    toast.success("Cálculo salvo com sucesso!");
    
    // Reset form
    setSupplierName("");
    setPalletCount("");
    setStartTime("");
    setResults(null);
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    navigate("/auth");
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
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
                  <h3 className="text-lg font-semibold">Resultados</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Package className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Descarregamento</p>
                            <p className="text-2xl font-bold">{formatTime(results.unloading)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Tag className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Etiquetagem</p>
                            <p className="text-2xl font-bold">{formatTime(results.labeling)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <ClipboardCheck className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Conferência</p>
                            <p className="text-2xl font-bold">{formatTime(results.inspection)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Archive className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Guarda</p>
                            <p className="text-2xl font-bold">{formatTime(results.storage)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-accent text-accent-foreground border-accent">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Tempo Total</p>
                          <p className="text-3xl font-bold">{formatTime(results.total)}</p>
                        </div>
                        <Clock className="h-12 w-12 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

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
