// FRONTEND — Admin.jsx : Tableau de bord admin (tickets, utilisateurs, témoignages, mairies).
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api';
import api from '../services/api';

const CATEGORIES = [
  { key: 'voirie',    label: 'Voirie',     icon: '🛣️' },
  { key: 'eclairage', label: 'Éclairage',  icon: '💡' },
  { key: 'proprete',  label: 'Propreté',   icon: '♻️' },
  { key: 'eau',       label: 'Eau',        icon: '🚰' },
  { key: 'sante',     label: 'Santé',      icon: '❤️' },
  { key: 'autre',     label: 'Autre',      icon: '🔘' },
];

const Admin = () => {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem('user');
  const user     = userStr && userStr !== 'undefined' && userStr !== 'null' ? JSON.parse(userStr) : null;

  const [tickets, setTickets]               = useState([]);
  const [utilisateurs, setUtilisateurs]     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketStatut, setTicketStatut]     = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage]     = useState('');
  const [isExpanded, setIsExpanded]         = useState(false);
  const [filtreStatut, setFiltreStatut]     = useState('tous');
  const [activeTab, setActiveTab]           = useState('tickets');
  const [temoignages, setTemoignages]       = useState([]);
  const [temoLoading, setTemoLoading]       = useState(false);
  const [visites, setVisites]               = useState(null);
  const [visitesLoading, setVisitesLoading] = useState(false);
  const [mairieModal, setMairieModal]       = useState(null);
  const [mairieData, setMairieData]         = useState(null);
  const [mairieChoisie, setMairieChoisie]   = useState('');
  const [messageAdmin, setMessageAdmin]     = useState('');
  const [mairieLoading, setMairieLoading]   = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login');
  }, []); // eslint-disable-line

  // Charger les témoignages
  const fetchTemoignages = async () => {
    setTemoLoading(true);
    try {
      const res = await api.get('/temoignages/tous');
      setTemoignages(Array.isArray(res.data) ? res.data : []);
    } catch { } finally {
      setTemoLoading(false);
    }
  };

  const fetchVisites = async () => {
    setVisitesLoading(true);
    try {
      const res = await api.get('/visites');
      setVisites(res.data);
    } catch { } finally {
      setVisitesLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsData, usersData] = await Promise.all([
          ticketService.getAllTickets(),
          api.get('/utilisateurs').then(r => r.data).catch(() => []),
        ]);
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
        setUtilisateurs(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchTemoignages();

    const interval = setInterval(fetchData, 30000);
    const onVisible = () => { if (document.visibilityState === 'visible') fetchData(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const total   = tickets.length;
  const actifs  = tickets.filter(t => t.statut !== 'resolu').length;
  const resolus = tickets.filter(t => t.statut === 'resolu').length;
  const enCours = tickets.filter(t => t.statut === 'en_cours').length;

  const ticketsFiltres = filtreStatut === 'tous' ? tickets : tickets.filter(t => t.statut === filtreStatut);
  const ticketsToDisplay = isExpanded ? ticketsFiltres : ticketsFiltres.slice(0, 8);

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
      setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, statut: ticketStatut } : t));
      setSuccessMessage(`Statut mis à jour avec succès !`);
      setTimeout(() => { setSelectedTicket(null); setSuccessMessage(''); }, 1500);
    } catch {
      setErrorMessage('Erreur lors de la mise à jour.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Supprimer ce ticket définitivement ?')) return;
    try {
      await ticketService.deleteTicket(id);
      setTickets(tickets.filter(t => t.id !== id));
      setSuccessMessage('Ticket supprimé.');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch {
      setErrorMessage('Erreur lors de la suppression.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleOuvrirMairie = async (ticket) => {
    setMairieModal(ticket);
    setMairieData(null);
    setMairieChoisie('');
    setMessageAdmin('');
    try {
      const res = await api.get(`/tickets/${ticket.id}/mairie-proche`);
      setMairieData(res.data);
      setMairieChoisie(res.data.mairie.email);
    } catch {
      setErrorMessage('Erreur lors de la recherche de la mairie.');
    }
  };

  const handleEnvoyerMairie = async () => {
    if (!mairieModal || !mairieChoisie) return;
    const mairieTrouvee = mairieData?.toutes_mairies?.find(m => m.email === mairieChoisie);
    setMairieLoading(true);
    try {
      const res = await api.post(`/tickets/${mairieModal.id}/envoyer-mairie`, {
        email_mairie: mairieChoisie,
        nom_mairie:   mairieTrouvee?.nom || mairieChoisie,
        message_admin: messageAdmin
      });
      setMairieModal(null);
      setSuccessMessage(res.data.message || `Signalement transmis à ${mairieTrouvee?.nom} avec succès !`);
      setTickets(tickets.map(t => t.id === mairieModal.id ? { ...t, statut: 'assigne', mairie_destinataire: mairieTrouvee?.nom } : t));
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Erreur lors de l\'envoi.');
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setMairieLoading(false);
    }
  };

  const getStatusColor = (s) => ({ recu: 'text-yellow-600', assigne: 'text-blue-600', en_cours: 'text-amber-600', resolu: 'text-green-600' }[s] || 'text-slate-600');
  const getStatusBg    = (s) => ({ recu: 'bg-yellow-50 border-yellow-200', assigne: 'bg-blue-50 border-blue-200', en_cours: 'bg-amber-50 border-amber-200', resolu: 'bg-green-50 border-green-200' }[s] || 'bg-slate-50 border-slate-200');
  const getStatusDot   = (s) => ({ recu: '🟡', assigne: '🔵', en_cours: '🟠', resolu: '🟢' }[s] || '⚪');
  const formatStatut   = (s) => ({ recu: 'Reçu', assigne: 'Assigné', en_cours: 'En cours', resolu: 'Résolu' }[s] || s);
  const isCritique     = (t) => t.priorite === 'haute' && t.statut !== 'resolu';

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">

      {/* Flash messages */}
      {successMessage && <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-fadeInDown">{successMessage}</div>}
      {errorMessage   && <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-fadeInDown">{errorMessage}</div>}

      {/* Bandeau alertes critiques */}
      {!loading && tickets.filter(t => isCritique(t)).length > 0 && (() => {
        const nb = tickets.filter(t => isCritique(t)).length;
        return (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-4">
            <span className="relative flex h-4 w-4 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
            <div>
              <p className="font-black text-red-700 text-sm">
                🚨 {nb} signalement{nb > 1 ? 's' : ''} critique{nb > 1 ? 's' : ''} en attente de traitement !
              </p>
              <p className="text-red-500 text-xs font-medium mt-0.5">Ces signalements nécessitent une intervention urgente.</p>
            </div>
          </div>
        );
      })()}

      {/* Header */}
      <section className="rounded-[3rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden shadow-2xl">
        <div className="p-10 lg:p-14">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Tableau de bord admin
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
                Bonjour {user?.nom?.split(' ')[0] || 'Admin'} 👋
              </h1>
              <p className="text-slate-400 font-medium">{user?.email}</p>
            </div>
            <button onClick={() => navigate('/admin/create-admin')} className="self-start px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/30">
              + Ajouter un Admin
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'Total signalements', value: total,   color: 'text-white',        bg: 'bg-white/5' },
              { label: 'En attente / actifs', value: actifs,  color: 'text-blue-400',     bg: 'bg-blue-500/10' },
              { label: 'En cours',            value: enCours, color: 'text-amber-400',    bg: 'bg-amber-500/10' },
              { label: 'Résolus',             value: resolus, color: 'text-emerald-400',  bg: 'bg-emerald-500/10' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} p-5 rounded-2xl border border-white/5`}>
                <p className="text-[10px] uppercase text-slate-400 tracking-widest font-black">{label}</p>
                <p className={`text-3xl font-black mt-1 ${color}`}>{loading ? '...' : value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats par catégorie */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8">
        <h3 className="font-black text-slate-800 text-lg mb-6 uppercase tracking-tight">📊 Répartition par catégorie</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ key, label, icon }) => {
            const count = tickets.filter(t => t.categorie === key).length;
            const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key} className="text-center p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-2xl font-black text-slate-900">{count}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">{label}</p>
                <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
                </div>
                <p className="text-[9px] text-slate-400 mt-1">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {[
          { key: 'tickets',      label: '📋 Tickets',      count: total },
          { key: 'utilisateurs', label: '👥 Utilisateurs',  count: utilisateurs.length },
          { key: 'temoignages',  label: '⭐ Témoignages',   count: temoignages.filter(t => t.statut === 'en_attente').length },
          { key: 'visiteurs',    label: '👁️ Visiteurs',     count: visites?.total || 0 },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              if (key === 'temoignages') fetchTemoignages();
              if (key === 'visiteurs') fetchVisites();
            }}
            className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === key ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'}`}
          >
            {label} <span className="ml-2 text-xs opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {/* Tab Tickets */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">Gestion des signalements</h3>
            {/* Filtres statut */}
            <div className="flex gap-2 flex-wrap">
              {['tous', 'recu', 'assigne', 'en_cours', 'resolu'].map(s => (
                <button
                  key={s}
                  onClick={() => { setFiltreStatut(s); setIsExpanded(false); }}
                  className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filtreStatut === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'}`}
                >
                  {s === 'tous' ? 'Tous' : formatStatut(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-50">
                  <th className="p-5">Titre / Catégorie</th>
                  <th className="p-5">Statut</th>
                  <th className="p-5">Mairie</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="p-20 text-center font-bold text-slate-400 italic">Chargement...</td></tr>
                ) : ticketsToDisplay.length === 0 ? (
                  <tr><td colSpan="5" className="p-20 text-center font-bold text-slate-400">Aucun ticket trouvé.</td></tr>
                ) : ticketsToDisplay.map((ticket) => (
                  <tr key={ticket.id} className={`border-b border-slate-50 hover:bg-blue-50/30 transition-all group ${isCritique(ticket) ? 'bg-red-50/40' : ''}`}>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        {isCritique(ticket) && (
                          <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                        )}
                        <div>
                          <p className={`font-black group-hover:text-blue-600 transition-colors ${isCritique(ticket) ? 'text-red-700' : 'text-slate-800'}`}>
                            {ticket.titre}
                            {isCritique(ticket) && <span className="ml-2 text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Critique</span>}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold">{ticket.categorie || 'Autre'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-black text-[10px] uppercase tracking-widest ${getStatusBg(ticket.statut)} ${getStatusColor(ticket.statut)}`}>
                        {getStatusDot(ticket.statut)} {formatStatut(ticket.statut)}
                      </span>
                    </td>
                    <td className="p-5">
                      {ticket.mairie_destinataire ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black">
                          ✅ {ticket.mairie_destinataire.replace('Mairie de ', '')}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-bold">—</span>
                      )}
                    </td>
                    <td className="p-5 text-[11px] text-slate-400 font-bold">
                      {new Date(ticket.date_creation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleOpenTicketSettings(ticket)} className="px-4 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-xl font-black text-[10px] uppercase transition-all">
                          ⚙️ Gérer
                        </button>
                        <button onClick={() => handleOuvrirMairie(ticket)} className="px-4 py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl font-black text-[10px] uppercase transition-all" title="Envoyer à la mairie">
                          🏛️
                        </button>
                        <button onClick={() => handleDeleteTicket(ticket.id)} className="px-4 py-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-black text-[10px] uppercase transition-all">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && ticketsFiltres.length > 8 && (
            <div className="p-6 flex justify-center bg-slate-50/30 border-t border-slate-100">
              <button onClick={() => setIsExpanded(!isExpanded)} className="px-10 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                {isExpanded ? '↑ Réduire' : `↓ Voir tout (${ticketsFiltres.length})`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Utilisateurs */}
      {activeTab === 'utilisateurs' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">👥 Utilisateurs inscrits</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-50">
                  <th className="p-5">Nom</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Rôle</th>
                  <th className="p-5">Inscription</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.length === 0 ? (
                  <tr><td colSpan="4" className="p-20 text-center font-bold text-slate-400">Aucun utilisateur.</td></tr>
                ) : utilisateurs.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-xl flex items-center justify-center font-black text-sm">
                          {u.nom?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-black text-slate-800">{u.nom}</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-500 font-medium">{u.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-5 text-[11px] text-slate-400 font-bold">
                      {new Date(u.date_creation).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Témoignages */}
      {activeTab === 'temoignages' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">⭐ Témoignages citoyens</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">
                {temoignages.filter(t => t.statut === 'en_attente').length} en attente
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
                {temoignages.filter(t => t.statut === 'approuve').length} approuvés
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {temoLoading ? (
              <div className="p-16 text-center text-slate-400 font-bold">Chargement...</div>
            ) : temoignages.length === 0 ? (
              <div className="p-16 text-center text-slate-400 font-bold">📢 Aucun témoignage pour le moment.</div>
            ) : temoignages.map(tm => (
              <div key={tm.id} className="p-6 flex items-start gap-5 hover:bg-slate-50/50 transition-all">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-xl flex items-center justify-center font-black shrink-0">
                  {tm.auteur?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-black text-slate-900 text-sm">{tm.auteur}</p>
                    <span className="text-yellow-400 text-xs">{'★'.repeat(tm.note)}{'☆'.repeat(5 - tm.note)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      tm.statut === 'approuve'   ? 'bg-emerald-100 text-emerald-700' :
                      tm.statut === 'refuse'     ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>{tm.statut.replace('_', ' ')}</span>
                  </div>
                  <p className="text-slate-600 text-sm italic">"{tm.contenu}"</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{new Date(tm.date_creation).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {tm.statut !== 'approuve' && (
                    <button
                      onClick={async () => {
                        await api.patch(`/temoignages/${tm.id}/statut`, { statut: 'approuve' });
                        fetchTemoignages();
                        setSuccessMessage('Témoignage approuvé !');
                        setTimeout(() => setSuccessMessage(''), 2000);
                      }}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl font-black text-[10px] uppercase transition-all"
                    >✅ Approuver</button>
                  )}
                  {tm.statut !== 'refuse' && (
                    <button
                      onClick={async () => {
                        await api.patch(`/temoignages/${tm.id}/statut`, { statut: 'refuse' });
                        fetchTemoignages();
                        setSuccessMessage('Témoignage refusé.');
                        setTimeout(() => setSuccessMessage(''), 2000);
                      }}
                      className="px-3 py-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-black text-[10px] uppercase transition-all"
                    >❌ Refuser</button>
                  )}
                  <button
                    onClick={async () => {
                      if (!window.confirm('Supprimer ce témoignage ?')) return;
                      await api.delete(`/temoignages/${tm.id}`);
                      fetchTemoignages();
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-xl font-black text-[10px] uppercase transition-all"
                  >🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Visiteurs */}
      {activeTab === 'visiteurs' && (
        <div className="space-y-6">

          {visitesLoading ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold">Chargement des statistiques...</p>
            </div>
          ) : !visites ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-16 text-center">
              <p className="text-slate-400 font-bold">👁️ Aucune donnée de visite disponible.</p>
            </div>
          ) : (
            <>
              {/* Stats globales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total visites',   value: visites.total,                                          color: 'text-blue-600',    bg: 'bg-blue-50' },
                  { label: 'Pages visitées',  value: visites.parPage?.length || 0,                           color: 'text-slate-900',   bg: 'bg-slate-50' },
                  { label: 'Aujourd\'hui',    value: visites.parJour?.find(j => j.jour === new Date().toISOString().split('T')[0])?.nb || 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Cette semaine',   value: visites.parJour?.reduce((s, j) => s + j.nb, 0) || 0,   color: 'text-amber-600',   bg: 'bg-amber-50' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-2xl p-5 text-center`}>
                    <p className={`text-3xl font-black ${color}`}>{value}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Visites par page */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8">
                <h3 className="font-black text-slate-800 text-lg mb-6 uppercase tracking-tight">📊 Pages les plus visitées</h3>
                <div className="space-y-3">
                  {visites.parPage?.map(({ page, nb }) => {
                    const pct = visites.total > 0 ? Math.round((nb / visites.total) * 100) : 0;
                    return (
                      <div key={page} className="flex items-center gap-4">
                        <span className="text-sm font-black text-slate-700 w-28 shrink-0">{page}</span>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-sm font-black text-slate-500 w-16 text-right">{nb} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dernières visites */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                  <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">🕒 Dernières visites</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-50">
                        <th className="p-5">Page</th>
                        <th className="p-5">Navigateur</th>
                        <th className="p-5">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visites.dernieres?.length === 0 ? (
                        <tr><td colSpan="3" className="p-16 text-center text-slate-400 font-bold">Aucune visite enregistrée.</td></tr>
                      ) : visites.dernieres?.map((v, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                          <td className="p-5">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase">{v.page}</span>
                          </td>
                          <td className="p-5 text-slate-500 text-xs font-medium truncate max-w-[200px]">
                            {v.user_agent?.split(' ')[0] || 'Inconnu'}
                          </td>
                          <td className="p-5 text-[11px] text-slate-400 font-bold">
                            {new Date(v.date_visite).toLocaleString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal Mairie */}
      {mairieModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden">

            {/* Header modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black">🏛️ Envoyer à la Mairie</h3>
                  <p className="text-blue-100 text-sm mt-1 font-medium truncate max-w-xs">{mairieModal.titre}</p>
                </div>
                <button onClick={() => setMairieModal(null)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center font-black text-lg transition-all">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {!mairieData ? (
                <div className="flex items-center justify-center py-12 gap-3">
                  <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  <p className="text-slate-500 font-bold text-sm">Recherche de la mairie la plus proche...</p>
                </div>
              ) : (
                <>
                  {/* Mairie suggérée */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">✅ Mairie la plus proche détectée</p>
                    <p className="font-black text-slate-900 text-sm">{mairieData.mairie.nom}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{mairieData.mairie.email}</p>
                    <p className="text-blue-600 text-xs font-bold mt-1">
                      📍 {mairieData.distance ? `${mairieData.distance} km — via GPS` : `Détecté via ${mairieData.methode}`}
                    </p>
                  </div>

                  {/* Choix mairie */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Choisir une mairie</label>
                    <select
                      value={mairieChoisie}
                      onChange={e => setMairieChoisie(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-slate-200 cursor-pointer"
                    >
                      {mairieData.toutes_mairies.map(m => (
                        <option key={m.email} value={m.email}>{m.nom}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message admin */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Message additionnel <span className="normal-case font-medium">(optionnel)</span></label>
                    <textarea
                      rows="3"
                      value={messageAdmin}
                      placeholder="Ex: Intervention urgente, route principale bloquée..."
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none text-sm border border-slate-200"
                      onChange={e => setMessageAdmin(e.target.value)}
                    />
                  </div>

                  {/* Info */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                    <span className="text-sm">⚠️</span>
                    <p className="text-amber-700 text-xs font-medium leading-relaxed">
                      Le signalement complet sera envoyé par email à la mairie. Le statut passera à <strong>Assigné</strong>.
                    </p>
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleEnvoyerMairie}
                      disabled={mairieLoading || !mairieChoisie}
                      className="flex-1 py-4 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {mairieLoading
                        ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Envoi...</>
                        : '📧 Envoyer à la Mairie'
                      }
                    </button>
                    <button
                      onClick={() => setMairieModal(null)}
                      className="px-6 py-4 bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal statut */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm grid place-items-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-1">Modifier le statut</h3>
            <p className="text-slate-500 text-sm mb-2 font-medium">{selectedTicket.titre}</p>
            <p className="text-slate-400 text-xs mb-8 italic">ID : #{selectedTicket.id.substring(0, 8)}</p>

            {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold text-center">{successMessage}</div>}

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau Statut</label>
                <select
                  value={ticketStatut}
                  onChange={(e) => setTicketStatut(e.target.value)}
                  className="w-full mt-2 p-5 bg-slate-50 rounded-2xl font-black text-slate-700 outline-none ring-2 ring-transparent focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="recu">🟡 Reçu</option>
                  <option value="assigne">🔵 Assigné</option>
                  <option value="en_cours">🟠 En cours</option>
                  <option value="resolu">🟢 Résolu</option>
                </select>
              </div>
              <div className="flex gap-4">
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
