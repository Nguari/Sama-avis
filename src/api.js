import axios from 'axios';

// Connexion vers le serveur Node.js Express 
const API_URL = 'http://localhost:3001/api';

export const ticketService = {
  getAllTickets: () => axios.get(`${API_URL}/tickets`),
  getTicketById: (id) => axios.get(`${API_URL}/tickets/${id}`),
  createTicket: (data) => axios.post(`${API_URL}/tickets`, data),
  updateStatus: (id, statut) => axios.patch(`${API_URL}/tickets/${id}/statut`, { statut })
};

export const authService = {
  inscription: (data) => axios.post(`${API_URL}/auth/inscription`, data),
  connexion: (data) => axios.post(`${API_URL}/auth/connexion`, data),
  inscriptionAdmin: (data) => axios.post(`${API_URL}/auth/inscription-admin`, data)
};