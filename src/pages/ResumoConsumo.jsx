import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getCategories, getTransactions } from '../services/api';
import { currentMonthKey, formatCurrency } from '../utils/formatters';

const COLORS = ['#0d9488', '#ea580c', '#3b82f6', '#a855f7', '#ef4444', '#14b8a6'];

export default function ResumoConsumo() {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(currentMonthKey());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);

      const formattedCategories = categoriesData.map((item) => ({
        id: item.id,
        name: item.nome,
        type: item.tipo,
        color: item.cor || 'teal',
        icon: item.icone || '',
      }));

      const formattedTransactions = transactionsData.map((item) => {
        const category = formattedCategories.find(
          (cat) => cat.id === item.categoria_id
        );

        return {
          id: item.id,
          description: item.descricao,
          value: Number(item.valor || 0),
          type: item.tipo,
          categoryId: item.categoria_id,
          category: category?.name || 'Sem categoria',
          method: item.metodo_pagamento || 'Não informado',
          date: item.data,
        };
      });

      setTransactions(formattedTransactions);
    } catch (err) {
      setError(err.message || 'Erro ao carregar resumo de consumo.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const expenses = useMemo(() => {
    return transactions.filter((item) => {
      const isExpense = item.type === 'despesa';
      const matchesMonth =
        month === 'todos' || item.date?.slice(0, 7) === month;

      return isExpense && matchesMonth;
    });
  }, [transactions, month]);

  const byMethod = Object.values(
    expenses.reduce((acc, item) => {
      const method = item.method || 'Não informado';

      if (!acc[method]) {
        acc[method] = {
          name: method,
          value: 0,
        };
      }

      acc[method].value += Number(item.value);

      return acc;
    }, {})
  );

  const byCategory = Object.values(
    expenses.reduce((acc, item) => {
      const category = item.category || 'Sem categoria';

      if (!acc[category]) {
        acc[category] = {
          category,
          total: 0,
        };
      }

      acc[category].total += Number(item.value);

      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  const total = expenses.reduce(
    (sum, item) => sum + Number(item.value),
    0
  );

  const biggest = [...expenses]
    .sort((a, b) => Number(b.value) - Number(a.value))
    .slice(0, 6);

  const months = [
    ...new Set(
      transactions
        .map((item) => item.date?.slice(0, 7))
        .filter(Boolean)
    ),
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <p className="text-gray-400 font-bold">Carregando resumo de consumo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">
            Resumo de Consumo
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Análise por método de pagamento e categoria.
          </p>
        </div>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-white border border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 shadow-sm outline-none"
        >
          <option value="todos">Todos os meses</option>
          <option value={currentMonthKey()}>Mês atual</option>

          {months.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 font-bold text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Total consumido
          </p>
          <h3 className="text-2xl font-black text-brand-orange mt-1">
            {formatCurrency(total)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Transações
          </p>
          <h3 className="text-2xl font-black text-gray-800 mt-1">
            {expenses.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Maior gasto
          </p>
          <h3 className="text-2xl font-black text-gray-800 mt-1">
            {formatCurrency(biggest[0]?.value || 0)}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-5">
            Métodos de pagamento
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byMethod}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {byMethod.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {byMethod.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              Nenhum método encontrado.
            </p>
          )}
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-800 mb-5">
            Gastos por categoria
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar
                  dataKey="total"
                  fill="#0d9488"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {byCategory.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              Nenhuma categoria encontrada.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-800">
            Maiores consumos
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[680px]">
            <thead className="bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Método</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {biggest.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {item.description}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {item.method}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {item.category}
                  </td>

                  <td className="px-6 py-4 text-right font-black text-brand-orange">
                    {formatCurrency(item.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {biggest.length === 0 && (
            <p className="p-8 text-center text-gray-400">
              Nenhum consumo encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}