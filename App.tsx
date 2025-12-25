import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FinancialState, Category, MonthlyData, ChartDataPoint, TransactionInput } from './types';
import { SummaryCards } from './components/SummaryCards';
import { FinancialCharts } from './components/FinancialCharts';
import { FinancialTable } from './components/FinancialTable';
import { AIAdvisor } from './components/AIAdvisor';
import { TransactionForm } from './components/TransactionForm';
import { exportToCSV } from './utils/export';
import { LayoutDashboard, FileSpreadsheet, PlusCircle, Download, Upload, Save } from 'lucide-react';

// Initialize with data similar to the user's CSV pattern, but extrapolated for 2026
const INITIAL_INCOME = 4500; 
const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const generateInitialData = (): FinancialState => {
  const months: MonthlyData[] = MONTH_NAMES.map((name, index) => {
    const isHighExpenseMonth = index === 2 || index === 5 || index === 11; // Mar, Jun, Dec
    
    return {
      monthIndex: index,
      monthName: name,
      income: index === 11 ? INITIAL_INCOME * 1.5 : INITIAL_INCOME,
      expenses: {
        [Category.EssentialFood]: Math.floor(200 + Math.random() * 200),
        [Category.DiningOut]: Math.floor(50 + Math.random() * 150),
        [Category.Entertainment]: isHighExpenseMonth ? 500 : Math.floor(50 + Math.random() * 200),
        [Category.Studies]: index === 1 ? 1500 : Math.floor(Math.random() * 100),
        [Category.Housing]: Math.floor(2400 + Math.random() * 300),
        [Category.Personal]: Math.floor(400 + Math.random() * 400),
        [Category.Health]: Math.floor(Math.random() * 150),
        [Category.Transport]: Math.floor(200 + Math.random() * 300),
      }
    };
  });

  return {
    year: 2026,
    months
  };
};

const STORAGE_KEY = 'financas_2026_data_v1';

const App: React.FC = () => {
  // Load initial state from LocalStorage if available
  const [financialData, setFinancialData] = useState<FinancialState>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    }
    return generateInitialData();
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save whenever financialData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(financialData));
  }, [financialData]);

  const handleUpdateValue = (monthIndex: number, category: Category, value: number) => {
    setFinancialData(prev => {
      const newMonths = [...prev.months];
      newMonths[monthIndex] = {
        ...newMonths[monthIndex],
        expenses: {
          ...newMonths[monthIndex].expenses,
          [category]: value
        }
      };
      return { ...prev, months: newMonths };
    });
  };

  const handleUpdateIncome = (monthIndex: number, value: number) => {
    setFinancialData(prev => {
      const newMonths = [...prev.months];
      newMonths[monthIndex] = {
        ...newMonths[monthIndex],
        income: value
      };
      return { ...prev, months: newMonths };
    });
  };

  const handleAddTransaction = (transaction: TransactionInput) => {
    const installmentValue = transaction.amount / transaction.installments;
    
    // Determine start month from date (0-11)
    const startMonthIndex = parseInt(transaction.date.split('-')[1]) - 1; 

    setFinancialData(prev => {
      const newMonths = [...prev.months];

      for (let i = 0; i < transaction.installments; i++) {
        const targetMonthIndex = startMonthIndex + i;
        
        // Only apply if within the current year (0-11)
        if (targetMonthIndex >= 0 && targetMonthIndex <= 11) {
          const currentExp = newMonths[targetMonthIndex].expenses[transaction.category] || 0;
          newMonths[targetMonthIndex] = {
            ...newMonths[targetMonthIndex],
            expenses: {
              ...newMonths[targetMonthIndex].expenses,
              [transaction.category]: currentExp + installmentValue
            }
          };
        }
      }
      return { ...prev, months: newMonths };
    });
  };

  const handleExportCSV = () => {
    exportToCSV(financialData);
  };

  const handleExportBackup = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(financialData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `backup_financas_2026_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportBackupTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content) as FinancialState;
        
        // Basic validation
        if (parsedData.year && Array.isArray(parsedData.months)) {
          setFinancialData(parsedData);
          alert("Backup restaurado com sucesso!");
        } else {
          alert("Arquivo inválido. Certifique-se de usar um backup gerado por este app.");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao ler o arquivo.");
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  // Derived Statistics
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let maxBalance = -Infinity;
    let bestMonthName = '';

    const chartData: ChartDataPoint[] = [];

    financialData.months.forEach(m => {
      const monthlyExp = (Object.values(m.expenses) as number[]).reduce((a, b) => a + b, 0);
      const monthlyBal = m.income - monthlyExp;

      totalIncome += m.income;
      totalExpenses += monthlyExp;
      
      if (monthlyBal > maxBalance) {
        maxBalance = monthlyBal;
        bestMonthName = m.monthName;
      }

      chartData.push({
        name: m.monthName.substring(0, 3),
        Receita: m.income,
        Despesas: monthlyExp,
        Saldo: monthlyBal
      });
    });

    return {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
      bestMonth: bestMonthName,
      chartData
    };
  }, [financialData]);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Finanças <span className="text-blue-500">2026</span></h1>
                <p className="text-xs text-slate-400">Salvo no navegador &bull; v1.2</p>
              </div>
            </div>
            {/* Mobile Export/Import icons could go here */}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
             <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Visão Geral
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <PlusCircle className="w-4 h-4" />
              Lançamentos
            </button>
            
            <div className="w-px h-8 bg-slate-800 mx-2 hidden md:block"></div>
            
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImportFile}
                accept=".json"
                className="hidden"
              />
              <button 
                onClick={handleImportBackupTrigger}
                className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium bg-slate-800 text-purple-400 border border-slate-700 hover:bg-slate-700 transition-colors"
                title="Importar Backup JSON de outro computador"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Importar</span>
              </button>

               <button 
                onClick={handleExportBackup}
                className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700 transition-colors"
                title="Baixar Backup JSON para transferir"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Backup</span>
              </button>

               <button 
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 hover:bg-emerald-600/20 transition-colors"
                title="Exportar Tabela CSV (Excel)"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {activeTab === 'dashboard' ? (
          <div className="animate-fade-in">
            <SummaryCards 
              totalIncome={stats.totalIncome}
              totalExpenses={stats.totalExpenses}
              totalBalance={stats.totalBalance}
              bestMonth={stats.bestMonth}
            />

            <FinancialCharts data={stats.chartData} />

            <FinancialTable 
              data={financialData}
              onUpdateValue={handleUpdateValue}
              onUpdateIncome={handleUpdateIncome}
            />
            <div className="mt-8 text-center text-slate-500 text-sm">
              <p>Dica: Os dados são salvos automaticamente neste navegador. Use "Backup" para mover para outro computador.</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
             <TransactionForm onAddTransaction={handleAddTransaction} />
             
             {/* Simple Feedback info */}
             <div className="mt-8 max-w-2xl mx-auto text-center p-6 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
               <h3 className="text-slate-300 font-semibold mb-2">Como funciona o parcelamento?</h3>
               <p className="text-slate-400 text-sm">
                 Ao lançar uma despesa parcelada (ex: 10x), o valor total é dividido pelo número de parcelas 
                 e adicionado automaticamente a categoria selecionada para os meses subsequentes, começando pelo mês da data informada.
               </p>
             </div>
          </div>
        )}

      </main>

      {/* AI Assistant FAB */}
      <AIAdvisor data={financialData} />
    </div>
  );
};

export default App;