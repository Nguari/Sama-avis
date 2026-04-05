import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service d'authentification
export const authService = {

  // Inscription citoyen
  register: async (userData) => {
    const response = await api.post('/auth/inscription', userData);
    return response.data;
  },

  // Connexion
  login: async (credentials) => {
    const response = await api.post('/auth/connexion', {
      email:        credentials.email,
      mot_de_passe: credentials.password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.utilisateur));
    }
    return response.data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Vérifier si l'utilisateur est admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

// Service pour les tickets
export const ticketService = {

  // Récupérer tous les tickets
  getAllTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },

  // Récupérer un ticket par ID
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Créer un nouveau ticket
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  // Changer le statut d'un ticket (admin)
  updateStatus: async (id, statut) => {
    const response = await api.patch(`/tickets/${id}/statut`, { statut });
    return response.data;
  },

  // Supprimer un ticket (admin)
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  }
};

// Service pour les catégories
export const categorieService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};

// Service pour les commentaires
export const commentaireService = {
  getCommentaires: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/commentaires`);
    return response.data;
  },
  addCommentaire: async (ticketId, contenu, utilisateur_id) => {
    const response = await api.post(`/tickets/${ticketId}/commentaires`, { contenu, utilisateur_id });
    return response.data;
  }
};

export default api;