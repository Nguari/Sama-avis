import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = [
  { value: 'voirie',    label: 'Voirie / Routes',     icon: '🛣️', desc: 'Nids de poule' },
  { value: 'eclairage', label: 'Éclairage Public',     icon: '💡', desc: 'Lampadaires défectueux' },
  { value: 'proprete',  label: 'Propreté & Déchets',   icon: '♻️', desc: 'Dépôts sauvages' },
  { value: 'eau',       label: 'Eau & Assainissement', icon: '🚰', desc: 'Fuites, inondations' },
  { value: 'sante',     label: 'Santé & Sécurité',     icon: '❤️', desc: 'Risques sanitaires' },
  { value: 'autre',     label: 'Autre',                icon: '🔘', desc: 'Autre problème' },
];

const ETAPES = ['Informations', 'Localisation', 'Preuves', 'Confirmation'];

const Signalement = () => {
  const navigate       = useNavigate();
  const isMounted      = useRef(true);
  const suggestionsRef = useRef(null);

  const [user, setUser]     = useState(null);
  const [etape, setEtape]   = useState(0);
  const [formData, setFormData] = useState({
    titre: '', categorie: 'voirie', priorite: 'normale',
    adresse: '', description: '', latitude: '', longitude: ''
  });
  const [attachments, setAttachments]               = useState([]);
  const [previewUrls, setPreviewUrls]               = useState([]);
  const [statusMessage, setStatusMessage]           = useState('');
  const [statusType, setStatusType]                 = useState('');
  const [loading, setLoading]                       = useState(false);
  const [gpsLoading, setGpsLoading]                 = useState(false);
  const [gpsStatut, setGpsStatut]                   = useState('');
  const [errors, setErrors]                         = useState({});
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions]       = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        setUser(JSON.parse(userStr));
      } else {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
    return () => {
      isMounted.current = false;
      previewUrls.forEach(url => { try { URL.revokeObjectURL(url); } catch(e) {} });
    };
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validate = (step) => {
    const e = {};
    if (step === 0) {
      if (!formData.titre.trim())            e.titre       = 'Le titre est obligatoire';
      if (formData.titre.length > 100)       e.titre       = 'Maximum 100 caractères';
      if (!formData.description.trim())      e.description = 'La description est obligatoire';
      if (formData.description.length > 500) e.description = 'Maximum 500 caractères';
    }
    if (step === 1) {
      if (!formData.adresse.trim()) e.adresse = "L'adresse est obligatoire";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextEtape = () => {
    if (validate(etape)) {
      setEtape(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevEtape = () => {
    setEtape(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAttachmentsChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
      return validTypes.includes(f.type) && f.size <= 5 * 1024 * 1024;
    }).slice(0, 6);
    previewUrls.forEach(url => { try { URL.revokeObjectURL(url); } catch(e) {} });
    setAttachments(validFiles);
    setPreviewUrls(validFiles.map(f => URL.createObjectURL(f)));
  };

  const removeAttachment = (index) => {
    try { URL.revokeObjectURL(previewUrls[index]); } catch(e) {}
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // GPS — enableHighAccuracy: false pour éviter le timeout
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatut('Géolocalisation non supportée par ce navigateur');
      return;
    }
    setGpsLoading(true);
    setGpsStatut('Localisation en cours...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMounted.current) return;
        setFormData(prev => ({
          ...prev,
          latitude:  position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setGpsLoading(false);
        setGpsStatut('');
        setStatusMessage('Position GPS enregistrée ✓');
        setStatusType('success');
        setTimeout(() => setStatusMessage(''), 3000);
      },
      (error) => {
        if (!isMounted.current) return;
        setGpsLoading(false);
        const msgs = {
          1: 'Permission refusée — autorisez la localisation dans Chrome',
          2: 'Position non disponible',
          3: 'Délai dépassé — réessayez'
        };
        setGpsStatut(msgs[error.code] || 'Erreur GPS');
      },
      // enableHighAccuracy: false = plus rapide, utilise WiFi/réseau
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  };

  const searchAddress = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Dakar')}&limit=5`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      if (res.ok) {
        const data = await res.json();
        setAddressSuggestions(data.map(item => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          address: item.display_name.split(',')[0]
        })));
        setShowSuggestions(true);
      }
    } catch {}
  }, []);

  const selectAddress = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      adresse:   suggestion.address,
      latitude:  suggestion.lat,
      longitude: suggestion.lon
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!validate(0) || !validate(1)) {
      setEtape(0);
      setStatusMessage('Veuillez remplir tous les champs obligatoires');
      setStatusType('error');
      return;
    }

    setLoading(true);
    setStatusMessage('');

    try {
      const data = new FormData();
      data.append('titre',       formData.titre.trim());
      data.append('categorie',   formData.categorie);
      data.append('adresse',     formData.adresse.trim());
      data.append('description', formData.description.trim());
      data.append('priorite',    formData.priorite);
      if (user?.id)           data.append('utilisateur_id', user.id);
      if (formData.latitude)  data.append('latitude',       formData.latitude);
      if (formData.longitude) data.append('longitude',      formData.longitude);
      attachments.forEach(file => data.append('photos', file));

      await api.post('/tickets', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });

      setStatusMessage('Signalement envoyé avec succès !');
      setStatusType('success');
      setTimeout(() => navigate('/suivi'), 2000);

    } catch (err) {
      let msg = "Erreur lors de l'envoi";
      if (err.response?.data?.message) msg = err.response.data.message;
      if (err.code === 'ECONNABORTED')  msg = "Délai dépassé, vérifiez votre connexion";
      setStatusMessage(msg);
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const categorieSelectionnee = CATEGORIES.find(c => c.value === formData.categorie);

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl font-black rotate-12 select-none">DAKAR</div>
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              Service Public
            </span>
            <h2 className="text-4xl font-black mt-4 mb-3 tracking-tight">Soumettre un incident</h2>
            <p className="text-slate-400 font-medium italic">
              Bonjour {user?.prenom || user?.nom?.split(' ')[0] || 'Citoyen'}, votre contribution améliore le quotidien de tous.
            </p>
          </div>
        </div>

        {/* Slogan */}
        <div className="px-12 pt-10 mb-2 animate-fadeInDown" style={{ animationDelay: '0.3s' }}>
          <span className="typewriter inline-block text-3xl md:text-5xl font-black text-blue-600 tracking-widest uppercase italic">
            Sa khalate sounou Yitè
          </span>
        </div>

        {/* Progress bar */}
        <div className="px-12 pt-6 pb-2">
          <div className="flex justify-between">
            {ETAPES.map((label, i) => (
              <div key={label} className="flex-1 text-center">
                <div className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm font-black transition-all ${
                  i < etape   ? 'bg-green-500 text-white' :
                  i === etape ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {i < etape ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-black mt-1 block uppercase tracking-widest ${
                  i === etape ? 'text-blue-600' : 'text-slate-400'
                }`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(etape / (ETAPES.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-12 pt-6 space-y-8">

          {/* Message statut */}
          {statusMessage && (
            <div className={`rounded-3xl p-4 text-sm font-bold text-center text-white ${
              statusType === 'error'   ? 'bg-red-500' :
              statusType === 'success' ? 'bg-green-500' : 'bg-slate-900'
            }`}>
              {statusMessage}
            </div>
          )}

          {/* ── ÉTAPE 0 : Informations ── */}
          {etape === 0 && (
            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800">Informations générales</h3>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">Titre *</label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={e => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                  className={`w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 font-bold border ${errors.titre ? 'border-red-400' : 'border-transparent'}`}
                  placeholder="Ex: Éclairage défectueux"
                />
                {errors.titre && <p className="text-red-500 text-xs ml-1">{errors.titre}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, categorie: cat.value }))}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        formData.categorie === cat.value
                          ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
                          : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <p className="font-black text-sm mt-1 text-slate-800">{cat.label}</p>
                      <p className="text-[10px] text-slate-400">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Niveau d'urgence</label>
                <div className="flex gap-4">
                  {['normale', 'haute'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priorite: p }))}
                      className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all ${
                        formData.priorite === p
                          ? p === 'haute' ? 'bg-red-500 text-white shadow-xl' : 'bg-slate-900 text-white shadow-xl'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {p === 'haute' ? '🚨 Critique' : '⚖️ Standard'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Description * <span className="text-slate-300 font-normal">{formData.description.length}/500</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-7 py-5 bg-slate-50 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 font-medium resize-none border ${errors.description ? 'border-red-400' : 'border-transparent'}`}
                  placeholder="Décrivez la situation en quelques mots..."
                />
                {errors.description && <p className="text-red-500 text-xs ml-1">{errors.description}</p>}
              </div>
            </div>
          )}

          {/* ── ÉTAPE 1 : Localisation ── */}
          {etape === 1 && (
            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800">Localisation</h3>

              <div className="space-y-3" ref={suggestionsRef}>
                <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">Adresse / Quartier *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.adresse}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, adresse: e.target.value }));
                      searchAddress(e.target.value);
                    }}
                    className={`w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 font-bold border ${errors.adresse ? 'border-red-400' : 'border-transparent'}`}
                    placeholder="Ex: Médina, Rue 22 x 15"
                  />
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-48 overflow-auto">
                      {addressSuggestions.map((s, i) => (
                        <button
                          key={`${s.lat}-${i}`}
                          type="button"
                          onClick={() => selectAddress(s)}
                          className="w-full text-left px-5 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition-colors"
                        >
                          <p className="text-sm font-bold text-slate-800">📍 {s.address}</p>
                          <p className="text-xs text-slate-400 truncate">{s.display_name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.adresse && <p className="text-red-500 text-xs ml-1">{errors.adresse}</p>}
              </div>

              <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-black text-slate-800">📍 Géolocalisation GPS</p>
                    <p className="text-xs text-slate-500 mt-1">Optionnel mais recommandé</p>
                    {gpsStatut && (
                      <p className={`text-xs mt-2 font-bold ${gpsStatut.includes('Permission') || gpsStatut.includes('Erreur') || gpsStatut.includes('Délai') ? 'text-red-500' : 'text-blue-500'}`}>
                        {gpsStatut}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={gpsLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {gpsLoading ? 'Localisation...' : '🎯 Ma position'}
                  </button>
                </div>

                {formData.latitude && formData.longitude && (
                  <div className="mt-4 p-3 bg-green-100 rounded-2xl">
                    <p className="text-sm font-black text-green-800">✓ Position enregistrée</p>
                    <p className="text-xs text-green-600 font-mono mt-1">
                      {parseFloat(formData.latitude).toFixed(6)}°, {parseFloat(formData.longitude).toFixed(6)}°
                    </p>
                  </div>
                )}

                {/* Instructions si permission refusée */}
                {gpsStatut.includes('Permission') && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <p className="text-xs font-bold text-yellow-800">Comment autoriser :</p>
                    <p className="text-xs text-yellow-700 mt-1">Cliquez sur le 🔒 cadenas dans la barre d'adresse → Localisation → Autoriser</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ÉTAPE 2 : Preuves ── */}
          {etape === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800">Preuves visuelles</h3>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <p className="text-sm font-medium text-amber-800">
                  💡 Les signalements avec photos sont traités 3x plus vite
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Photos / Vidéos ({attachments.length}/6)
                </label>

                {attachments.length < 6 && (
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleAttachmentsChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="w-full min-h-[10rem] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-blue-300">
                      <span className="text-3xl text-slate-300">📷🎥</span>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                        Cliquez pour ajouter jusqu'à 6 fichiers
                      </p>
                      <p className="text-[10px] text-slate-400">Max 5 MB par fichier · jpg, png, webp, mp4</p>
                    </div>
                  </div>
                )}

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={url} className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
                        {attachments[index]?.type?.startsWith('video/') ? (
                          <video src={url} controls className="w-full h-36 object-cover" />
                        ) : (
                          <img src={url} alt="preview" className="w-full h-36 object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ✕
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1">
                          <p className="text-white text-[10px] truncate">{attachments[index]?.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ÉTAPE 3 : Confirmation ── */}
          {etape === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800">Confirmation</h3>
              <p className="text-slate-500 text-sm">Vérifiez vos informations avant d'envoyer</p>

              <div className="space-y-2">
                {[
                  { label: 'Titre',       value: formData.titre },
                  { label: 'Catégorie',   value: `${categorieSelectionnee?.icon} ${categorieSelectionnee?.label}` },
                  { label: 'Urgence',     value: formData.priorite === 'haute' ? '🚨 Critique' : '⚖️ Standard' },
                  { label: 'Adresse',     value: formData.adresse },
                  { label: 'Description', value: formData.description },
                  { label: 'Fichiers',    value: `${attachments.length} fichier(s)` },
                  ...(formData.latitude ? [{
                    label: 'GPS',
                    value: `${parseFloat(formData.latitude).toFixed(6)}°, ${parseFloat(formData.longitude).toFixed(6)}°`
                  }] : [])
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                    <span className="w-28 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-0.5 flex-shrink-0">{label}</span>
                    <span className="flex-1 font-medium text-slate-800 text-sm">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-slate-50">
            {etape > 0 && (
              <button
                type="button"
                onClick={prevEtape}
                className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                ← Retour
              </button>
            )}

            {etape < ETAPES.length - 1 ? (
              <button
                type="button"
                onClick={nextEtape}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 transition-all shadow-lg shadow-blue-200"
              >
                Continuer →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : '📤 Envoyer le signalement'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signalement;