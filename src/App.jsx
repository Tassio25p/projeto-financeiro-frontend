import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transacoes from './pages/Transacoes';
import Categorias from './pages/Categorias';
import ResumoConsumo from './pages/ResumoConsumo';
import Metas from './pages/Metas';
import Orcamentos from './pages/Orcamentos';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarSenha from './pages/RecuperarSenha';
function App() {
  return (
    <FinanceProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col md:flex-row bg-brand-bg text-gray-800">
                <Sidebar />
                <main className="flex-1 p-5 md:p-8 lg:p-10 w-full overflow-hidden">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transacoes" element={<Transacoes />} />
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/resumo" element={<ResumoConsumo />} />
                    <Route path="/metas" element={<Metas />} />
                    <Route path="/orcamentos" element={<Orcamentos />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                    <Route path="*" element={<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">Página não encontrada.</div>} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App;
