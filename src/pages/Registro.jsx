import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export default function Registro() {
  const navigate = useNavigate();
  const { updateUser } = useFinance();
  const [form, setForm] = useState({ name: '', email: '', password: '', monthlyIncome: '' });

  function handleSubmit(event) {
    event.preventDefault();
    updateUser({ name: form.name, email: form.email, monthlyIncome: Number(form.monthlyIncome || 0) });
    localStorage.setItem('financas-auth', JSON.stringify({ email: form.email, logged: true }));
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-brand-teal">Criar conta</h1>
          <p className="text-gray-400 text-sm mt-2">Cadastro visual usando localStorage.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Renda mensal</label>
            <input type="number" value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" />
          </div>
          <button className="w-full bg-brand-orange text-white py-3 rounded-xl font-black shadow hover:bg-orange-700 transition">Cadastrar</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta? <Link to="/login" className="text-brand-teal font-black hover:underline">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
