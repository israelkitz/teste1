export enum Category {
  EssentialFood = 'Alimentação essencial',
  DiningOut = 'Alimentação fora de casa',
  Entertainment = 'Entretenimento',
  Studies = 'Estudos',
  Housing = 'Moradia',
  Personal = 'Pessoal',
  Health = 'Saúde',
  Transport = 'Transporte'
}

export const CATEGORIES = [
  Category.EssentialFood,
  Category.DiningOut,
  Category.Entertainment,
  Category.Studies,
  Category.Housing,
  Category.Personal,
  Category.Health,
  Category.Transport
];

export enum PaymentMethod {
  CreditCard = 'Cartão de Crédito',
  DebitCard = 'Cartão de Débito',
  Pix = 'PIX',
  Cash = 'Dinheiro',
  BankSlip = 'Boleto'
}

export interface TransactionInput {
  description: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  method: PaymentMethod;
  installments: number; // 1 = à vista
}

export interface MonthlyData {
  monthIndex: number; // 0-11
  monthName: string;
  income: number;
  expenses: Record<Category, number>;
}

export interface FinancialState {
  year: number;
  months: MonthlyData[];
}

export interface ChartDataPoint {
  name: string;
  Despesas: number;
  Saldo: number;
  Receita: number;
}
