import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser , getCurrentUser } from '../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser({
        email: form.email,
        senha: form.password,
      });
      const userData = await getCurrentUser();

      if (!userData.configuracao_inicial_concluida) {
      navigate('/configuracao-inicial');
      return;
    }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    alert('Login com Google será conectado futuramente.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-brand-teal">
            Finanças<span className="text-brand-orange">.</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Acesse seu painel financeiro.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition mb-5"
        >
          Entrar com Google
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
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-bold text-gray-700">
                Senha
              </label>

              <Link
                to="/recuperar-senha"
                className="text-xs text-brand-orange font-bold hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <input
              required
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ainda não tem conta?{' '}
          <Link
            to="/registro"
            className="text-brand-orange font-black hover:underline"
          >
            Criar cadastro
          </Link>
        </p>
      </div>
    </div>
  );
}