// FRONTEND — ResetPassword.jsx : Page de saisie du nouveau mot de passe via le lien reçu par email.

import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const RULES = [
  { id: 'len',     label: 'Au moins 8 caractères',         test: p => p.length >= 8 },
  { id: 'upper',   label: 'Une lettre majuscule (A-Z)',     test: p => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'Une lettre minuscule (a-z)',     test: p => /[a-z]/.test(p) },
  { id: 'number',  label: 'Un chiffre (0-9)',               test: p => /[0-9]/.test(p) },
  { id: 'special', label: 'Un caractère spécial (!@#$...)', test: p => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (pwd) => {
  const passed = RULES.filter(r => r.test(pwd)).length;
  if (passed <= 1) return { score: passed, color: 'bg-red-500',     text: 'text-red-500',     label: 'Très faible' };
  if (passed <= 2) return { score: passed, color: 'bg-orange-500',  text: 'text-orange-500',  label: 'Faible' };
  if (passed <= 3) return { score: passed, color: 'bg-amber-500',   text: 'text-amber-500',   label: 'Moyen' };
  if (passed <= 4) return { score: passed, color: 'bg-blue-500',    text: 'text-blue-500',    label: 'Fort' };
  return                  { score: passed, color: 'bg-emerald-500', text: 'text-emerald-500', label: 'Très fort' };
};

const ResetPassword = () => {
  const [searchParams]          = useSearchParams();
  const token                   = searchParams.get('token');
  const navigate                = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const strength    = getStrength(password);
  const allRulesMet = RULES.every(r => r.test(password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!allRulesMet) return setError('Le mot de passe ne respecte pas tous les critères.');
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.');
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { token, mot_de_passe: password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Lien invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-5xl">❌</div>
        <p className="text-red-600 font-black text-xl">Lien invalide</p>
        <p className="text-slate-500 text-sm">Ce lien de réinitialisation est invalide ou a expiré.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-50">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Nouveau mot de passe</h2>
          <p className="text-slate-500 font-medium text-sm">Choisissez un mot de passe fort et sécurisé.</p>
        </div>

        {message ? (
          <div className="p-5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-sm font-bold text-center">
            ✅ {message} — Redirection...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold text-center">⚠ {error}</div>}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Nouveau mot de passe</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required placeholder="Créez un mot de passe sécurisé" value={password}
                  className={`w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 transition-all text-slate-900 border font-medium pr-14 ${
                    password && !allRulesMet ? 'border-amber-400 focus:ring-amber-100' :
                    password && allRulesMet  ? 'border-emerald-400 focus:ring-emerald-100' :
                    'border-transparent focus:ring-blue-100'
                  }`}
                  autoComplete="new-password" onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-lg">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {password && (
                <>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-slate-200'}`}></div>
                    ))}
                  </div>
                  <p className={`text-[10px] font-black ml-1 ${strength.text}`}>Sécurité : {strength.label}</p>
                  <div className="mt-3 bg-slate-50 rounded-2xl p-4 space-y-2">
                    {RULES.map(rule => {
                      const ok = rule.test(password);
                      return (
                        <div key={rule.id} className="flex items-center gap-2">
                          <span className={`text-sm ${ok ? 'text-emerald-500' : 'text-slate-300'}`}>{ok ? '✅' : '○'}</span>
                          <span className={`text-xs font-bold ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Confirmer</label>
              <input type={showPass ? 'text' : 'password'} required placeholder="Répétez le mot de passe" value={confirm}
                className={`w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 border font-medium ${
                  confirm && password !== confirm ? 'border-red-400 bg-red-50' :
                  confirm && password === confirm ? 'border-emerald-400' : 'border-transparent'
                }`}
                autoComplete="new-password" onChange={e => setConfirm(e.target.value)} />
              {confirm && password !== confirm && <p className="text-red-500 text-[10px] font-black ml-2">⚠ Les mots de passe ne correspondent pas</p>}
              {confirm && password === confirm  && <p className="text-emerald-500 text-[10px] font-black ml-2">✅ Les mots de passe correspondent</p>}
            </div>

            <button type="submit" disabled={loading || !allRulesMet}
              className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl hover:bg-blue-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Enregistrement...
                </span>
              ) : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
