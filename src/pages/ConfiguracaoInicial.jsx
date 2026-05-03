import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateCurrentUser } from '../services/api';
import { useFinance } from '../context/FinanceContext';

export default function ConfiguracaoInicial() {
  const navigate = useNavigate();
  const { updateUser } = useFinance();

  const [form, setForm] = useState({
    monthlyIncome: '',
    initialBalance: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const updatedUser = await updateCurrentUser({
        renda_mensal: Number(form.monthlyIncome || 0),
        saldo_inicial: Number(form.initialBalance || 0),
        configuracao_inicial_concluida: true,
      });

      updateUser({
        name: updatedUser.nome,
        email: updatedUser.email,
        phone: updatedUser.telefone || '',
        photoUrl: updatedUser.foto_url || '',
        monthlyIncome: Number(updatedUser.renda_mensal || 0),
        initialBalance: Number(updatedUser.saldo_inicial || 0),
        setupCompleted: Boolean(updatedUser.configuracao_inicial_concluida),
      });

      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao salvar configuração inicial.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-brand-teal">
            Configuração inicial<span className="text-brand-orange">.</span>
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Informe alguns dados para começarmos seu controle financeiro.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Renda mensal planejada
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.monthlyIncome}
              onChange={(e) =>
                setForm({ ...form, monthlyIncome: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Ex: 1700"
            />
            <p className="text-xs text-gray-400 mt-1">
              Quanto você espera receber por mês.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Saldo inicial
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.initialBalance}
              onChange={(e) =>
                setForm({ ...form, initialBalance: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Ex: 350"
            />
            <p className="text-xs text-gray-400 mt-1">
              Quanto dinheiro você já tem ao começar a usar o sistema.
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}