import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { loginUser, registerUser } from '../services/api';

export default function Registro() {
  const navigate = useNavigate();
  const { updateUser } = useFinance();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    monthlyIncome: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (form.password !== form.confirmPassword) {
        throw new Error('As senhas não são iguais.');
      }

      if (form.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      await registerUser({
        nome: form.name,
        email: form.email,
        telefone: form.phone || null,
        senha: form.password,
      });

      await loginUser({
        email: form.email,
        senha: form.password,

      });
     

      updateUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
   
      navigate('/configuracao-inicial');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleRegister() {
    alert('Cadastro com Google será conectado futuramente.');
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
          <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl mb-4">
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
              Telefone
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="(18) 99999-9999"
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

          <button
            disabled={loading}
            className="w-full bg-brand-orange text-white py-3 rounded-xl font-black shadow hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
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