// FRONTEND — Register.jsx : Page d'inscription avec validation et indicateur de force du mot de passe.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const RULES = [
  { id: 'len',     label: 'Au moins 8 caractères',         test: p => p.length >= 8 },
  { id: 'upper',   label: 'Une lettre majuscule (A-Z)',     test: p => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'Une lettre minuscule (a-z)',     test: p => /[a-z]/.test(p) },
  { id: 'number',  label: 'Un chiffre (0-9)',               test: p => /[0-9]/.test(p) },
  { id: 'special', label: 'Un caractère spécial (!@#$...)', test: p => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (pwd) => {
  const passed = RULES.filter(r => r.test(pwd)).length;
  if (passed <= 1) return { score: passed, label: 'Très faible', color: 'bg-red-500',    text: 'text-red-500' };
  if (passed <= 2) return { score: passed, label: 'Faible',      color: 'bg-orange-500', text: 'text-orange-500' };
  if (passed <= 3) return { score: passed, label: 'Moyen',       color: 'bg-amber-500',  text: 'text-amber-500' };
  if (passed <= 4) return { score: passed, label: 'Fort',        color: 'bg-blue-500',   text: 'text-blue-500' };
  return                  { score: passed, label: 'Très fort',   color: 'bg-emerald-500', text: 'text-emerald-500' };
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData]     = useState({ nom: '', prenom: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass]     = useState(false);
  const [showRules, setShowRules]   = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [chargement, setChargement] = useState(false);

  const strength    = getStrength(formData.password);
  const allRulesMet = RULES.every(r => r.test(formData.password));
  const set = field => e => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.nom.trim() || !formData.prenom.trim()) { setError('Veuillez renseigner votre nom et prénom.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Adresse email invalide.'); return; }
    if (!allRulesMet) { setError('Le mot de passe ne respecte pas tous les critères de sécurité.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }

    setChargement(true);
    try {
      await authService.register({
        prenom: formData.prenom.trim(), nom: formData.nom.trim(),
        email: formData.email.trim().toLowerCase(), mot_de_passe: formData.password
      });
      setSuccess('Inscription réussie ! Redirection vers la connexion...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-200">
            <span className="text-4xl -rotate-12">🇸🇳</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sama Avis</h2>
          <p className="text-slate-400 mt-2 font-semibold uppercase text-[10px] tracking-[0.3em]">Rejoignez le mouvement citoyen</p>
        </div>

        {error   && <div className="mb-5 p-4 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 text-center">⚠ {error}</div>}
        {success && <div className="mb-5 p-4 bg-emerald-50 text-emerald-700 text-xs font-black rounded-2xl border border-emerald-100 text-center">✅ {success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Identité</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Nom" value={formData.nom} required
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent font-bold text-sm"
                onChange={set('nom')} />
              <input type="text" placeholder="Prénom" value={formData.prenom} required
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent font-bold text-sm"
                onChange={set('prenom')} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Email</label>
            <input type="email" placeholder="votre@email.com" required autoComplete="off"
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent font-bold text-sm"
              onChange={set('email')} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Mot de passe</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Créez un mot de passe sécurisé" required
                className={`w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 transition-all border font-bold text-sm pr-12 ${
                  formData.password && !allRulesMet ? 'border-amber-400 focus:ring-amber-400' :
                  formData.password && allRulesMet  ? 'border-emerald-400 focus:ring-emerald-400' :
                  'border-transparent focus:ring-blue-600'
                }`}
                autoComplete="new-password"
                onFocus={() => setShowRules(true)}
                onChange={set('password')} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-lg">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.password && (
              <>
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-200'}`}></div>
                  ))}
                </div>
                <p className={`text-[10px] font-black ml-1 ${strength.text}`}>Sécurité : {strength.label}</p>
              </>
            )}
            {(showRules || formData.password) && (
              <div className="mt-3 bg-slate-50 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Critères requis :</p>
                {RULES.map(rule => {
                  const ok = rule.test(formData.password);
                  return (
                    <div key={rule.id} className="flex items-center gap-2">
                      <span className={`text-sm ${ok ? 'text-emerald-500' : 'text-slate-300'}`}>{ok ? '✅' : '○'}</span>
                      <span className={`text-xs font-bold ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>{rule.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Confirmer le mot de passe</label>
            <input type={showPass ? 'text' : 'password'} placeholder="Répétez le mot de passe" required
              className={`w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border font-bold text-sm ${
                formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-400 bg-red-50' :
                formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-emerald-400' : 'border-transparent'
              }`}
              autoComplete="new-password" onChange={set('confirmPassword')} />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && <p className="text-red-500 text-[10px] font-black ml-2">⚠ Les mots de passe ne correspondent pas</p>}
            {formData.confirmPassword && formData.password === formData.confirmPassword  && <p className="text-emerald-500 text-[10px] font-black ml-2">✅ Les mots de passe correspondent</p>}
          </div>

          <button type="submit" disabled={chargement || !allRulesMet}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {chargement ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Inscription...
              </span>
            ) : 'Devenir Citoyen 🇸🇳'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm font-bold">
          Déjà inscrit ? <Link to="/login" className="text-blue-600 hover:underline underline-offset-4">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
