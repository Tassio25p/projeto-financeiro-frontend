import { removeToken } from '../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const links = [
  { path: '/', label: 'Dashboard' },
  { path: '/transacoes', label: 'Transações' },
  { path: '/categorias', label: 'Categorias' },
  { path: '/resumo', label: 'Resumo' },
  { path: '/metas', label: 'Metas' },
  { path: '/orcamentos', label: 'Orçamentos' },
  { path: '/perfil', label: 'Meu Perfil' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    removeToken();
  localStorage.removeItem('financas-auth');
  localStorage.removeItem('financas-app-data-v2');
    navigate('/login');
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) => `
    block px-4 py-3 rounded-xl transition font-semibold text-sm
    ${
      isActive(path)
        ? 'bg-brand-teal text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-teal'
    }
  `;

  return (
    <aside className="w-full md:w-64 bg-brand-card shadow-lg border-r border-gray-100 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-black text-brand-teal tracking-tight">
          Finanças<span className="text-brand-orange">.</span>
        </h1>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          Controle financeiro pessoal
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-2">
        {links.map((link) => (
          <Link key={link.path} to={link.path} className={linkClass(link.path)}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full p-3 text-red-500 rounded-xl hover:bg-red-50 transition text-center font-bold text-sm"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}