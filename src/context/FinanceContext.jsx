import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { currentMonthKey } from '../utils/formatters';
import { getCurrentUser, getToken } from '../services/api';

const STORAGE_KEY = 'financas-app-data-v2';

const initialData = {
user: {
  name: '',
  email: '',
  phone: '',
  photoUrl: '',
  monthlyIncome: 0,
  initialBalance: 0,
  setupCompleted: false,
},
  categories: [],
  transactions: [  ],
  goals: [],
  budgets: [],
};

const FinanceContext = createContext(null);

function loadData() {
  try {
    const token = getToken();

    // Se tem token, não usamos usuário salvo antigo.
    // O usuário real será carregado pelo /usuarios/me.
    if (token) {
      return {
        ...initialData,
        user: {
          name: '',
          email: '',
          phone: '',
          photoUrl: '',
          monthlyIncome: 0,
        },
      };
    }

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

useEffect(() => {
  async function loadCurrentUserFromApi() {
    const token = getToken();

    if (!token) {
      setData(initialData);
      return;
    }

    try {
      const userData = await getCurrentUser();

      setData((current) => {
        const next = {
          ...current,
          user: {
            ...current.user,
            name: userData.nome || '',
            email: userData.email || '',
            phone: userData.telefone || '',
            photoUrl: userData.foto_url || '',
            monthlyIncome: Number(userData.renda_mensal || 0),
            initialBalance: Number(userData.saldo_inicial || 0),
            setupCompleted: Boolean(userData.configuracao_inicial_concluida),
          },
        };

        persist(next);
        return next;
      });
    } catch (error) {
      console.error('Erro ao buscar usuário logado:', error.message);
    }
  }

  loadCurrentUserFromApi();

  window.addEventListener('auth-changed', loadCurrentUserFromApi);

  return () => {
    window.removeEventListener('auth-changed', loadCurrentUserFromApi);
  };
}, []);




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
