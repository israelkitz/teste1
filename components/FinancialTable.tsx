import React from 'react';
import { FinancialState, CATEGORIES, Category } from '../types';

interface FinancialTableProps {
  data: FinancialState;
  onUpdateValue: (monthIndex: number, category: Category, value: number) => void;
  onUpdateIncome: (monthIndex: number, value: number) => void;
}

export const FinancialTable: React.FC<FinancialTableProps> = ({ data, onUpdateValue, onUpdateIncome }) => {
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Detalhamento por Categoria (2026)</h3>
        <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">Editável</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 sticky left-0 bg-slate-900 z-10 font-bold border-r border-slate-700">Categoria</th>
              {data.months.map(m => (
                <th key={m.monthIndex} className="px-4 py-3 text-center min-w-[100px]">{m.monthName}</th>
              ))}
              <th className="px-4 py-3 text-right font-bold text-white bg-slate-800 sticky right-0">Total Geral</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
             {/* Income Row */}
             <tr className="bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
              <td className="px-4 py-3 font-medium text-emerald-400 sticky left-0 bg-slate-800 z-10 border-r border-slate-700">
                RECEITA MENSAL
              </td>
              {data.months.map((m, idx) => (
                <td key={idx} className="px-2 py-3 text-center">
                   <input 
                    type="number" 
                    className="w-full bg-transparent text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded text-emerald-400 font-semibold"
                    value={m.income}
                    onChange={(e) => onUpdateIncome(idx, Number(e.target.value))}
                  />
                </td>
              ))}
              <td className="px-4 py-3 text-right font-bold text-emerald-400 sticky right-0 bg-slate-800">
                {formatMoney(data.months.reduce((acc, m) => acc + m.income, 0))}
              </td>
            </tr>

            {/* Categories */}
            {CATEGORIES.map(category => {
              const rowTotal = data.months.reduce((acc, m) => acc + (m.expenses[category] || 0), 0);
              
              return (
                <tr key={category} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium sticky left-0 bg-slate-800 z-10 border-r border-slate-700 whitespace-nowrap">
                    {category}
                  </td>
                  {data.months.map((m, idx) => (
                    <td key={idx} className="px-2 py-3 text-center">
                      <input 
                        type="number" 
                        className="w-full bg-transparent text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded text-slate-300 hover:bg-slate-700"
                        value={m.expenses[category]}
                        onChange={(e) => onUpdateValue(idx, category, Number(e.target.value))}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right font-bold text-white sticky right-0 bg-slate-800 border-l border-slate-700">
                    {formatMoney(rowTotal)}
                  </td>
                </tr>
              );
            })}

            {/* Total Expenses Row */}
            <tr className="bg-slate-900/80 font-bold text-red-300 border-t-2 border-slate-600">
              <td className="px-4 py-3 sticky left-0 bg-slate-900 z-10 border-r border-slate-700">TOTAL DESPESAS</td>
              {data.months.map((m, idx) => {
                const totalMonth = (Object.values(m.expenses) as number[]).reduce((a, b) => a + b, 0);
                return (
                  <td key={idx} className="px-4 py-3 text-center">
                    {formatMoney(totalMonth)}
                  </td>
                );
              })}
              <td className="px-4 py-3 text-right sticky right-0 bg-slate-900">
                {formatMoney(data.months.reduce((acc, m) => acc + (Object.values(m.expenses) as number[]).reduce((a, b) => a + b, 0), 0))}
              </td>
            </tr>

            {/* Net Balance Row */}
            <tr className="bg-slate-900/90 font-bold text-white border-t border-slate-700">
              <td className="px-4 py-3 sticky left-0 bg-slate-900 z-10 border-r border-slate-700 text-blue-400">SALDO LÍQUIDO</td>
              {data.months.map((m, idx) => {
                const totalExp = (Object.values(m.expenses) as number[]).reduce((a, b) => a + b, 0);
                const bal = m.income - totalExp;
                return (
                  <td key={idx} className={`px-4 py-3 text-center ${bal >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    {formatMoney(bal)}
                  </td>
                );
              })}
              <td className="px-4 py-3 text-right sticky right-0 bg-slate-900 text-blue-400">
                 {formatMoney(data.months.reduce((acc, m) => acc + (m.income - (Object.values(m.expenses) as number[]).reduce((a, b) => a + b, 0)), 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};