import { useState } from 'react';
import Modal from '../components/Modal';
import { useFinance } from '../context/FinanceContext';
import { currentMonthKey, formatCurrency } from '../utils/formatters';

const emptyForm = { category: 'Alimentação', limit: '', month: currentMonthKey() };

export default function Orcamentos() {
  const { budgets, categories, transactions, addBudget, updateBudget, deleteBudget } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const expenseCategories = categories.filter((item) => item.type === 'despesa');

  function spentByBudget(budget) {
    return transactions
      .filter((item) => item.type === 'despesa' && item.category === budget.category && item.date?.slice(0, 7) === budget.month)
      .reduce((total, item) => total + Number(item.value), 0);
  }

  function openCreateModal() {
    setEditingId(null);
    setForm({ ...emptyForm, category: expenseCategories[0]?.name || 'Alimentação' });
    setIsModalOpen(true);
  }

  function openEditModal(budget) {
    setEditingId(budget.id);
    setForm(budget);
    setIsModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const payload = { ...form, limit: Number(form.limit) };
    if (editingId) updateBudget(editingId, payload);
    else addBudget(payload);
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">Orçamentos</h2>
          <p className="text-gray-500 text-sm mt-1">Defina limites mensais por categoria.</p>
        </div>
        <button onClick={openCreateModal} className="bg-brand-orange text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-orange-700 transition">Novo Orçamento</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const spent = spentByBudget(budget);
          const percent = Math.round((spent / Number(budget.limit || 1)) * 100);
          const exceeded = spent > Number(budget.limit);
          return (
            <div key={budget.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-gray-800">{budget.category}</h3>
                  <p className="text-sm text-gray-400 mt-1">Mês: {budget.month}</p>
                </div>
                <span className={`font-black ${exceeded ? 'text-red-500' : 'text-brand-teal'}`}>{percent}%</span>
              </div>

              <div className="mt-6">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${exceeded ? 'bg-red-500' : 'bg-brand-teal'}`} style={{ width: `${Math.min(100, percent)}%` }} />
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <span className="font-bold text-gray-600">Gasto: {formatCurrency(spent)}</span>
                  <span className="font-bold text-gray-400">Limite: {formatCurrency(budget.limit)}</span>
                </div>
                <p className={`mt-4 text-sm font-bold ${exceeded ? 'text-red-500' : 'text-brand-teal'}`}>
                  {exceeded ? 'Limite ultrapassado' : `Restante: ${formatCurrency(Number(budget.limit) - spent)}`}
                </p>
              </div>

              <div className="flex gap-2 mt-6">
                <button onClick={() => openEditModal(budget)} className="flex-1 bg-teal-50 text-brand-teal py-2 rounded-xl font-black hover:bg-teal-100 transition">Editar</button>
                <button onClick={() => deleteBudget(budget.id)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl font-black hover:bg-red-100 transition">Excluir</button>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400">Nenhum orçamento cadastrado.</div>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Orçamento' : 'Novo Orçamento'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white">
              {expenseCategories.map((category) => <option key={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Limite mensal</label>
            <input required type="number" min="0" step="0.01" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mês</label>
            <input required type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" />
          </div>
          <button className="w-full bg-brand-orange text-white py-3 rounded-xl font-black shadow hover:bg-orange-700 transition">Salvar Orçamento</button>
        </form>
      </Modal>
    </div>
  );
}
