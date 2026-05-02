import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem('financas-auth', JSON.stringify({ email, logged: true }));
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-brand-teal">Finanças<span className="text-brand-orange">.</span></h1>
          <p className="text-gray-400 text-sm mt-2">Entre para acessar seu painel financeiro.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100" placeholder="••••••••" />
          </div>
          <button className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition">Entrar</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ainda não tem conta? <Link to="/registro" className="text-brand-orange font-black hover:underline">Criar cadastro</Link>
        </p>
      </div>
    </div>
  );
}
