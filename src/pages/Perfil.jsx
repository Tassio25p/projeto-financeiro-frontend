import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export default function Perfil() {
  const { user, updateUser, resetData, stats } = useFinance();
  const [form, setForm] = useState(user);
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    updateUser({ ...form, monthlyIncome: Number(form.monthlyIncome || 0) });
    setMessage('Perfil atualizado com sucesso.');
    setTimeout(() => setMessage(''), 2500);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-gray-800">Meu Perfil</h2>
        <p className="text-gray-500 text-sm mt-1">Dados básicos usados na visualização do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-24 h-24 rounded-full bg-teal-50 text-brand-teal mx-auto flex items-center justify-center text-3xl font-black">
            {user.name?.charAt(0) || 'U'}
          </div>
          <h3 className="text-xl font-black text-gray-800 mt-4">{user.name}</h3>
          <p className="text-gray-400 text-sm">{user.email}</p>
          <div className="mt-6 bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Saldo atual</p>
            <p className="text-2xl font-black text-brand-teal mt-1">{formatCurrency(stats.balance)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-gray-800">Editar informações</h3>
          {message && <div className="bg-teal-50 text-brand-teal rounded-xl px-4 py-3 font-bold text-sm">{message}</div>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Renda mensal planejada</label>
            <input type="number" value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
          </div>
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button className="bg-brand-teal text-white px-5 py-3 rounded-xl font-black shadow hover:bg-teal-700 transition">Salvar Perfil</button>
            <button type="button" onClick={resetData} className="bg-red-50 text-red-500 px-5 py-3 rounded-xl font-black hover:bg-red-100 transition">Restaurar dados de exemplo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
