import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signalement = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    titre:       '',
    categorie:   'voirie',
    adresse:     '',
    description: '',
    image:       null
  });

  const [preview, setPreview]         = useState(null);
  const [coords, setCoords]           = useState({ latitude: null, longitude: null });
  const [gpsStatut, setGpsStatut]     = useState('');
  const [chargement, setChargement]   = useState(false);
  const [erreur, setErreur]           = useState('');
  const [succes, setSucces]           = useState('');

  useEffect(() => {
    if (!user) { navigate('/register'); }
  }, [user, navigate]);

  // Capture automatique de la position GPS
  const capturerGPS = () => {
    setGpsStatut('Localisation en cours...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude:  position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGpsStatut('Position capturée ✓');
      },
      () => {
        setGpsStatut('Impossible de récupérer la position');
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces('');
    setChargement(true);

    try {
      // Utilise FormData pour envoyer image + données texte
      const data = new FormData();
      data.append('titre',       formData.titre);
      data.append('categorie',   formData.categorie);
      data.append('description', formData.description);
      data.append('adresse',     formData.adresse);

      if (coords.latitude)  data.append('latitude',  coords.latitude);
      if (coords.longitude) data.append('longitude', coords.longitude);
      if (formData.image)   data.append('photo',     formData.image);

      await api.post('/tickets', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSucces('Signalement envoyé avec succès !');
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      setErreur('Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setChargement(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl font-black rotate-12 select-none">DAKAR</div>
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Service Public</span>
            <h2 className="text-4xl font-black mt-4 mb-2 tracking-tight">Soumettre un incident</h2>
            <p className="text-slate-400 font-medium italic">
              {user.prenom || user.nom}, votre contribution améliore le quotidien de tous.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10">

          {/* Messages */}
          {erreur  && <div className="p-4 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 text-center uppercase tracking-wider">{erreur}</div>}
          {succes  && <div className="p-4 bg-green-50 text-green-600 text-xs font-black rounded-2xl border border-green-100 text-center uppercase tracking-wider">{succes}</div>}

          {/* Section 1 : Détails de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">Quoi ? (Titre)</label>
              <input
                type="text"
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
                placeholder="Ex: Médina, Rue 22 x 15"
                className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-transparent"
                onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Section 2 : Catégorie + GPS */}
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
                <option value="sante">❤️ Santé</option>
                <option value="autre">🔘 Autre</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Localisation GPS</label>
              <button
                type="button"
                onClick={capturerGPS}
                className="w-full px-7 py-5 bg-slate-50 rounded-2xl font-black text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent text-left"
              >
                📍 {gpsStatut || 'Capturer ma position'}
              </button>
            </div>
          </div>

          {/* Section 3 : Photo */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Preuve visuelle (Photo)</label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className={`w-full h-40 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${preview ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-blue-300'}`}>
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-[1.8rem] p-2" />
                ) : (
                  <>
                    <span className="text-3xl mb-2 text-slate-300">📷</span>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Cliquez pour ajouter une photo</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section 4 : Description */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Précisions supplémentaires</label>
            <textarea
              rows="4"
              placeholder="Décrivez la situation en quelques mots..."
              className="w-full px-7 py-6 bg-slate-50 rounded-[2rem] outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium resize-none border border-transparent"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={chargement}
            className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-blue-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chargement ? 'Envoi en cours...' : 'Envoyer le dossier'}
            {!chargement && <span className="text-2xl">→</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signalement;