import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { currentMonthKey, formatCurrency } from '../utils/formatters';
import {
  getCategories,
  getBudgets,
  createBudget,
  updateBudgetApi,
  deleteBudgetApi,
  getDashboardSummary,
} from '../services/api';

const emptyForm = {
  categoryId: '',
  limit: '',
  month: currentMonthKey(),
};

export default function Orcamentos() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const expenseCategories = categories.filter((item) => item.type === 'despesa');

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [categoriesData, budgetsData, dashboardData] = await Promise.all([
        getCategories(),
        getBudgets(),
        getDashboardSummary(),
      ]);

      const formattedCategories = categoriesData.map((item) => ({
        id: item.id,
        name: item.nome,
        type: item.tipo,
        color: item.cor || 'teal',
        icon: item.icone || '',
      }));

      const dashboardBudgets = dashboardData.orcamentos || [];

      const formattedBudgets = budgetsData.map((item) => {
        const category = formattedCategories.find(
          (cat) => cat.id === item.categoria_id
        );

        const dashboardBudget = dashboardBudgets.find(
          (budget) => budget.orcamento_id === item.id
        );

        return {
          id: item.id,
          categoryId: item.categoria_id,
          category: category?.name || 'Sem categoria',
          limit: Number(item.valor_limite || 0),
          month: `${item.ano}-${String(item.mes).padStart(2, '0')}`,
          mes: item.mes,
          ano: item.ano,
          spent: Number(dashboardBudget?.gasto_atual || 0),
          remaining: Number(dashboardBudget?.valor_restante || item.valor_limite || 0),
          percent: Number(dashboardBudget?.percentual_utilizado || 0),
          status: dashboardBudget?.status || 'dentro_do_limite',
        };
      });

      setCategories(formattedCategories);
      setBudgets(formattedBudgets);
    } catch (err) {
      setError(err.message || 'Erro ao carregar orçamentos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getFirstExpenseCategoryId() {
    const category = expenseCategories[0];
    return category ? String(category.id) : '';
  }

  function splitMonth(monthValue) {
    const [ano, mes] = monthValue.split('-');

    return {
      mes: Number(mes),
      ano: Number(ano),
    };
  }

  function openCreateModal() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      categoryId: getFirstExpenseCategoryId(),
      month: currentMonthKey(),
    });
    setError('');
    setIsModalOpen(true);
  }

  function openEditModal(budget) {
    setEditingId(budget.id);
    setForm({
      categoryId: String(budget.categoryId),
      limit: budget.limit,
      month: budget.month,
    });
    setError('');
    setIsModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (!form.categoryId) {
        throw new Error('Selecione uma categoria de despesa.');
      }

      const { mes, ano } = splitMonth(form.month);

      const payload = {
        mes,
        ano,
        valor_limite: Number(form.limit || 0),
        categoria_id: Number(form.categoryId),
      };

      if (editingId) {
        await updateBudgetApi(editingId, payload);
        setMessage('Orçamento atualizado com sucesso.');
      } else {
        await createBudget(payload);
        setMessage('Orçamento criado com sucesso.');
      }

      await loadData();

      setIsModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.message || 'Erro ao salvar orçamento.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir este orçamento?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError('');
      setMessage('');

      await deleteBudgetApi(id);
      await loadData();

      setMessage('Orçamento excluído com sucesso.');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.message || 'Erro ao excluir orçamento.');
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">Orçamentos</h2>
          <p className="text-gray-500 text-sm mt-1">
            Defina limites mensais por categoria.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-brand-orange text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-orange-700 transition"
        >
          Novo Orçamento
        </button>
      </div>

      {message && (
        <div className="bg-teal-50 text-brand-teal rounded-xl px-4 py-3 font-bold text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 font-bold text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400 font-bold">
          Carregando orçamentos...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const spent = Number(budget.spent || 0);
              const percent = Math.round(Number(budget.percent || 0));
              const exceeded = budget.status === 'ultrapassado';

              return (
                <div
                  key={budget.id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-800">
                        {budget.category}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Mês: {budget.month}
                      </p>
                    </div>

                    <span
                      className={`font-black ${
                        exceeded ? 'text-red-500' : 'text-brand-teal'
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          exceeded ? 'bg-red-500' : 'bg-brand-teal'
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    <div className="flex justify-between mt-3 text-sm">
                      <span className="font-bold text-gray-600">
                        Gasto: {formatCurrency(spent)}
                      </span>

                      <span className="font-bold text-gray-400">
                        Limite: {formatCurrency(budget.limit)}
                      </span>
                    </div>

                    <p
                      className={`mt-4 text-sm font-bold ${
                        exceeded ? 'text-red-500' : 'text-brand-teal'
                      }`}
                    >
                      {exceeded
                        ? 'Limite ultrapassado'
                        : `Restante: ${formatCurrency(
                            Number(budget.limit) - spent
                          )}`}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => openEditModal(budget)}
                      className="flex-1 bg-teal-50 text-brand-teal py-2 rounded-xl font-black hover:bg-teal-100 transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl font-black hover:bg-red-100 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {budgets.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400">
              Nenhum orçamento cadastrado.
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Orçamento' : 'Novo Orçamento'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Categoria
            </label>

            <select
              required
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white"
            >
              <option value="">Selecione uma categoria</option>

              {expenseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {expenseCategories.length === 0 && (
              <p className="text-xs text-red-400 mt-1">
                Crie uma categoria de despesa antes.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Limite mensal
            </label>

            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.limit}
              onChange={(e) => setForm({ ...form, limit: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Mês
            </label>

            <input
              required
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <button
            disabled={saving || expenseCategories.length === 0}
            className="w-full bg-brand-orange text-white py-3 rounded-xl font-black shadow hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Orçamento'}
          </button>
        </form>
      </Modal>
    </div>
  );
}