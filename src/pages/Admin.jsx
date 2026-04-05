import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api';

const Admin = () => {
  const navigate  = useNavigate();
  const userStr   = localStorage.getItem('user');
  const user      = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  const [tickets, setTickets]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketStatut, setTicketStatut]     = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage]     = useState('');
  
  // NOUVEL ÉTAT : Pour l'affichage réduit ou complet
  const [isExpanded, setIsExpanded]         = useState(false);

  // Chargement des tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getAllTickets();
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur chargement tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Statistiques
  const total    = tickets.length;
  const actifs   = tickets.filter(t => t.statut !== 'resolu').length;
  const resolus  = tickets.filter(t => t.statut === 'resolu').length;

  // Logique d'affichage : On limite à 5 si "isExpanded" est faux
  const ticketsToDisplay = isExpanded ? tickets : tickets.slice(0, 5);

  const handleOpenTicketSettings = (ticket) => {
    setSelectedTicket(ticket);
    setTicketStatut(ticket.statut);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleUpdateStatut = async () => {
    if (!selectedTicket) return;
    try {
      await ticketService.updateStatus(selectedTicket.id, ticketStatut);
      setTickets(tickets.map(t =>
        t.id === selectedTicket.id ? { ...t, statut: ticketStatut } : t
      ));
      setSuccessMessage(`Statut de "${selectedTicket.titre}" mis à jour !`);
      setTimeout(() => {
        setSelectedTicket(null);
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      setErrorMessage('Erreur lors de la mise à jour.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'recu':     return 'text-yellow-600';
      case 'assigne':  return 'text-blue-600';
      case 'en_cours': return 'text-amber-600';
      case 'resolu':   return 'text-green-600';
      default:         return 'text-slate-600';
    }
  };

  const getStatusDot = (statut) => {
    switch (statut) {
      case 'recu':     return '🟡';
      case 'assigne':  return '🔵';
      case 'en_cours': return '🟠';
      case 'resolu':   return '🟢';
      default:         return '⚪';
    }
  };

  const formatStatut = (statut) => {
    const labels = { recu: 'Reçu', assigne: 'Assigné', en_cours: 'En cours', resolu: 'Résolu' };
    return labels[statut] || statut;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-10 space-y-10">
      
      {/* Notifications Flash */}
      {successMessage && <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold">{successMessage}</div>}
      {errorMessage && <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold">{errorMessage}</div>}

      {/* Header & Stats */}
      <section className="rounded-[3rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 p-10 lg:p-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Tableau de bord admin</div>
            <h1 className="text-5xl font-black tracking-tight">Bonjour {user?.prenom || 'Admin'},</h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase text-slate-400">Total</p>
                <p className="text-2xl font-black">{loading ? '...' : total}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase text-slate-400 tracking-widest">Actifs</p>
                <p className="text-2xl font-black text-blue-400">{loading ? '...' : actifs}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase text-slate-400 tracking-widest">Résolus</p>
                <p className="text-2xl font-black text-emerald-400">{loading ? '...' : resolus}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800">
             <h2 className="font-black text-xl mb-4 italic">Profil Admin</h2>
             <p className="text-slate-400 text-sm">Session : <span className="text-white font-bold">{user?.email}</span></p>
             <p className="text-slate-400 text-sm mt-1">Ville : <span className="text-white font-bold">Dakar (Keur Massar)</span></p>
          </div>
        </div>
      </section>

      {/* Gestion Admins */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 flex justify-between items-center">
        <div>
          <h3 className="font-black text-slate-800 text-lg">Équipe de gestion</h3>
          <p className="text-slate-500 text-sm">Gérez les accès des autres administrateurs.</p>
        </div>
        <button onClick={() => navigate('/admin/create-admin')} className="px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          + Ajouter un Admin
        </button>
      </div>

      {/* Liste des tickets avec option "Voir Plus" */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-800 uppercase tracking-tighter text-xl">📋 Dernières interventions</h3>
          <span className="text-[10px] font-black bg-slate-200 px-3 py-1 rounded-full uppercase">Mise à jour réelle</span>
        </div>

        <div className="overflow-x-auto text-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-50">
                <th className="p-6">Titre / Sujet</th>
                <th className="p-6">Statut Actuel</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="p-20 text-center font-bold text-slate-400 italic">Chargement des données...</td></tr>
              ) : ticketsToDisplay.map((ticket) => (
                <tr key={ticket.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-all group">
                  <td className="p-6">
                    <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{ticket.titre}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{ticket.categorie || 'Signalement'}</p>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest ${getStatusColor(ticket.statut)}`}>
                      {getStatusDot(ticket.statut)} {formatStatut(ticket.statut)}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button onClick={() => handleOpenTicketSettings(ticket)} className="px-5 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-xl font-black text-[10px] uppercase transition-all">
                      ⚙️ Gérer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOUTON DYNAMIQUE TOUT VOIR / RÉDUIRE */}
        {!loading && tickets.length > 5 && (
          <div className="p-6 flex justify-center bg-slate-50/30 border-t border-slate-100">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-10 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95"
            >
              {isExpanded ? '↑ Réduire la liste' : `↓ Voir tout (${tickets.length} tickets)`}
            </button>
          </div>
        )}
      </div>

      {/* Modal de changement de statut */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm grid place-items-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Modifier l'intervention</h3>
            <p className="text-slate-500 text-sm mb-8 italic">ID Ticket : #{selectedTicket.id}</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau Statut</label>
                <select 
                  value={ticketStatut} 
                  onChange={(e) => setTicketStatut(e.target.value)}
                  className="w-full mt-2 p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="recu">🟡 Reçu</option>
                  <option value="assigne">🔵 Assigné</option>
                  <option value="en_cours">🟠 En cours</option>
                  <option value="resolu">🟢 Résolu (Clôturé)</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleUpdateStatut} className="flex-1 py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                  Enregistrer
                </button>
                <button onClick={() => setSelectedTicket(null)} className="px-8 py-5 bg-slate-100 text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
