import { useEffect, useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/formatters';
import {
  getCategories,
  createCategory,
  updateCategoryApi,
  deleteCategoryApi,
} from '../services/api';

const emptyForm = {
  name: '',
  type: 'despesa',
  color: 'teal',
  icon: '',
};

export default function Categorias() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadCategories() {
    try {
      setLoading(true);
      setError('');

      const data = await getCategories();

      const formattedCategories = data.map((item) => ({
        id: item.id,
        name: item.nome,
        type: item.tipo,
        color: item.cor || 'teal',
        icon: item.icone || '',
      }));

      setCategories(formattedCategories);
    } catch (err) {
      setError(err.message || 'Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType = typeFilter === 'todos' || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [categories, search, typeFilter]);

  function categoryTotal() {
    // Depois que conectarmos transações reais, calcularemos aqui.
    return 0;
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setIsModalOpen(true);
  }

  function openEditModal(category) {
    setEditingId(category.id);
    setForm(category);
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
        nome: form.name,
        tipo: form.type,
        cor: form.color || 'teal',
        icone: form.icon || null,
      };

      if (editingId) {
        await updateCategoryApi(editingId, payload);
        setMessage('Categoria atualizada com sucesso.');
      } else {
        await createCategory(payload);
        setMessage('Categoria criada com sucesso.');
      }

      await loadCategories();

      setIsModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.message || 'Erro ao salvar categoria.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir esta categoria?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError('');
      setMessage('');

      await deleteCategoryApi(id);
      await loadCategories();

      setMessage('Categoria excluída com sucesso.');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.message || 'Erro ao excluir categoria.');
    }
  }

  const receitas = categories.filter((item) => item.type === 'receita').length;
  const despesas = categories.filter((item) => item.type === 'despesa').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">Categorias</h2>
          <p className="text-gray-500 text-sm mt-1">
            Organize receitas e despesas por grupo.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-brand-teal text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-teal-700 transition"
        >
          Nova Categoria
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Total
          </p>
          <h3 className="text-2xl font-black text-gray-800 mt-1">
            {categories.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Receitas
          </p>
          <h3 className="text-2xl font-black text-brand-teal mt-1">
            {receitas}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Despesas
          </p>
          <h3 className="text-2xl font-black text-brand-orange mt-1">
            {despesas}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar categoria..."
            className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-100"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 outline-none bg-white"
          >
            <option value="todos">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[680px]">
            <thead className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4">Tipo</th>
                <th className="px-5 py-4 text-right">Gasto vinculado</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-gray-400 font-bold"
                  >
                    Carregando categorias...
                  </td>
                </tr>
              ) : (
                filteredCategories.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-bold text-gray-800">
                      {item.name}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          item.type === 'receita'
                            ? 'bg-teal-50 text-brand-teal'
                            : 'bg-orange-50 text-brand-orange'
                        }`}
                      >
                        {item.type === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right font-black text-gray-800">
                      {formatCurrency(categoryTotal(item.name))}
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-brand-teal font-bold text-sm hover:underline"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 font-bold text-sm hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && filteredCategories.length === 0 && (
            <p className="p-8 text-center text-gray-400">
              Nenhuma categoria encontrada.
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Nome
            </label>

            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Lazer"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tipo
            </label>

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white"
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Cor
            </label>

            <select
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white"
            >
              <option value="teal">Teal</option>
              <option value="orange">Orange</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="red">Red</option>
              <option value="pink">Pink</option>
              <option value="indigo">Indigo</option>
              <option value="cyan">Cyan</option>
            </select>
          </div>

          <button
            disabled={saving}
            className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Categoria'}
          </button>
        </form>
      </Modal>
    </div>
  );
} 