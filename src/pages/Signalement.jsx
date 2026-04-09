// FRONTEND — Signalement.jsx : Formulaire multi-étapes pour soumettre un signalement citoyen.
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = [
  { value: 'voirie',    label: 'Voirie / Routes',      icon: '🛣️', desc: 'Nids de poule, routes dégradées' },
  { value: 'eclairage', label: 'Éclairage Public',      icon: '💡', desc: 'Lampadaires défectueux' },
  { value: 'proprete',  label: 'Propreté & Déchets',    icon: '♻️', desc: 'Dépôts sauvages, ordures' },
  { value: 'eau',       label: 'Eau & Assainissement',  icon: '🚰', desc: 'Fuites, inondations' },
  { value: 'sante',     label: 'Santé & Sécurité',      icon: '❤️', desc: 'Risques sanitaires' },
  { value: 'autre',     label: 'Autre',                 icon: '🔘', desc: 'Tout autre problème' },
];

const ETAPES = ['Informations', 'Localisation', 'Preuves', 'Confirmation'];

const Signalement = () => {
  const navigate   = useNavigate();
  const userStr    = localStorage.getItem('user');
  const user       = userStr && userStr !== 'undefined' && userStr !== 'null' ? JSON.parse(userStr) : null;
  const isLoggedIn = useRef(!!user);
  const userRef    = useRef(user);

  const [etape, setEtape]     = useState(0);
  const [formData, setFormData] = useState({
    titre: '', categorie: 'voirie', priorite: 'normale',
    adresse: '', description: '', latitude: '', longitude: ''
  });
  const [attachments, setAttachments]     = useState([]);
  const [previews, setPreviews]           = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType]       = useState('');
  const [loading, setLoading]             = useState(false);
  const [gpsLoading, setGpsLoading]       = useState(false);
  const [errors, setErrors]               = useState({});

  useEffect(() => {
    if (!isLoggedIn.current) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    return () => previews.forEach(item => URL.revokeObjectURL(item.url));
  }, [previews]);

  const validate = (step) => {
    const e = {};
    if (step === 0) {
      if (!formData.titre.trim())               e.titre = 'Le titre est obligatoire';
      if (formData.titre.length > 100)          e.titre = 'Maximum 100 caractères';
      if (formData.description.length > 500)    e.description = 'Maximum 500 caractères';
    }
    if (step === 1) {
      if (!formData.adresse.trim()) e.adresse = "L'adresse est obligatoire";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextEtape = () => {
    if (validate(etape)) setEtape(e => e + 1);
  };

  const handleAttachmentsChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
      return validTypes.includes(f.type) && f.size <= 5 * 1024 * 1024;
    });
    const combined = [...attachments, ...newFiles].slice(0, 6);
    const newPreviews = combined.map(file => ({
      url:  URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name,
      size: (file.size / 1024).toFixed(0)
    }));
    setAttachments(combined);
    setPreviews(newPreviews);
  };

  const removeAttachment = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, adresse: 'Géolocalisation non supportée.' }));
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData(prev => ({
          ...prev,
          latitude:  coords.latitude.toString(),
          longitude: coords.longitude.toString()
        }));
        setGpsLoading(false);
      },
      () => {
        setErrors(prev => ({ ...prev, adresse: 'Erreur GPS — vérifiez vos permissions.' }));
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async () => {
    setStatusMessage('');
    setLoading(true);
    try {
      const data = new FormData();
      data.append('titre',       formData.titre.trim());
      data.append('categorie',   formData.categorie);
      data.append('adresse',     formData.adresse.trim());
      data.append('description', formData.description.trim());
      data.append('priorite',    formData.priorite);
      if (user?.id)           data.append('utilisateur_id', userRef.current.id);
      if (formData.latitude)  data.append('latitude',       formData.latitude);
      if (formData.longitude) data.append('longitude',      formData.longitude);
      attachments.forEach(file => data.append('photos', file));

      await api.post('/tickets', data, { headers: { 'Content-Type': 'multipart/form-data' } });

      setStatusMessage('✅ Signalement envoyé avec succès ! Redirection...');
      setStatusType('success');
      setLoading(false);
      setTimeout(() => navigate('/suivi', { replace: true }), 2000);
    } catch (err) {
      setStatusMessage(err.response?.data?.message || "Erreur lors de l'envoi.");
      setStatusType('error');
      setLoading(false);
    }
  };

  if (!userRef.current) return null;

  const categorieSelectionnee = CATEGORIES.find(c => c.value === formData.categorie);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black rotate-12 select-none">DAKAR</div>
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              🇸🇳 Service Public — Dakar
            </span>
            <h1 className="text-3xl md:text-4xl font-black mt-4 mb-2 tracking-tight">Soumettre un signalement</h1>
            <p className="text-slate-400 font-medium">
              Bonjour <span className="text-white font-black">{userRef.current?.nom?.split(' ')[0] || 'Citoyen'}</span>, votre contribution améliore le quotidien de tous. 🤝
            </p>
          </div>
          <div className="mt-6 relative z-10">
            <span className="typewriter inline-block text-xl md:text-2xl font-black text-blue-400 tracking-widest uppercase italic">
              Sa khalate sounou Yitè
            </span>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div className="bg-white rounded-[2rem] p-6 mb-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            {ETAPES.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    i < etape   ? 'bg-emerald-500 text-white' :
                    i === etape ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {i < etape ? '✓' : i + 1}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider hidden sm:block ${i === etape ? 'text-blue-600' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {i < ETAPES.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${i < etape ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">

          {statusMessage && (
            <div className={`mx-8 mt-8 rounded-2xl p-4 text-sm font-bold text-center ${statusType === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
              {statusMessage}
            </div>
          )}

          <div className="p-8 md:p-12 space-y-8">

            {/* ÉTAPE 0 — Informations */}
            {etape === 0 && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">1</div>
                  <h2 className="font-black text-slate-900 text-xl">Informations générales</h2>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Titre *</label>
                    <span className={`text-[10px] font-bold ${formData.titre.length > 90 ? 'text-red-500' : 'text-slate-400'}`}>{formData.titre.length}/100</span>
                  </div>
                  <input
                    type="text"
                    value={formData.titre}
                    maxLength={100}
                    placeholder="Ex: Nid de poule dangereux, Lampadaire cassé..."
                    className={`w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold border ${errors.titre ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                    onChange={e => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                  />
                  {errors.titre && <p className="text-red-500 text-xs font-bold ml-2">⚠ {errors.titre}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Catégorie *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CATEGORIES.map(cat => (
                      <button key={cat.value} type="button"
                        onClick={() => setFormData(prev => ({ ...prev, categorie: cat.value }))}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.categorie === cat.value ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
                      >
                        <div className="text-2xl mb-1">{cat.icon}</div>
                        <p className="font-black text-slate-800 text-xs">{cat.label}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Niveau d'urgence</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'normale', label: '⚖️ Standard', desc: 'Problème non urgent' },
                      { value: 'haute',   label: '🚨 Critique',  desc: 'Danger immédiat' },
                    ].map(p => (
                      <button key={p.value} type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priorite: p.value }))}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.priorite === p.value ? (p.value === 'haute' ? 'border-red-500 bg-red-50' : 'border-slate-900 bg-slate-900 text-white') : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
                      >
                        <p className="font-black text-sm">{p.label}</p>
                        <p className={`text-[10px] mt-1 ${formData.priorite === p.value && p.value === 'normale' ? 'text-slate-300' : 'text-slate-400'}`}>{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                    <span className={`text-[10px] font-bold ${formData.description.length > 450 ? 'text-red-500' : 'text-slate-400'}`}>{formData.description.length}/500</span>
                  </div>
                  <textarea rows="4" value={formData.description} maxLength={500}
                    placeholder="Décrivez précisément le problème : depuis quand, les risques potentiels..."
                    className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium resize-none border border-transparent"
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* ÉTAPE 1 — Localisation */}
            {etape === 1 && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">2</div>
                  <h2 className="font-black text-slate-900 text-xl">Localisation</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Adresse / Quartier *</label>
                  <input type="text" value={formData.adresse}
                    placeholder="Ex: Médina, Rue 22 x 15, près de la mosquée..."
                    className={`w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold border ${errors.adresse ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                    onChange={e => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                  />
                  {errors.adresse && <p className="text-red-500 text-xs font-bold ml-2">⚠ {errors.adresse}</p>}
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-800">📍 Géolocalisation GPS</p>
                      <p className="text-slate-500 text-xs mt-1">Optionnel mais recommandé</p>
                    </div>
                    <button type="button" onClick={handleGetCurrentLocation} disabled={gpsLoading}
                      className="px-5 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {gpsLoading
                        ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Localisation...</>
                        : '📍 Ma position'
                      }
                    </button>
                  </div>
                  {formData.latitude && formData.longitude ? (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-emerald-500 text-xl">✅</span>
                      <div>
                        <p className="text-emerald-700 font-black text-sm">Position enregistrée</p>
                        <p className="text-emerald-600 text-xs font-mono mt-0.5">
                          {parseFloat(formData.latitude).toFixed(5)}, {parseFloat(formData.longitude).toFixed(5)}
                        </p>
                      </div>
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, latitude: '', longitude: '' }))}
                        className="ml-auto text-slate-400 hover:text-red-500 font-black text-xs">✕</button>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs italic">Aucune position GPS enregistrée.</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                  <span className="text-2xl">ℹ️</span>
                  <div>
                    <p className="font-black text-blue-800 text-sm">Pourquoi la localisation est importante ?</p>
                    <p className="text-blue-600 text-xs mt-1 leading-relaxed">
                      Une adresse précise permet aux équipes d'intervention de trouver rapidement le problème. Le GPS est encore plus précis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 — Preuves */}
            {etape === 2 && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">3</div>
                  <h2 className="font-black text-slate-900 text-xl">Preuves visuelles</h2>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-black text-amber-800 text-sm">Conseil</p>
                    <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                      Les signalements avec photos sont traités <strong>3x plus vite</strong>. Max 5 MB par fichier (jpg, png, webp, mp4).
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Photos / Vidéos ({attachments.length}/6) — Optionnel
                  </label>
                  {attachments.length < 6 && (
                    <div className="relative group">
                      <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                        multiple onChange={handleAttachmentsChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                      <div className="w-full min-h-[8rem] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border-slate-200 bg-slate-50 group-hover:bg-blue-50 group-hover:border-blue-300">
                        <span className="text-4xl">📷</span>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Cliquez ou glissez vos fichiers ici</p>
                        <p className="text-[10px] text-slate-300 font-medium">JPG, PNG, WEBP, MP4 — Max 5 MB</p>
                      </div>
                    </div>
                  )}
                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {previews.map((file, index) => (
                        <div key={index} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm group">
                          {file.type === 'video'
                            ? <video src={file.url} controls className="h-32 w-full object-cover" />
                            : <img src={file.url} alt={`preview-${index}`} className="h-32 w-full object-cover" />
                          }
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                            <p className="text-white text-[9px] font-bold truncate">{file.name}</p>
                            <p className="text-slate-300 text-[9px]">{file.size} KB</p>
                          </div>
                          <button type="button" onClick={() => removeAttachment(index)}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ÉTAPE 3 — Confirmation */}
            {etape === 3 && (
              <div className="space-y-6 animate-fadeInUp">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">4</div>
                  <h2 className="font-black text-slate-900 text-xl">Confirmation</h2>
                </div>
                <p className="text-slate-500 font-medium text-sm">Vérifiez les informations avant d'envoyer.</p>
                <div className="space-y-3">
                  {[
                    { label: 'Titre',       value: formData.titre },
                    { label: 'Catégorie',   value: `${categorieSelectionnee?.icon} ${categorieSelectionnee?.label}` },
                    { label: 'Urgence',     value: formData.priorite === 'haute' ? '🚨 Critique' : '⚖️ Standard' },
                    { label: 'Adresse',     value: formData.adresse },
                    { label: 'GPS',         value: formData.latitude ? `${parseFloat(formData.latitude).toFixed(5)}, ${parseFloat(formData.longitude).toFixed(5)}` : 'Non renseigné' },
                    { label: 'Photos',      value: attachments.length > 0 ? `${attachments.length} fichier(s)` : 'Aucune' },
                    { label: 'Description', value: formData.description || 'Aucune description' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-24 shrink-0 pt-0.5">{label}</span>
                      <span className="font-bold text-slate-800 text-sm">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-3">
                  <span>🔒</span>
                  <p className="text-blue-700 text-xs font-medium leading-relaxed">
                    Votre signalement sera traité par les équipes municipales de Dakar. Suivez son évolution dans la section <strong>Suivi</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 pt-4 border-t border-slate-50">
              {etape > 0 && (
                <button type="button" onClick={() => setEtape(e => e - 1)}
                  className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all"
                >← Retour</button>
              )}
              {etape < ETAPES.length - 1 ? (
                <button type="button" onClick={nextEtape}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >Continuer →</button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading}
                  className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Envoi en cours...</>
                    : <>Envoyer le signalement 🚀</>
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signalement;
