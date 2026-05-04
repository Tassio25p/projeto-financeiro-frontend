// URL base da API.
// No desenvolvimento local vem de: VITE_API_URL=http://127.0.0.1:8000
const API_URL = import.meta.env.VITE_API_URL;

// Nome da chave usada para guardar o token no localStorage
const TOKEN_KEY = 'financas-token';

// Salva o token JWT no navegador após login
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Busca o token salvo no navegador
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Remove o token do navegador ao fazer logout
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('financas-app-data-v2');
  localStorage.removeItem('financas-auth');

  window.dispatchEvent(new Event('auth-changed'));
}
// Monta os headers padrão das requisições
function getHeaders(auth = false) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

// Função genérica para fazer requisições para a API
async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  const contentType = response.headers.get('content-type');

  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.detail || 'Erro ao comunicar com a API.';
    throw new Error(message);
  }

  return data;
}

// ==========================
// AUTENTICAÇÃO
// ==========================

export function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
 const data = await request('/auth/login', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  // Remove dados antigos do usuário anterior
  localStorage.removeItem('financas-app-data-v2');
  localStorage.removeItem('financas-auth');

  // Salva o token JWT da conta atual
  saveToken(data.access_token);
 
 window.dispatchEvent(new Event('auth-changed'));

  return data;
}

export function getCurrentUser() {
  return request('/usuarios/me', {
    method: 'GET',
    headers: getHeaders(true),
  });
}

export function forgotPassword(payload) {
  return request('/auth/forgot-password', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
}

export function verifyPin(payload) {
  return request('/auth/verify-pin', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload) {
  return request('/auth/reset-password', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
}

// ==========================
// CATEGORIAS
// ==========================

// Lista todas as categorias do usuário logado
export function getCategories() {
  return request('/categorias/', {
    method: 'GET',
    headers: getHeaders(true),
  });
}

// Cria uma nova categoria para o usuário logado
export function createCategory(payload) {
  return request('/categorias/', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

// Atualiza uma categoria existente
export function updateCategoryApi(id, payload) {
  return request(`/categorias/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

// Exclui uma categoria
export function deleteCategoryApi(id) {
  return request(`/categorias/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
}

// ==========================
// TRANSAÇÕES
// ==========================

// Lista todas as transações do usuário logado
export function getTransactions() {
  return request('/transacoes/', {
    method: 'GET',
    headers: getHeaders(true),
  });
}

// Cria uma nova transação
export function createTransaction(payload) {
  return request('/transacoes/', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

// Atualiza uma transação existente
export function updateTransactionApi(id, payload) {
  return request(`/transacoes/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

// Exclui uma transação
export function deleteTransactionApi(id) {
  return request(`/transacoes/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
}

// ==========================
// USUÁRIO
// ==========================

export function updateCurrentUser(payload) {
  return request('/usuarios/me', {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}
// ==========================
// DASHBOARD
// ==========================

// Busca resumo financeiro real do usuário logado
export function getDashboardSummary() {
  return request('/dashboard/resumo', {
    method: 'GET',
    headers: getHeaders(true),
  });
}

// ==========================
// METAS FINANCEIRAS
// ==========================

export function getGoals() {
  return request('/metas/', {
    method: 'GET',
    headers: getHeaders(true),
  });
}

export function createGoal(payload) {
  return request('/metas/', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

export function updateGoalApi(id, payload) {
  return request(`/metas/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

export function deleteGoalApi(id) {
  return request(`/metas/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
}

// ==========================
// ORÇAMENTOS
// ==========================

export function getBudgets() {
  return request('/orcamentos/', {
    method: 'GET',
    headers: getHeaders(true),
  });
}

export function createBudget(payload) {
  return request('/orcamentos/', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

export function updateBudgetApi(id, payload) {
  return request(`/orcamentos/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

export function deleteBudgetApi(id) {
  return request(`/orcamentos/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
}