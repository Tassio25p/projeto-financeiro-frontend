import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function RecuperarSenha() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: '',
    pin: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleSendPin(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!form.email) {
      setError('Informe seu e-mail.');
      return;
    }

    setMessage('PIN enviado para o e-mail informado.');
    setStep(2);
  }

  function handleVerifyPin(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (form.pin.length !== 6) {
      setError('O PIN deve ter 6 dígitos.');
      return;
    }

    setMessage('PIN validado com sucesso.');
    setStep(3);
  }

  function handleResetPassword(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (form.password.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('As senhas não são iguais.');
      return;
    }

    setMessage('Senha redefinida com sucesso. Simulação visual.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-brand-teal">
            Recuperar senha<span className="text-brand-orange">.</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Informe seu e-mail para receber um PIN de recuperação.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-2 flex-1 rounded-full mx-1 ${
                step >= item ? 'bg-brand-teal' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-teal-50 text-brand-teal text-sm font-bold p-3 rounded-xl mb-4">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendPin} className="space-y-4">
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

            <button className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition">
              Enviar PIN
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                PIN recebido no e-mail
              </label>
              <input
                required
                maxLength={6}
                value={form.pin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pin: e.target.value.replace(/\D/g, ''),
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100 tracking-[0.5em] text-center font-black"
                placeholder="000000"
              />
            </div>

            <button className="w-full bg-brand-teal text-white py-3 rounded-xl font-black shadow hover:bg-teal-700 transition">
              Verificar PIN
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-gray-400 font-bold text-sm hover:underline"
            >
              Voltar para e-mail
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nova senha
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Confirmar nova senha
              </label>
              <input
                required
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-100"
                placeholder="Digite novamente"
              />
            </div>

            <button className="w-full bg-brand-orange text-white py-3 rounded-xl font-black shadow hover:bg-orange-700 transition">
              Redefinir senha
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Lembrou sua senha?{' '}
          <Link to="/login" className="text-brand-teal font-black hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}