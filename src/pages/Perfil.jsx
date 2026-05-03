import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { removeToken, updateCurrentUser , getDashboardSummary } from '../services/api';
export default function Perfil() {
  const navigate = useNavigate();
  const { user, updateUser, resetData, stats } = useFinance();

 const [form, setForm] = useState({
  name: user.name || '',
  email: user.email || '',
  phone: user.phone || '',
  monthlyIncome: user.monthlyIncome || '',
  photoUrl: user.photoUrl || '',
});

useEffect(() => {
  setForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    monthlyIncome: user.monthlyIncome || '',
    photoUrl: user.photoUrl || '',
  });
}, [user]);

  const [message, setMessage] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
 
 useEffect(() => {
  async function loadDashboardBalance() {
    try {
      const data = await getDashboardSummary();
      setCurrentBalance(Number(data.saldo || 0));
    } catch (error) {
      console.error('Erro ao carregar saldo:', error.message);
    }
  }

  loadDashboardBalance();
}, []);
 
 
  async function handleSubmit(event) {
    event.preventDefault();

 try {
  
    const updatedUser = await updateCurrentUser({
      nome: form.name,
      telefone: form.phone || null,
      foto_url: form.photoUrl || null,
      renda_mensal: Number(form.monthlyIncome || 0),
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
    const dashboardData = await getDashboardSummary();
    setCurrentBalance(Number(dashboardData.saldo || 0));
    setMessage('Perfil atualizado com sucesso.');

    setMessage('Perfil atualizado com sucesso.');
  } catch (error) {
    setMessage(error.message || 'Erro ao atualizar perfil.');
  }

  setTimeout(() => setMessage(''), 2500);
  }

  function handleLogout() {
  removeToken();
  navigate('/login');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-gray-800">Meu Perfil</h2>
        <p className="text-gray-500 text-sm mt-1">
          Gerencie seus dados pessoais e preferências do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-28 h-28 rounded-full bg-teal-50 text-brand-teal mx-auto flex items-center justify-center text-4xl font-black overflow-hidden">
            {form.photoUrl ? (
              <img
                src={form.photoUrl}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              form.name?.charAt(0) || 'U'
            )}
          </div>

          <h3 className="text-xl font-black text-gray-800 mt-4">
            {form.name || 'Usuário'}
          </h3>

          <p className="text-gray-400 text-sm break-all">{form.email}</p>

          <div className="mt-6 bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">
              Saldo atual
            </p>
            <p className="text-2xl font-black text-brand-teal mt-1">
              {formatCurrency(currentBalance)}
            </p>
          </div>

          <div className="mt-4 bg-orange-50 rounded-2xl p-4">
            <p className="text-xs font-black uppercase tracking-widest text-orange-400">
              Renda planejada
            </p>
            <p className="text-xl font-black text-brand-orange mt-1">
              {formatCurrency(Number(form.monthlyIncome || 0))}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full bg-gray-900 text-white px-5 py-3 rounded-xl font-black hover:bg-gray-800 transition"
          >
            Sair da conta
          </button>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5"
        >
          <div>
            <h3 className="text-lg font-black text-gray-800">
              Editar informações
            </h3>
          </div>

          {message && (
            <div className="bg-teal-50 text-brand-teal rounded-xl px-4 py-3 font-bold text-sm">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nome
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Telefone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(18) 99999-9999"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>
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
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Renda mensal planejada
            </label>
            <input
              type="number"
              value={form.monthlyIncome}
              onChange={(e) =>
                setForm({ ...form, monthlyIncome: e.target.value })
              }
              placeholder="Ex: 1700"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <h4 className="text-sm font-black text-gray-700">
              Segurança da conta
            </h4>
            <p className="text-sm text-gray-400 mt-1">
              A alteração de senha será validada com validação por
              PIN no e-mail.
            </p>

            <button
              type="button"
              onClick={() => navigate('/recuperar-senha')}
              className="mt-3 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Alterar senha
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button className="bg-brand-teal text-white px-5 py-3 rounded-xl font-black shadow hover:bg-teal-700 transition">
              Salvar Perfil
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}