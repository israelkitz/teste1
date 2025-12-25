import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ChartDataPoint } from '../types';

interface FinancialChartsProps {
  data: ChartDataPoint[];
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Balance Evolution */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg h-80">
        <h3 className="text-lg font-semibold text-white mb-4 ml-2">Fluxo de Caixa Mensal</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `R$${val/1000}k`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            />
            <Legend />
            <Bar dataKey="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Accumulated Balance Area */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg h-80">
        <h3 className="text-lg font-semibold text-white mb-4 ml-2">Evolução do Saldo</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `R$${val/1000}k`} />
            <Tooltip 
               contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
               formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            />
            <Area type="monotone" dataKey="Saldo" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSaldo)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
