import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  bestMonth: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totalIncome, totalExpenses, totalBalance, bestMonth }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-sm font-medium">Receita Anual</h3>
          <TrendingUp className="text-green-400 w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-sm font-medium">Despesas Totais</h3>
          <TrendingDown className="text-red-400 w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-sm font-medium">Saldo Acumulado</h3>
          <Wallet className="text-blue-400 w-5 h-5" />
        </div>
        <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
          {formatCurrency(totalBalance)}
        </p>
      </div>

       <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-sm font-medium">Melhor Mês (Saldo)</h3>
          <PiggyBank className="text-purple-400 w-5 h-5" />
        </div>
        <p className="text-xl font-bold text-white">{bestMonth}</p>
      </div>
    </div>
  );
};
