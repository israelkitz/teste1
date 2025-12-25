import { GoogleGenAI } from "@google/genai";
import { FinancialState, CATEGORIES } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (data: FinancialState, query: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure process.env.API_KEY.";
  }

  // Format data for the AI context
  const summary = data.months.map(m => {
    const totalExpenses = Object.values(m.expenses).reduce((a, b) => a + b, 0);
    const balance = m.income - totalExpenses;
    return `${m.monthName}: Receita R$${m.income}, Despesas R$${totalExpenses}, Saldo R$${balance}`;
  }).join('\n');

  const categorySummary = CATEGORIES.map(cat => {
    const total = data.months.reduce((sum, m) => sum + (m.expenses[cat] || 0), 0);
    return `${cat}: Total Anual R$${total}`;
  }).join('\n');

  const systemInstruction = `
    Você é um consultor financeiro especialista e perspicaz chamado "Gemini Finanças".
    Você está analisando os dados financeiros de um usuário para o ano de 2026.
    
    Contexto dos Dados:
    ${summary}
    
    Totais por Categoria:
    ${categorySummary}
    
    Responda de forma concisa, profissional e direta. Use Markdown para formatar a resposta.
    Se o usuário perguntar sobre projeções, use os dados fornecidos para extrapolar tendências.
    Foque em "Saldos" (Savings) e onde cortar gastos excessivos.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Não consegui gerar uma análise no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao consultar o assistente financeiro.";
  }
};
