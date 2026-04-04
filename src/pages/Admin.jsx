import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatBox from '../components/StatBox';
import { authService } from '../api';

const Admin = () => {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [tickets, setTickets] = useState([
    { id: 1, titre: "Éclairage Plateau", categorie: "Électricité", statut: "En cours", date: "04/04/2026" }
  ]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketStatut, setTicketStatut] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Pour le message de succès
  const [errorMessage, setErrorMessage] = useState(''); // Pour le message d'erreur

  const handleOpenTicketSettings = (ticket) => {
    setSelectedTicket(ticket);
    setTicketStatut(ticket.statut);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Fonction pour mettre à jour le statut - À IMPLÉMENTER
  const handleUpdateStatut = async () => {
    if (!selectedTicket) return;
    
    try {
      // Appel API pour mettre à jour le statut (à adapter selon votre backend)
      // const response = await axios.put(`/api/tickets/${selectedTicket.id}/statut`, {
      //   statut: ticketStatut
      // });
      
      // Simulation de mise à jour locale (à remplacer par l'appel API réel)
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, statut: ticketStatut }
          : ticket
      );
      setTickets(updatedTickets);
      
      // Afficher le message de succès
      setSuccessMessage(`Statut du ticket "${selectedTicket.titre}" mis à jour avec succès !`);
      
      // Fermer le modal après 1.5 secondes
      setTimeout(() => {
        setSelectedTicket(null);
        setSuccessMessage('');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrorMessage('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Ouvert': return 'text-red-600';
      case 'En cours': return 'text-amber-600';
      case 'Résolu': return 'text-green-600';
      case 'Fermé': return 'text-gray-600';
      default: return 'text-amber-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-10 space-y-10">
      {/* Message de succès global */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-right">
          {successMessage}
        </div>
      )}
      
      {/* Message d'erreur global */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-right">
          {errorMessage}
        </div>
      )}

      <section className="rounded-[3rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 p-10 lg:p-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-slate-200">
              Tableau de bord administrateur
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                Bonjour {user?.nom ? user.nom : 'Administrateur'},
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300 text-lg leading-relaxed">
                Voici un aperçu de l’activité actuelle. Suivez les signalements prioritaires et prenez les bonnes décisions rapidement.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 shadow-inner">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signalements</p>
                <p className="mt-4 text-3xl font-black">156</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 shadow-inner">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Actifs</p>
                <p className="mt-4 text-3xl font-black text-blue-300">42</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 shadow-inner">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Rétablis</p>
                <p className="mt-4 text-3xl font-black text-emerald-300">114</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2.5rem] bg-slate-950/90 p-8 border border-slate-800 shadow-2xl shadow-slate-950/30">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-slate-400 uppercase tracking-[0.3em] text-xs">Session</p>
                <h2 className="mt-2 text-3xl font-black text-white">{user?.nom ? user.nom : 'Admin'}</h2>
              </div>
              <div className="w-16 h-16 rounded-3xl bg-blue-600 grid place-items-center text-2xl">📢</div>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <p><span className="font-bold text-white">Role :</span> {user?.role || 'admin'}</p>
              <p><span className="font-bold text-white">Dernière connexion :</span> 04/04/2026</p>
              <p><span className="font-bold text-white">Équipe :</span> Équipe municipalité Keur Massar </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Ajouter un Administrateur */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-gradient-to-r from-blue-50 to-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👤</span>
              <h3 className="font-black text-slate-800 text-xl">Gestion des Administrateurs</h3>
            </div>
            <p className="text-sm text-slate-600 mt-2">Ajouter et gérez les comptes administrateurs de votre équipe.</p>
          </div>
          <button
            onClick={() => navigate('/admin/create-admin')}
            className="px-6 py-3 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 whitespace-nowrap"
          >
            + Ajouter un Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="font-black text-slate-800">Dernières interventions</h3>
            <p className="text-sm text-slate-500 mt-2">Contrôlez les incidents récents et suivez l’avancement des équipes terrain.</p>
          </div>
          <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-500 transition-all">Tout voir</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="p-8">Incident</th>
                <th className="p-8">Secteur</th>
                <th className="p-8">État</th>
                <th className="p-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-8">
                    <p className="font-bold text-slate-900">{t.titre}</p>
                    <p className="text-xs text-slate-400 font-medium">{t.date}</p>
                   </td>
                  <td className="p-8"><span className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase">{t.categorie}</span></td>
                  <td className="p-8"><span className="flex items-center gap-2 font-black text-xs text-amber-600">● {t.statut}</span></td>
                  <td className="p-8">
                    <button 
                      onClick={() => handleOpenTicketSettings(t)}
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      title="Paramètres du ticket"
                    >
                      ⚙️
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Paramètres du Ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8 space-y-6 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Paramètres du Ticket</h2>
                <p className="text-sm text-slate-500 mt-1">Gérez les détails et le statut</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-2xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Détails du Ticket */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Titre</p>
                <p className="text-lg font-black text-slate-900">{selectedTicket.titre}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Catégorie</p>
                  <p className="text-base font-bold text-slate-700">{selectedTicket.categorie}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Date</p>
                  <p className="text-base font-bold text-slate-700">{selectedTicket.date}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Changez le Statut</label>
                <select
                  value={ticketStatut}
                  onChange={(e) => setTicketStatut(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-slate-100"
                >
                  <option value="Ouvert">🔴 Ouvert</option>
                  <option value="En cours">🟡 En cours</option>
                  <option value="Résolu">🟢 Résolu</option>
                  <option value="Fermé">⚫ Fermé</option>
                </select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateStatut}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
              >
                Mettre à Jour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;