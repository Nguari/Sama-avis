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
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  // Connexion
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
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
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  // Vérifier si l'utilisateur est admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

// Service pour les tickets (signalements)
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
  
  // Mettre à jour un ticket
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },
  
  // Supprimer un ticket
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
  
  // Changer le statut d'un ticket
  updateStatus: async (id, statut) => {
    const response = await api.patch(`/tickets/${id}/statut`, { statut });
    return response.data;
  }
};

export default api;