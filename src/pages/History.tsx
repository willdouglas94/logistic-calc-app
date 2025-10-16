import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Calendar, Building2 } from "lucide-react";
import { auth, calculations, Calculation } from "@/lib/auth";
import { format } from "date-fns";

const History = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.getCurrentUser());
  const [allCalculations, setAllCalculations] = useState<Calculation[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<Calculation[]>([]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const calcs = calculations.getAll(user.id);
    setAllCalculations(calcs);
    setFilteredCalculations(calcs);
  }, [user, navigate]);

  useEffect(() => {
    let filtered = allCalculations;

    if (supplierFilter) {
      filtered = filtered.filter((calc) =>
        calc.supplierName.toLowerCase().includes(supplierFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((calc) => {
        const calcDate = format(new Date(calc.createdAt), "yyyy-MM-dd");
        return calcDate === dateFilter;
      });
    }

    setFilteredCalculations(filtered);
  }, [supplierFilter, dateFilter, allCalculations]);


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <div className="max-w-7xl mx-auto space-y-6 py-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/calculator")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Histórico de Cálculos</h1>
            <p className="text-muted-foreground">Visualize todos os seus cálculos anteriores</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtre seus cálculos por fornecedor ou data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar por fornecedor"
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cálculos ({filteredCalculations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCalculations.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {allCalculations.length === 0
                    ? "Nenhum cálculo encontrado. Faça seu primeiro cálculo!"
                    : "Nenhum cálculo encontrado com os filtros aplicados."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-right">Paletes</TableHead>
                      <TableHead>Hora Inicial</TableHead>
                      <TableHead className="text-right">Fim Descarreg.</TableHead>
                      <TableHead className="text-right">Fim Etiquetagem</TableHead>
                      <TableHead className="text-right">Fim Conferência</TableHead>
                      <TableHead className="text-right">Fim Guarda</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalculations.map((calc) => (
                      <TableRow key={calc.id}>
                        <TableCell>
                          {format(new Date(calc.createdAt), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="font-medium">{calc.supplierName}</TableCell>
                        <TableCell className="text-right">{calc.palletCount}</TableCell>
                        <TableCell>{calc.startTime || "-"}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {calc.unloadingTime}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {calc.labelingTime}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {calc.inspectionTime}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {calc.storageTime}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
