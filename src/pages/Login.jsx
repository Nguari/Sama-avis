// FRONTEND — Login.jsx : Page de connexion. Redirige vers /admin ou / selon le rôle.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  // États du formulaire
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);   // Afficher/masquer le mot de passe
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation basique
    if (!email || !password) {
      setError('Veuillez saisir votre email et votre mot de passe.');
      return;
    }

    setLoading(true);
    try {
      // Appel API → stocke le token et l'utilisateur dans localStorage
      const data = await authService.login({ email, password });
      // Redirection selon le rôle (admin → /admin, citoyen → /)
      navigate(data.redirect || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-50 relative overflow-hidden">

        {/* Décoration de fond */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

        {/* En-tête */}
        <div className="text-center mb-12 relative z-10">
          <div className="text-5xl mb-4">📢</div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
            Sama<span className="text-blue-600">Avis</span>
          </h2>
          <p className="text-slate-500 font-medium">Content de vous revoir ! 👋</p>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">

          {/* Message d'erreur */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold text-center animate-fadeInDown">
              ⚠ {error}
            </div>
          )}

          {/* Champ Email */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Email</label>
            <input
              type="email"
              required
              placeholder="votre@email.com"
              value={email}
              className="w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-slate-900 border border-transparent font-medium"
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Champ Mot de passe avec bouton afficher/masquer */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Mot de passe</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Mot de passe"
                value={password}
                className="w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-slate-900 border border-transparent font-medium pr-14"
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors text-lg">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Bouton de connexion */}
          <button type="submit" disabled={loading}
            className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Connexion...
              </span>
            ) : 'Se connecter'}
          </button>
        </form>

        {/* Liens secondaires */}
        <div className="mt-10 pt-8 border-t border-slate-50 text-center space-y-3 relative z-10">
          <Link to="/forgot-password" className="block text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors tracking-wide uppercase">
            Mot de passe oublié ?
          </Link>
          <Link to="/register" className="block text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors tracking-wide uppercase">
            Créer un compte gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
