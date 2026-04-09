// FRONTEND — api.js : Configuration Axios, intercepteurs JWT et services API (auth, tickets, catégories).
import axios from 'axios';

// URL de base de l'API (depuis .env ou localhost par défaut)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instance Axios configurée avec l'URL de base
const api = axios.create({ baseURL: API_URL });

// ── Intercepteur de requête ──
// Ajoute automatiquement le token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Intercepteur de réponse ──
// Si le token est expiré (401), déconnecter automatiquement l'utilisateur
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Service Authentification ──
export const authService = {
  // Créer un nouveau compte citoyen
  register: async (userData) => (await api.post('/auth/inscription', userData)).data,

  // Se connecter → stocke le token et l'utilisateur dans localStorage
  login: async (credentials) => {
    const res = await api.post('/auth/connexion', {
      email: credentials.email,
      mot_de_passe: credentials.password
    });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.utilisateur));
    }
    return res.data;
  },

  // Se déconnecter → vider le localStorage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Récupérer l'utilisateur connecté depuis localStorage
  getCurrentUser: () => {
    try {
      const u = localStorage.getItem('user');
      return u && u !== 'undefined' ? JSON.parse(u) : null;
    } catch { return null; }
  },

  // Vérifier si l'utilisateur connecté est admin
  isAdmin: () => authService.getCurrentUser()?.role === 'admin',
};

// ── Service Tickets (Signalements) ──
export const ticketService = {
  getAllTickets:  async ()     => (await api.get('/tickets')).data,
  getTicketById: async (id)   => (await api.get(`/tickets/${id}`)).data,
  createTicket:  async (data) => (await api.post('/tickets', data)).data,
  updateStatus:  async (id, statut) => (await api.patch(`/tickets/${id}/statut`, { statut })).data,
  deleteTicket:  async (id)   => (await api.delete(`/tickets/${id}`)).data,
};

// ── Service Catégories ──
export const categorieService = {
  getAllCategories: async () => (await api.get('/categories')).data,
};

// ── Service Commentaires ──
export const commentaireService = {
  getCommentaires: async (ticketId) =>
    (await api.get(`/tickets/${ticketId}/commentaires`)).data,
  addCommentaire: async (ticketId, contenu, uid) =>
    (await api.post(`/tickets/${ticketId}/commentaires`, { contenu, utilisateur_id: uid })).data,
};

// Export par défaut de l'instance Axios (pour les appels directs)
export default api;
