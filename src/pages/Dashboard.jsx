import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';

function StatCard({ title, value, description, tone = 'teal' }) {
  const toneClass = tone === 'orange' ? 'text-brand-orange bg-orange-50' : tone === 'gray' ? 'text-gray-700 bg-gray-100' : 'text-brand-teal bg-teal-50';

  return (
    <div className="bg-brand-card p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${toneClass}`}>
        <span className="text-xl font-black">R$</span>
      </div>
      <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-5">{title}</p>
      <h3 className="text-2xl font-black text-gray-800 mt-1">{value}</h3>
      <p className="text-xs text-gray-400 font-semibold mt-2">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const { stats, transactions } = useFinance();

  const recentTransactions = transactions.slice(0, 5);
  const monthlyChart = Object.values(
    transactions.reduce((acc, item) => {
      const month = item.date?.slice(0, 7) || 'Sem data';
      if (!acc[month]) acc[month] = { month, receitas: 0, despesas: 0, saldo: 0 };
      if (item.type === 'receita') acc[month].receitas += Number(item.value);
      if (item.type === 'despesa') acc[month].despesas += Number(item.value);
      acc[month].saldo = acc[month].receitas - acc[month].despesas;
      return acc;
    }, {})
  ).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Resumo geral das suas finanças.</p>
        </div>
        <Link to="/transacoes" className="bg-brand-orange text-white px-5 py-3 rounded-xl font-bold shadow hover:bg-orange-700 transition text-center">
          Nova Transação
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Saldo total" value={formatCurrency(stats.balance)} description="Receitas menos despesas" />
        <StatCard title="Receitas" value={formatCurrency(stats.income)} description="Total de entradas" />
        <StatCard title="Despesas" value={formatCurrency(stats.expense)} description="Total de saídas" tone="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-brand-card rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-800">Evolução mensal</h3>
              <p className="text-sm text-gray-400">Saldo calculado pelas transações cadastradas.</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChart.length ? monthlyChart : [{ month: 'Atual', saldo: stats.balance }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="saldo" stroke="#0d9488" fill="#ccfbf1" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-brand-card rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-black text-gray-800">Últimas transações</h3>
            <Link to="/transacoes" className="text-brand-teal text-sm font-bold hover:underline">Ver todas</Link>
          </div>
          <div className="space-y-4">
            {recentTransactions.length === 0 && <p className="text-sm text-gray-400">Nenhuma transação cadastrada.</p>}
            {recentTransactions.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 border-b border-gray-50 pb-3 last:border-0">
                <div>
                  <p className="font-bold text-gray-800">{item.description}</p>
                  <p className="text-xs text-gray-400">{item.category} • {formatDate(item.date)}</p>
                </div>
                <p className={`font-black ${item.type === 'receita' ? 'text-brand-teal' : 'text-brand-orange'}`}>
                  {item.type === 'receita' ? '+' : '-'} {formatCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
