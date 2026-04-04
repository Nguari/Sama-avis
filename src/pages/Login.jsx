import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [erreur, setErreur]         = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const response = await api.post('/auth/connexion', {
        email,
        mot_de_passe: password
      });

      // Sauvegarde le token et les infos utilisateur
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.utilisateur));

      // Redirige selon le rôle (admin → /admin, citoyen → /)
      navigate(response.data.redirect);
      window.location.reload();

    } catch (err) {
      setErreur('Email ou mot de passe incorrect');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Sama<span className="text-blue-600">Avis</span></h2>
          <p className="text-slate-500 font-medium">Content de vous revoir !</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="group">
            <input
              type="email"
              required
              placeholder="votre@email.com"
              className="w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-slate-900 border border-transparent font-medium"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="group">
            <input
              type="password"
              required
              placeholder="Mot de passe"
              className="w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-slate-900 border border-transparent font-medium"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {erreur && (
            <p className="text-red-500 text-sm font-medium text-center">{erreur}</p>
          )}
          
          <button
            type="submit"
            disabled={chargement}
            className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <Link to="/register" className="text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors tracking-wide uppercase">
            Créer un compte gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;