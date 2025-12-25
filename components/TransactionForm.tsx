import React, { useState } from 'react';
import { Category, CATEGORIES, PaymentMethod, TransactionInput } from '../types';
import { PlusCircle, Calendar, CreditCard, Tag, DollarSign } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: TransactionInput) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState<TransactionInput>({
    description: '',
    amount: 0,
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    method: PaymentMethod.CreditCard,
    installments: 1
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction(formData);
    
    // Reset form slightly but keep date/method for convenience
    setFormData(prev => ({
      ...prev,
      description: '',
      amount: 0,
      installments: 1
    }));

    setMessage("Lançamento realizado com sucesso!");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <PlusCircle className="text-blue-500 w-8 h-8" />
        <h2 className="text-2xl font-bold text-white">Novo Lançamento</h2>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-center animate-fade-in">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Description & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Descrição</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Compra Mercado"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Valor Total
            </label>
            <input 
              required
              type="number" 
              step="0.01"
              min="0.01"
              placeholder="0,00"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={formData.amount || ''}
              onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        {/* Date & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Data
            </label>
            <input 
              required
              type="date" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition [color-scheme:dark]"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Categoria
            </label>
            <select 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value as Category})}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment & Installments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Forma de Pagamento
            </label>
            <select 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={formData.method}
              onChange={e => setFormData({...formData, method: e.target.value as PaymentMethod})}
            >
              {Object.values(PaymentMethod).map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-400">Parcelas</label>
             <select 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={formData.installments}
              onChange={e => setFormData({...formData, installments: parseInt(e.target.value)})}
            >
              <option value={1}>À vista (1x)</option>
              {Array.from({length: 11}, (_, i) => i + 2).map(num => (
                <option key={num} value={num}>{num}x</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 text-right mt-1">
              {formData.installments > 1 && formData.amount > 0 && 
                `R$ ${(formData.amount / formData.installments).toFixed(2)} por mês`
              }
            </p>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all transform active:scale-95"
        >
          Adicionar Despesa
        </button>

      </form>
    </div>
  );
};
