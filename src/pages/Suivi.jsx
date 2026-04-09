// FRONTEND — Suivi.jsx : Page de suivi des signalements du citoyen connecté.
// Suivi.jsx — Page de suivi des signalements du citoyen connecté
import { Fragment, useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ETAPES = [
  { key: 'recu',     label: 'Reçu',     icon: '📥' },
  { key: 'assigne',  label: 'Assigné',  icon: '👷' },
  { key: 'en_cours', label: 'En cours', icon: '🔧' },
  { key: 'resolu',   label: 'Résolu',   icon: '✅' },
];

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

const Suivi = () => {
  const userStr = localStorage.getItem('user');
  const user    = userStr && userStr !== 'undefined' && userStr !== 'null' ? JSON.parse(userStr) : null;
  const userId  = useRef(user?.id); // Ref stable pour éviter les re-renders

  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [filtre, setFiltre]       = useState('tous');
  const [tri, setTri]             = useState('recent');

  useEffect(() => {
    if (!userId.current) { setLoading(false); return; }

    const fetchTickets = () => {
      api.get(`/tickets/user/${userId.current}`)
        .then(res => setMyTickets(Array.isArray(res.data) ? res.data : []))
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    fetchTickets();
    const interval  = setInterval(fetchTickets, 30000);
    const onVisible = () => { if (document.visibilityState === 'visible') fetchTickets(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  // Filtrer et trier les tickets
  const ticketsFiltres = useMemo(() => {
    const list = filtre === 'tous' ? myTickets : myTickets.filter(t => t.statut === filtre);
    return [...list].sort((a, b) =>
      tri === 'recent'
        ? new Date(b.date_creation) - new Date(a.date_creation)
        : new Date(a.date_creation) - new Date(b.date_creation)
    );
  }, [myTickets, filtre, tri]);

  // Statistiques rapides
  const stats = useMemo(() => ({
    total:     myTickets.length,
    resolus:   myTickets.filter(t => t.statut === 'resolu').length,
    enCours:   myTickets.filter(t => t.statut === 'en_cours').length,
    enAttente: myTickets.filter(t => t.statut === 'recu' || t.statut === 'assigne').length,
  }), [myTickets]);

  // Page non connecté
  if (!user) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-6">
      <div className="text-6xl">🔒</div>
      <h2 className="text-2xl font-black text-slate-900">Connexion requise</h2>
      <p className="text-slate-500 font-medium">Connectez-vous pour voir vos signalements.</p>
      <Link to="/login" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">
        Se connecter
      </Link>
    </div>
  );

  // Chargement
  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">

      {/* En-tête */}
      <div className="text-center mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Mon espace citoyen</span>
        <h2 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">Mes Signalements</h2>
        <p className="text-slate-500 mt-2 font-medium">Bonjour {user?.nom?.split(' ')[0]}, voici l'état de vos dossiers.</p>
      </div>

      {/* Stats rapides */}
      {myTickets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',      value: stats.total,     color: 'text-slate-900',   bg: 'bg-slate-50' },
            { label: 'En attente', value: stats.enAttente, color: 'text-amber-600',   bg: 'bg-amber-50' },
            { label: 'En cours',   value: stats.enCours,   color: 'text-blue-600',    bg: 'bg-blue-50' },
            { label: 'Résolus',    value: stats.resolus,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Aucun signalement */}
      {myTickets.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-slate-200 rounded-[3rem] text-center space-y-4">
          <div className="text-5xl">📭</div>
          <p className="text-slate-400 font-bold text-lg">Aucun signalement pour le moment.</p>
          <p className="text-slate-400 text-sm">Signalez un problème dans votre quartier et suivez son évolution ici.</p>
          <Link to="/signaler" className="inline-block mt-4 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">
            Faire mon premier signalement →
          </Link>
        </div>
      ) : (
        <>
          {/* Filtres + Tri */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex gap-2 flex-wrap flex-1">
              {[
                { key: 'tous',     label: 'Tous' },
                { key: 'recu',     label: '📥 Reçu' },
                { key: 'assigne',  label: '👷 Assigné' },
                { key: 'en_cours', label: '🔧 En cours' },
                { key: 'resolu',   label: '✅ Résolu' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setFiltre(key)}
                  className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filtre === key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'}`}>
                  {label}
                </button>
              ))}
            </div>
            <select value={tri} onChange={e => setTri(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 outline-none cursor-pointer">
              <option value="recent">Plus récent</option>
              <option value="ancien">Plus ancien</option>
            </select>
          </div>

          {ticketsFiltres.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl">
              Aucun signalement pour ce filtre.
            </div>
          ) : (
            <div className="space-y-6">
              {ticketsFiltres.map(ticket => {
                const etapeIndex = ETAPES.findIndex(e => e.key === ticket.statut);
                const photos     = ticket.photo_url ? ticket.photo_url.split(',') : [];
                const isOpen     = selected === ticket.id;

                return (
                  <div key={ticket.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    {/* En-tête du ticket */}
                    <div className={`p-6 text-white ${ticket.statut === 'resolu' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' : 'bg-gradient-to-r from-slate-900 to-slate-800'}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase opacity-50 mb-1">#{ticket.id.substring(0, 8)}</p>
                          <h4 className="text-lg font-black uppercase tracking-tight truncate">{ticket.titre}</h4>
                          <p className="text-[10px] opacity-60 mt-1 uppercase tracking-widest">{ticket.categorie}</p>
                        </div>
                        <button onClick={() => setSelected(isOpen ? null : ticket.id)}
                          className="shrink-0 bg-white/20 hover:bg-white/30 transition-all px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          {isOpen ? '↑' : '↓'}
                        </button>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="px-8 pt-6 pb-2">
                      <div className="flex items-center justify-between">
                        {ETAPES.map((etape, i) => (
                          <Fragment key={etape.key}>
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${i <= etapeIndex ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-100'}`}>
                                {etape.icon}
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-wider hidden sm:block ${i <= etapeIndex ? 'text-blue-600' : 'text-slate-300'}`}>
                                {etape.label}
                              </span>
                            </div>
                            {i < ETAPES.length - 1 && (
                              <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${i < etapeIndex ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                            )}
                          </Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Infos de base */}
                    <div className="px-8 py-4 flex justify-between items-center">
                      <p className="text-sm text-slate-500 font-medium italic truncate max-w-[60%]">
                        📍 {ticket.description?.slice(0, 50) || 'Aucune description'}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase shrink-0">
                        {new Date(ticket.date_creation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    {/* Détails dépliables */}
                    {isOpen && (
                      <div className="px-8 pb-8 space-y-5 border-t border-slate-50 pt-6">
                        {ticket.description && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description complète</p>
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">{ticket.description}</p>
                          </div>
                        )}
                        {photos.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Photos ({photos.length})</p>
                            <div className="grid grid-cols-3 gap-3">
                              {photos.map((url, i) => (
                                <a key={i} href={`${BACKEND_URL}${url}`} target="_blank" rel="noreferrer">
                                  <img src={`${BACKEND_URL}${url}`} alt={`photo-${i}`}
                                    className="h-24 w-full object-cover rounded-2xl border border-slate-100 hover:scale-105 transition-transform shadow-sm" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        {ticket.latitude && ticket.longitude && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Localisation GPS</p>
                            <a href={`https://www.google.com/maps?q=${ticket.latitude},${ticket.longitude}`}
                              target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-600 font-bold hover:underline bg-blue-50 px-4 py-2 rounded-xl">
                              📍 Voir sur Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/signaler" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              + Nouveau signalement
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Suivi;
