// função para transmor a moeda (REAL)
export function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
// função para retornara a data em nosso horario e tipo de data 
export function formatDate(date) {
  if (!date) return 'Sem data';
  const safeDate = new Date(`${date}T00:00:00`);
  return safeDate.toLocaleDateString('pt-BR');
}
// função para retornar a data
export function currentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}
// função para organização dos meses 
export function monthLabel(monthKey) {
  if (!monthKey) return 'Todos os períodos';
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}
// função da entrada da data 
export function toInputDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
