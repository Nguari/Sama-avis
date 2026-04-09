// FRONTEND — CreateAdmin.jsx : Formulaire de création d'un nouveau compte administrateur.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RULES = [
  { id: 'len',     label: 'Au moins 8 caractères',         test: p => p.length >= 8 },
  { id: 'upper',   label: 'Une majuscule (A-Z)',            test: p => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'Une minuscule (a-z)',            test: p => /[a-z]/.test(p) },
  { id: 'number',  label: 'Un chiffre (0-9)',               test: p => /[0-9]/.test(p) },
  { id: 'special', label: 'Un caractère spécial (!@#$...)', test: p => /[^A-Za-z0-9]/.test(p) },
];

const CreateAdmin = () => {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem('user');
  const user     = userStr && userStr !== 'undefined' && userStr !== 'null' ? JSON.parse(userStr) : null;

  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);

  const allRulesMet = RULES.every(r => r.test(formData.mot_de_passe));
  const set = f => e => setFormData(prev => ({ ...prev, [f]: e.target.value }));

  if (!user || user.role !== 'admin') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-5xl">🚫</div>
        <p className="text-2xl font-black text-red-600">Accès refusé</p>
        <p className="text-slate-500">Réservé aux administrateurs.</p>
      </div>
    </div>
  );

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!allRulesMet) { setMessage('Le mot de passe ne respecte pas les critères.'); return; }
    if (formData.mot_de_passe !== formData.confirmPassword) { setMessage('Les mots de passe ne correspondent pas.'); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/auth/inscription-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          nom: formData.nom, prenom: formData.prenom,
          email: formData.email, mot_de_passe: formData.mot_de_passe,
          adminSecret: import.meta.env.VITE_ADMIN_SECRET
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✓ Administrateur ajouté avec succès !');
        setFormData({ nom: '', prenom: '', email: '', mot_de_passe: '', confirmPassword: '' });
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setMessage(data.message || "Erreur lors de l'ajout.");
      }
    } catch {
      setMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-xl mx-auto">

        <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-950 to-slate-900 text-white p-10 mb-6 shadow-2xl">
          <button onClick={() => navigate('/admin')}
            className="mb-5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all">
            ← Retour
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">
            Gestion des Administrateurs
          </div>
          <h1 className="text-3xl font-black tracking-tight">Ajouter un Admin</h1>
          <p className="text-slate-400 mt-2 text-sm">Créez un accès administrateur sécurisé pour votre équipe.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 space-y-6">
          {message && (
            <div className={`p-4 rounded-2xl text-sm font-bold text-center ${message.includes('✓') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[['nom', 'Nom', 'Ex: Diallo'], ['prenom', 'Prénom', 'Ex: Moussa']].map(([f, l, p]) => (
                <div key={f} className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">{l}</label>
                  <input type="text" placeholder={p} value={formData[f]} required
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent font-bold text-sm"
                    onChange={set(f)} />
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Email</label>
              <input type="email" placeholder="admin@sama-avis.com" value={formData.email} required autoComplete="off"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent font-bold text-sm"
                onChange={set('email')} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Mot de passe</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Mot de passe sécurisé" value={formData.mot_de_passe} required
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent font-bold text-sm pr-12"
                  autoComplete="new-password" onChange={set('mot_de_passe')} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-lg">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {formData.mot_de_passe && (
                <div className="mt-2 bg-slate-50 rounded-xl p-3 space-y-1.5">
                  {RULES.map(r => {
                    const ok = r.test(formData.mot_de_passe);
                    return (
                      <div key={r.id} className="flex items-center gap-2">
                        <span className={`text-xs ${ok ? 'text-emerald-500' : 'text-slate-300'}`}>{ok ? '✅' : '○'}</span>
                        <span className={`text-xs font-bold ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>{r.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Confirmer</label>
              <input type={showPass ? 'text' : 'password'} placeholder="Répétez le mot de passe" value={formData.confirmPassword} required
                className={`w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border font-bold text-sm ${
                  formData.confirmPassword && formData.mot_de_passe !== formData.confirmPassword ? 'border-red-400 bg-red-50' : 'border-transparent'
                }`}
                autoComplete="new-password" onChange={set('confirmPassword')} />
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <span>⚠️</span>
              <p className="text-amber-700 text-xs font-medium">Cet admin aura accès complet au tableau de bord. Partagez les identifiants de façon sécurisée.</p>
            </div>

            <button type="submit" disabled={loading || !allRulesMet}
              className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Création...</>
                : "✓ Créer l'administrateur"
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
