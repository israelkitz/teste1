import { FinancialState, CATEGORIES } from '../types';

export const exportToCSV = (data: FinancialState) => {
  const separator = ';'; // Excel in PT-BR regions often prefers semicolon
  const rows = [];

  // 1. Header Row
  const header = ['Categoria', ...data.months.map(m => m.monthName), 'Total Geral'];
  rows.push(header.join(separator));

  // 2. Income Row
  const totalIncome = data.months.reduce((acc, m) => acc + m.income, 0);
  const incomeRow = ['RECEITA MENSAL', ...data.months.map(m => m.income.toFixed(2).replace('.', ',')), totalIncome.toFixed(2).replace('.', ',')];
  rows.push(incomeRow.join(separator));

  // 3. Category Rows
  CATEGORIES.forEach(cat => {
    const monthValues = data.months.map(m => (m.expenses[cat] || 0));
    const totalCat = monthValues.reduce((a, b) => a + b, 0);
    const row = [cat, ...monthValues.map(v => v.toFixed(2).replace('.', ',')), totalCat.toFixed(2).replace('.', ',')];
    rows.push(row.join(separator));
  });

  // 4. Total Expenses Row
  const totalExpensesByMonth = data.months.map(m => (Object.values(m.expenses) as number[]).reduce((a, b) => a + b, 0));
  const grandTotalExpenses = totalExpensesByMonth.reduce((a, b) => a + b, 0);
  const expenseRow = ['TOTAL DESPESAS', ...totalExpensesByMonth.map(v => v.toFixed(2).replace('.', ',')), grandTotalExpenses.toFixed(2).replace('.', ',')];
  rows.push(expenseRow.join(separator));

  // 5. Balance Row
  const balanceByMonth = data.months.map((m, i) => m.income - totalExpensesByMonth[i]);
  const grandTotalBalance = totalIncome - grandTotalExpenses;
  const balanceRow = ['SALDO LÍQUIDO', ...balanceByMonth.map(v => v.toFixed(2).replace('.', ',')), grandTotalBalance.toFixed(2).replace('.', ',')];
  rows.push(balanceRow.join(separator));

  // Create Blob and Link
  const csvContent = "\uFEFF" + rows.join('\n'); // Add BOM for Excel UTF-8 compatibility
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `financas_2026_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
