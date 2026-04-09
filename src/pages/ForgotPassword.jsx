// FRONTEND — ForgotPassword.jsx : Page de réinitialisation du mot de passe (envoi du lien par email).

import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Erreur serveur. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">🔑</div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Mot de passe oublié</h2>
          <p className="text-slate-500 font-medium text-sm">Entrez votre email pour recevoir un lien de réinitialisation valable <strong>1 heure</strong>.</p>
        </div>

        <div className="relative z-10">
          {message ? (
            <div className={`p-5 rounded-2xl border text-sm font-bold text-center ${isError ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
              {isError ? '⚠ ' : '✅ '}{message}
              {!isError && <p className="text-xs font-medium mt-2 opacity-70">Vérifiez aussi vos spams.</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Adresse email</label>
                <input type="email" required placeholder="votre@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-slate-900 border border-transparent font-medium" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {loading ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Envoi...</> : '📧 Envoyer le lien'}
              </button>
            </form>
          )}
          <div className="mt-8 text-center">
            <Link to="/login" className="text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors uppercase tracking-wide">
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
