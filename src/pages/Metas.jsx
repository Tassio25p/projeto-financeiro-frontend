import { useState } from 'react';
import Modal from '../components/Modal';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const emptyForm = { title: '', target: '', saved: '', deadline: '' };

export default function Metas() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(goal) {
    setEditingId(goal.id);
    setForm(goal);
    setIsModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const payload = { ...form, target: Number(form.target), saved: Number(form.saved || 0) };
    if (editingId) updateGoal(editingId, payload);
    else addGoal(payload);
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">Metas Financeiras</h2>
          <p className="text-gray-500 text-sm mt-1">Acompanhe objetivos e valores guardados.</p>
        </div>
        <button onClick={openCreateModal} className="bg-brand-teal text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-teal-700 transition">Nova Meta</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((Number(goal.saved) / Number(goal.target || 1)) * 100));
          return (
            <div key={goal.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-gray-800">{goal.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">Prazo: {formatDate(goal.deadline)}</p>
                </div>
                <span className="text-brand-teal font-black">{progress}%</span>
              </div>

              <div className="mt-6">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-teal rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <span className="font-bold text-gray-600">{formatCurrency(goal.saved)}</span>
                  <span className="font-bold text-gray-400">{formatCurrency(goal.target)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button onClick={() => openEditModal(goal)} className="flex-1 bg-teal-50 text-brand-teal py-2 rounded-xl font-black hover:bg-teal-100 transition">Editar</button>
                <button onClick={() => deleteGoal(goal.id)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl font-black hover:bg-red-100 transition">Excluir</button>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400">Nenhuma meta cadastrada.</div>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Meta' : 'Nova Meta'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome da meta</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" placeholder="Ex: Comprar notebook" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Valor alvo</label>
              <input required type="number" min="0" step="0.01" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Valor guardado</label>
              <input type="number" min="0" step="0.01" value={form.saved} onChange={(e) => setForm({ ...form, saved: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Prazo</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" />
          </div>
          <button className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition">Salvar Meta</button>
        </form>
      </Modal>
    </div>
  );
}
