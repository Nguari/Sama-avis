import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Suivi = () => {
  const userStr = localStorage.getItem('user');
  const user    = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchMyTickets = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/tickets/user/${user.id}`);
        setMyTickets(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTickets();
  }, [user?.id]);

  const getProgress = (s) => {
    const steps = { 'recu': '25%', 'assigne': '50%', 'en_cours': '75%', 'resolu': '100%' };
    return steps[s] || '0%';
  };

  if (!user) return (
    <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">
      Connectez-vous pour voir vos signalements.
    </div>
  );

  if (loading) return (
    <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">
      Chargement...
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-black text-slate-900 mb-10 text-center">Mes Signalements</h2>

      {myTickets.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-slate-200 rounded-[3rem] text-center text-slate-400 font-bold">
          Aucun signalement trouvé pour votre compte.
        </div>
      ) : (
        <div className="space-y-6">
          {myTickets.map((t) => (
            <div key={t.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className={`p-6 text-white flex justify-between items-center ${t.statut === 'resolu' ? 'bg-green-600' : 'bg-slate-900'}`}>
                <div>
                  <p className="text-[9px] font-black uppercase opacity-60">Ticket #{t.id.substring(0, 8)}</p>
                  <h4 className="text-lg font-black uppercase tracking-tighter">{t.titre}</h4>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                  {t.statut?.replace('_', ' ')}
                </span>
              </div>
              <div className="p-8">
                <div className="h-2 w-full bg-slate-100 rounded-full mb-4">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: getProgress(t.statut) }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 font-medium italic">
                    📍 {t.description?.slice(0, 40) || 'Aucune description'}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    {new Date(t.date_creation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suivi;