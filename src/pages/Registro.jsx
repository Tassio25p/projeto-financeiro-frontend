import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export default function Registro() {
  const navigate = useNavigate();
  const { updateUser } = useFinance();

  const [form, setForm] = useState({
    name: '',
    email: '',
    monthlyIncome: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não são iguais.');
      return;
    }

    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    updateUser({
      name: form.name,
      email: form.email,
      monthlyIncome: Number(form.monthlyIncome || 0),
    });

    localStorage.setItem(
      'financas-auth',
      JSON.stringify({ email: form.email, logged: true })
    );

    navigate('/');
  }

  function handleGoogleRegister() {
    alert('Cadastro com Google será conectado ao backend futuramente.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-brand-teal">
            Criar conta<span className="text-brand-orange">.</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Comece a organizar sua vida financeira.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition mb-5"
        >
          Cadastrar com Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400 font-bold">ou</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Nome
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              E-mail
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Renda mensal
            </label>
            <input
              type="number"
              value={form.monthlyIncome}
              onChange={(e) =>
                setForm({ ...form, monthlyIncome: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Ex: 1700"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Senha
            </label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Confirmar senha
            </label>
            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Digite a senha novamente"
            />
          </div>

          <button className="w-full bg-brand-orange text-white py-3 rounded-xl font-black shadow hover:bg-orange-700 transition">
            Criar conta
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link
            to="/login"
            className="text-brand-teal font-black hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}