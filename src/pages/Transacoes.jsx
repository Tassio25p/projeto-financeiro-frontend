import { useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { useFinance } from '../context/FinanceContext';
import { currentMonthKey, formatCurrency, formatDate, toInputDate } from '../utils/formatters';

const emptyForm = {
  description: '',
  value: '',
  type: 'despesa',
  category: 'Alimentação',
  method: 'Pix',
  date: toInputDate(),
};

export default function Transacoes() {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [monthFilter, setMonthFilter] = useState(currentMonthKey());

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch = item.description.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'todos' || item.type === typeFilter;
      const matchesMonth = monthFilter === 'todos' || item.date?.slice(0, 7) === monthFilter;
      return matchesSearch && matchesType && matchesMonth;
    });
  }, [transactions, search, typeFilter, monthFilter]);

  const totals = filteredTransactions.reduce(
    (acc, item) => {
      if (item.type === 'receita') acc.receitas += Number(item.value);
      if (item.type === 'despesa') acc.despesas += Number(item.value);
      acc.saldo = acc.receitas - acc.despesas;
      return acc;
    },
    { receitas: 0, despesas: 0, saldo: 0 }
  );

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(transaction) {
    setEditingId(transaction.id);
    setForm(transaction);
    setIsModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const payload = { ...form, value: Number(form.value) };

    if (editingId) {
      updateTransaction(editingId, payload);
    } else {
      addTransaction(payload);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  const categoryOptions = categories.filter((item) => item.type === form.type);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">Transações</h2>
          <p className="text-gray-500 text-sm mt-1">Cadastre entradas e saídas para alimentar o sistema inteiro.</p>
        </div>
        <button onClick={openCreateModal} className="bg-brand-orange text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-orange-700 transition">
          Nova Transação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Receitas filtradas</p>
          <h3 className="text-2xl font-black text-brand-teal mt-1">{formatCurrency(totals.receitas)}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Despesas filtradas</p>
          <h3 className="text-2xl font-black text-brand-orange mt-1">{formatCurrency(totals.despesas)}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Saldo filtrado</p>
          <h3 className="text-2xl font-black text-gray-800 mt-1">{formatCurrency(totals.saldo)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por descrição ou categoria..." className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-100" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 outline-none bg-white">
            <option value="todos">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 outline-none bg-white">
            <option value="todos">Todos os meses</option>
            <option value={currentMonthKey()}>Mês atual</option>
            {[...new Set(transactions.map((item) => item.date?.slice(0, 7)).filter(Boolean))].map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead className="bg-white text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-5 py-4">Descrição</th>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4">Método</th>
                <th className="px-5 py-4">Data</th>
                <th className="px-5 py-4 text-right">Valor</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-bold text-gray-800">{item.description}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{item.method}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{formatDate(item.date)}</td>
                  <td className={`px-5 py-4 text-right font-black ${item.type === 'receita' ? 'text-brand-teal' : 'text-brand-orange'}`}>
                    {item.type === 'receita' ? '+' : '-'} {formatCurrency(item.value)}
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(item)} className="text-brand-teal font-bold text-sm hover:underline">Editar</button>
                    <button onClick={() => deleteTransaction(item.id)} className="text-red-500 font-bold text-sm hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && <p className="p-8 text-center text-gray-400">Nenhuma transação encontrada.</p>}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Transação' : 'Nova Transação'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
            <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" placeholder="Ex: Mercado, Salário..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Valor</label>
              <input required type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: e.target.value === 'receita' ? 'Salário' : 'Alimentação' })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white">
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white">
                {categoryOptions.map((category) => <option key={category.id}>{category.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Método</label>
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white">
                <option>Pix</option>
                <option>Cartão</option>
                <option>Boleto</option>
                <option>Dinheiro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
          </div>
          <button className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition">Salvar</button>
        </form>
      </Modal>
    </div>
  );
}
