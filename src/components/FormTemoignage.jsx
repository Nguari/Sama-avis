// FRONTEND — FormTemoignage.jsx : Formulaire pour soumettre un témoignage (note + texte).
import { useState } from 'react';
import api from '../services/api';

const FormTemoignage = ({ onSuccess }) => {
  const [contenu, setContenu] = useState('');
  const [note, setNote]       = useState(5);       // Note de 1 à 5 étoiles
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Envoyer le témoignage à l'API
      const res = await api.post('/temoignages', { contenu, note });
      setMessage(res.data.message);
      setIsError(false);
      // Réinitialiser le formulaire
      setContenu('');
      setNote(5);
      // Rafraîchir la liste des témoignages sur la page parente
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'envoi.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
      <h3 className="font-black text-slate-900 text-lg mb-1">✍️ Partagez votre expérience</h3>
      <p className="text-slate-500 text-sm mb-6">Votre témoignage sera publié après validation.</p>

      {/* Message de succès ou d'erreur */}
      {message && (
        <div className={`mb-5 p-4 rounded-2xl text-sm font-bold text-center ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
          {isError ? '⚠ ' : '✅ '}{message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Sélection de la note avec étoiles cliquables */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Votre note</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" onClick={() => setNote(n)}
                className={`text-2xl transition-all hover:scale-110 ${n <= note ? 'text-yellow-400' : 'text-slate-200'}`}>
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Zone de texte avec compteur de caractères */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Votre témoignage</label>
            <span className={`text-[10px] font-bold ${contenu.length > 270 ? 'text-red-500' : 'text-slate-400'}`}>
              {contenu.length}/300
            </span>
          </div>
          <textarea
            rows="4"
            required
            maxLength={300}
            value={contenu}
            placeholder="Décrivez votre expérience avec Sama Avis..."
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none text-sm border border-transparent"
            onChange={e => setContenu(e.target.value)}
          />
        </div>

        {/* Bouton désactivé si moins de 10 caractères */}
        <button type="submit" disabled={loading || contenu.trim().length < 10}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Envoi...</>
            : '📤 Soumettre mon témoignage'
          }
        </button>
      </form>
    </div>
  );
};

export default FormTemoignage;
