import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, Send } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';
import { FinancialState } from '../types';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  data: FinancialState;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const result = await getFinancialAdvice(data, query);
    setResponse(result);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 z-50 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="font-semibold hidden group-hover:block transition-all duration-300">
          Gemini Advisor
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-2xl h-[600px] rounded-2xl border border-slate-700 shadow-2xl flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-400 w-5 h-5" />
                <h2 className="text-xl font-bold text-white">Assistente Financeiro 2026</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!response && !loading && (
                <div className="text-center text-slate-400 mt-20">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Olá! Sou seu consultor financeiro.</p>
                  <p className="text-sm">Analiso sua tabela de 2026 e dou dicas de economia.</p>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                    <button onClick={() => setQuery("Como posso economizar em Moradia?")} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm text-blue-300 transition">"Como economizar em Moradia?"</button>
                    <button onClick={() => setQuery("Faça uma projeção para o fim de 2026")} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm text-blue-300 transition">"Projeção para fim de 2026"</button>
                    <button onClick={() => setQuery("Qual categoria gasto mais?")} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm text-blue-300 transition">"Onde gasto mais?"</button>
                    <button onClick={() => setQuery("Meu saldo está saudável?")} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 text-sm text-blue-300 transition">"Meu saldo está saudável?"</button>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 animate-pulse">Analisando seus dados de 2026...</p>
                </div>
              )}

              {response && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="prose prose-invert prose-sm max-w-none">
                     <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700 bg-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="Pergunte sobre suas finanças..."
                  className="flex-1 bg-slate-900 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAsk}
                  disabled={loading || !query}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
