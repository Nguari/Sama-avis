import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api';

const Signalement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    titre: '',
    categorie: 'voirie',
    priorite: 'normale',
    adresse: '',
    description: '',
    latitude: '',
    longitude: ''
  });

  const [attachments, setAttachments] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/register'); }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  const handleAttachmentsChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
    setAttachments(files);
    setPreviews(newPreviews);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          });
          setStatusMessage('Position actuelle obtenue avec succès !');
          setTimeout(() => setStatusMessage(''), 3000);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setStatusMessage('Erreur lors de l\'obtention de la position. Vérifiez les permissions.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setStatusMessage('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!formData.titre || !formData.adresse) {
      setStatusMessage('Veuillez remplir le titre et l’adresse du signalement.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('categorie', formData.categorie);
      data.append('priorite', formData.priorite);
      data.append('adresse', formData.adresse);
      data.append('description', formData.description);
      data.append('utilisateur_id', user?.id || '');
      if (formData.latitude && formData.longitude) {
        data.append('latitude', formData.latitude);
        data.append('longitude', formData.longitude);
      }
      attachments.forEach((file) => data.append('attachments', file));

      await ticketService.createTicket(data);
      setStatusMessage('Signalement envoyé avec succès !');
      setFormData({ titre: '', categorie: 'voirie', priorite: 'normale', adresse: '', description: '', latitude: '', longitude: '' });
      setAttachments([]);
      setPreviews([]);
    } catch (err) {
      setStatusMessage(err.response?.data?.message || 'Erreur lors de l’envoi du signalement.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl font-black rotate-12 select-none">DAKAR</div>
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Service Public</span>
            <h2 className="text-4xl font-black mt-4 mb-3 tracking-tight">Soumettre un incident</h2>
            <p className="text-slate-400 font-medium italic">Bonjour {user?.nom || 'Citoyen'}, votre contribution améliore le quotidien de tous.</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-300 font-black">Étape 1</p>
                <p className="mt-3 text-sm text-slate-200">Renseignez les détails de votre signalement.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-300 font-black">Étape 2</p>
                <p className="mt-3 text-sm text-slate-200">Ajoutez plusieurs photos ou une vidéo pour prouver l’incident.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 pt-10">
          <span className="typewriter inline-block text-3xl md:text-5xl font-black text-blue-600 tracking-widest uppercase">
            Sa khalate sounou Yitè
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          
          {/* Section 1 : Détails de base */}
          {statusMessage && (
            <div className="rounded-3xl p-4 text-sm font-bold text-center text-white bg-slate-900/90">
              {statusMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">Quoi ? (Titre)</label>
              <input 
                type="text" 
                value={formData.titre}
                placeholder="Ex: Éclairage défectueux" 
                className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-transparent"
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">Où ? (Adresse/Quartier)</label>
              <input 
                type="text" 
                value={formData.adresse}
                placeholder="Ex: Médina, Rue 22 x 15" 
                className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-transparent"
                onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                required 
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-colors"
              >
                📍 Utiliser ma position actuelle
              </button>
              {formData.latitude && formData.longitude && (
                <p className="text-xs text-green-600 mt-1">
                  Position: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                </p>
              )}
            </div>
          </div>

          {/* Section 2 : Catégories et Priorité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie</label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                className="w-full px-7 py-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-black text-slate-700 outline-none appearance-none cursor-pointer"
              >
                  <option value="voirie">🛣️ Voirie / Routes</option>
                  <option value="eclairage">💡 Éclairage Public</option>
                  <option value="proprete">♻️ Propreté & Déchets</option>
                  <option value="eau">🚰 Eau & Assainissement</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Niveau d'urgence</label>
              <div className="flex gap-4">
                {['normale', 'haute'].map((p) => (
                  <button 
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priorite: p})}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all ${formData.priorite === p ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {p === 'haute' ? '🚨 Critique' : '⚖️ Standard'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3 : Preuve visuelle (Photos / Vidéos) */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Preuve visuelle (Photos / Vidéos)</label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple
                onChange={handleAttachmentsChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="w-full min-h-[14rem] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-blue-300">
                <span className="text-3xl text-slate-300">📷🎥</span>
                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Cliquez pour ajouter jusqu’à 6 photos ou vidéos</p>
                <p className="text-[11px] text-slate-500">Sélectionnez plusieurs fichiers en une seule fois.</p>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previews.map((file, index) => (
                  <div key={index} className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                    {file.type === 'video' ? (
                      <video src={file.url} controls className="h-36 w-full object-cover" />
                    ) : (
                      <img src={file.url} alt={`preview-${index}`} className="h-36 w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4 : Description */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Précisions supplémentaires</label>
            <textarea 
              rows="4" 
              value={formData.description}
              placeholder="Décrivez la situation en quelques mots..." 
              className="w-full px-7 py-6 bg-slate-50 rounded-[2rem] outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium resize-none border border-transparent"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-blue-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Envoi en cours...' : 'Envoyer le dossier'}
            <span className="text-2xl">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signalement;