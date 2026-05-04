import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  getGoals,
  createGoal,
  updateGoalApi,
  deleteGoalApi,
} from '../services/api';

const emptyForm = {
  title: '',
  target: '',
  saved: '',
  deadline: '',
  status: 'ativa',
};

export default function Metas() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadGoals() {
    try {
      setLoading(true);
      setError('');

      const data = await getGoals();

      const formattedGoals = data.map((item) => ({
        id: item.id,
        title: item.titulo,
        target: Number(item.valor_alvo || 0),
        saved: Number(item.valor_atual || 0),
        deadline: item.data_limite || '',
        status: item.status || 'ativa',
      }));

      setGoals(formattedGoals);
    } catch (err) {
      setError(err.message || 'Erro ao carregar metas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setIsModalOpen(true);
  }

  function openEditModal(goal) {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      target: goal.target,
      saved: goal.saved,
      deadline: goal.deadline || '',
      status: goal.status || 'ativa',
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
      const payload = {
        titulo: form.title,
        valor_alvo: Number(form.target || 0),
        valor_atual: Number(form.saved || 0),
        data_limite: form.deadline || null,
        status: form.status || 'ativa',
      };

      if (editingId) {
        await updateGoalApi(editingId, payload);
        setMessage('Meta atualizada com sucesso.');
      } else {
        await createGoal(payload);
        setMessage('Meta criada com sucesso.');
      }

      await loadGoals();

      setIsModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.message || 'Erro ao salvar meta.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir esta meta?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError('');
      setMessage('');

      await deleteGoalApi(id);
      await loadGoals();

      setMessage('Meta excluída com sucesso.');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.message || 'Erro ao excluir meta.');
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">
            Metas Financeiras
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Acompanhe objetivos e valores guardados.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-brand-teal text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-teal-700 transition"
        >
          Nova Meta
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
          Carregando metas...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = Math.min(
                100,
                Math.round(
                  (Number(goal.saved) / Number(goal.target || 1)) * 100
                )
              );

              return (
                <div
                  key={goal.id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-800">
                        {goal.title}
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        Prazo:{' '}
                        {goal.deadline
                          ? formatDate(goal.deadline)
                          : 'Sem prazo'}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Status:{' '}
                        <span className="font-bold">
                          {goal.status === 'concluida'
                            ? 'Concluída'
                            : goal.status === 'cancelada'
                              ? 'Cancelada'
                              : 'Ativa'}
                        </span>
                      </p>
                    </div>

                    <span className="text-brand-teal font-black">
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-teal rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between mt-3 text-sm">
                      <span className="font-bold text-gray-600">
                        {formatCurrency(goal.saved)}
                      </span>

                      <span className="font-bold text-gray-400">
                        {formatCurrency(goal.target)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="flex-1 bg-teal-50 text-brand-teal py-2 rounded-xl font-black hover:bg-teal-100 transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl font-black hover:bg-red-100 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {goals.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-400">
              Nenhuma meta cadastrada.
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Meta' : 'Nova Meta'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Nome da meta
            </label>

            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Ex: Comprar notebook"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Valor alvo
              </label>

              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.target}
                onChange={(e) =>
                  setForm({ ...form, target: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Valor guardado
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.saved}
                onChange={(e) =>
                  setForm({ ...form, saved: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Prazo
            </label>

            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white"
            >
              <option value="ativa">Ativa</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <button
            disabled={saving}
            className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Meta'}
          </button>
        </form>
      </Modal>
    </div>
  );
}