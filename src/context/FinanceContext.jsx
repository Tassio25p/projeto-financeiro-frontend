import { createContext, useContext, useMemo, useState } from 'react';
import { currentMonthKey, toInputDate } from '../utils/formatters';

const STORAGE_KEY = 'financas-app-data-v2';

const initialData = {
  user: {
    name: 'Tássio Henrique',
    email: 'tassio@email.com',
    monthlyIncome: 1700,
  },
  categories: [
    { id: 1, name: 'Salário', type: 'receita', color: 'teal' },
    { id: 2, name: 'Freelance', type: 'receita', color: 'blue' },
    { id: 3, name: 'Alimentação', type: 'despesa', color: 'orange' },
    { id: 4, name: 'Moradia', type: 'despesa', color: 'purple' },
    { id: 5, name: 'Transporte', type: 'despesa', color: 'cyan' },
    { id: 6, name: 'Lazer', type: 'despesa', color: 'pink' },
    { id: 7, name: 'Saúde', type: 'despesa', color: 'red' },
    { id: 8, name: 'Educação', type: 'despesa', color: 'indigo' },
  ],
  transactions: [
    { id: 1, description: 'Salário mensal', value: 1700, type: 'receita', category: 'Salário', method: 'Pix', date: toInputDate(new Date()) },
    { id: 2, description: 'Mercado', value: 320, type: 'despesa', category: 'Alimentação', method: 'Cartão', date: toInputDate(new Date()) },
    { id: 3, description: 'Internet', value: 99.9, type: 'despesa', category: 'Moradia', method: 'Boleto', date: toInputDate(new Date()) },
    { id: 4, description: 'Gasolina', value: 120, type: 'despesa', category: 'Transporte', method: 'Pix', date: toInputDate(new Date()) },
  ],
  goals: [
    { id: 1, title: 'Reserva de emergência', target: 3000, saved: 650, deadline: '2026-12-31' },
    { id: 2, title: 'Notebook novo', target: 4500, saved: 900, deadline: '2026-10-15' },
  ],
  budgets: [
    { id: 1, category: 'Alimentação', limit: 700, month: currentMonthKey() },
    { id: 2, category: 'Transporte', limit: 300, month: currentMonthKey() },
    { id: 3, category: 'Lazer', limit: 250, month: currentMonthKey() },
  ],
};

const FinanceContext = createContext(null);

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialData, ...JSON.parse(saved) } : initialData;
  } catch {
    return initialData;
  }
}

function persist(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function FinanceProvider({ children }) {
  const [data, setData] = useState(loadData);

  function updateData(updater) {
    setData((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      persist(next);
      return next;
    });
  }

  function addTransaction(transaction) {
    updateData((current) => ({
      ...current,
      transactions: [
        { id: Date.now(), value: Number(transaction.value), ...transaction },
        ...current.transactions,
      ],
    }));
  }

  function updateTransaction(id, transaction) {
    updateData((current) => ({
      ...current,
      transactions: current.transactions.map((item) =>
        item.id === id ? { ...item, ...transaction, value: Number(transaction.value) } : item
      ),
    }));
  }

  function deleteTransaction(id) {
    updateData((current) => ({
      ...current,
      transactions: current.transactions.filter((item) => item.id !== id),
    }));
  }

  function addCategory(category) {
    updateData((current) => ({
      ...current,
      categories: [{ id: Date.now(), color: 'teal', ...category }, ...current.categories],
    }));
  }

  function updateCategory(id, category) {
    updateData((current) => ({
      ...current,
      categories: current.categories.map((item) => (item.id === id ? { ...item, ...category } : item)),
    }));
  }

  function deleteCategory(id) {
    updateData((current) => ({
      ...current,
      categories: current.categories.filter((item) => item.id !== id),
    }));
  }

  function addGoal(goal) {
    updateData((current) => ({
      ...current,
      goals: [{ id: Date.now(), saved: Number(goal.saved || 0), target: Number(goal.target), ...goal }, ...current.goals],
    }));
  }

  function updateGoal(id, goal) {
    updateData((current) => ({
      ...current,
      goals: current.goals.map((item) =>
        item.id === id ? { ...item, ...goal, target: Number(goal.target), saved: Number(goal.saved) } : item
      ),
    }));
  }

  function deleteGoal(id) {
    updateData((current) => ({
      ...current,
      goals: current.goals.filter((item) => item.id !== id),
    }));
  }

  function addBudget(budget) {
    updateData((current) => ({
      ...current,
      budgets: [{ id: Date.now(), limit: Number(budget.limit), ...budget }, ...current.budgets],
    }));
  }

  function updateBudget(id, budget) {
    updateData((current) => ({
      ...current,
      budgets: current.budgets.map((item) =>
        item.id === id ? { ...item, ...budget, limit: Number(budget.limit) } : item
      ),
    }));
  }

  function deleteBudget(id) {
    updateData((current) => ({
      ...current,
      budgets: current.budgets.filter((item) => item.id !== id),
    }));
  }

  function updateUser(user) {
    updateData((current) => ({ ...current, user: { ...current.user, ...user } }));
  }

  function resetData() {
    persist(initialData);
    setData(initialData);
  }

  const stats = useMemo(() => {
    const income = data.transactions
      .filter((item) => item.type === 'receita')
      .reduce((total, item) => total + Number(item.value), 0);

    const expense = data.transactions
      .filter((item) => item.type === 'despesa')
      .reduce((total, item) => total + Number(item.value), 0);

    const month = currentMonthKey();
    const monthTransactions = data.transactions.filter((item) => item.date?.slice(0, 7) === month);
    const monthIncome = monthTransactions
      .filter((item) => item.type === 'receita')
      .reduce((total, item) => total + Number(item.value), 0);
    const monthExpense = monthTransactions
      .filter((item) => item.type === 'despesa')
      .reduce((total, item) => total + Number(item.value), 0);

    return {
      income,
      expense,
      balance: income - expense,
      monthIncome,
      monthExpense,
      monthBalance: monthIncome - monthExpense,
    };
  }, [data.transactions]);

  const value = {
    ...data,
    stats,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addGoal,
    updateGoal,
    deleteGoal,
    addBudget,
    updateBudget,
    deleteBudget,
    updateUser,
    resetData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro do FinanceProvider');
  }
  return context;
}
