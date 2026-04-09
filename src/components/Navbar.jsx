// FRONTEND — Navbar.jsx : Barre de navigation principale (liens, déconnexion, menu mobile).
// Navbar.jsx — Barre de navigation
// Affiche les liens selon le rôle (admin/citoyen/visiteur)
// Gère le menu hamburger sur mobile

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Récupérer l'utilisateur connecté depuis localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' && userStr !== 'null'
    ? JSON.parse(userStr) : null;

  // Déconnexion : vider le localStorage et aller à l'accueil
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" onClick={() => setMenuOuvert(false)} className="flex items-center gap-2">
          <span className="text-3xl">📢</span>
          <span className="text-2xl font-black text-blue-400 tracking-tighter italic">
            SAMA<span className="text-white">AVIS</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-300">
          <Link to="/"      className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]">Accueil</Link>
          <Link to="/suivi" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]">Suivi</Link>

          {/* Carte visible uniquement pour l'admin */}
          {user?.role === 'admin' && (
            <Link to="/carte" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]">Carte</Link>
          )}

          {user ? (
            <div className="flex items-center space-x-6 border-l border-slate-800 pl-6">
              {/* Panel Admin — admin seulement */}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-blue-400 border-b-2 border-blue-400 pb-1 uppercase tracking-widest text-[11px]">Panel Admin</Link>
              )}
              {/* Signaler — citoyen seulement */}
              {user.role !== 'admin' && (
                <Link to="/signaler" className="text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest text-[11px]">+ Signaler</Link>
              )}
              {/* Déconnexion */}
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest text-[10px]">
                Déconnexion
              </button>
              {/* Avatar avec initiale */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                  {user.nom?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
              </div>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all font-black uppercase tracking-widest text-[10px]">
              Connexion
            </Link>
          )}
        </div>

        {/* Bouton Hamburger mobile */}
        <button onClick={() => setMenuOuvert(!menuOuvert)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOuvert ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOuvert ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOuvert ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOuvert && (
        <div className="md:hidden mt-4 pb-4 border-t border-slate-800 space-y-1">
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-2xl flex items-center justify-center font-black">
                {user.nom?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-white font-black text-sm">{user.nom}</p>
                <p className="text-slate-400 text-xs">{user.email}</p>
              </div>
            </div>
          )}
          {[
            { to: '/',        label: '🏠 Accueil' },
            { to: '/suivi',   label: '📋 Suivi' },
            ...(user?.role !== 'admin' ? [{ to: '/signaler', label: '📢 Faire un signalement' }] : []),
            ...(user?.role === 'admin' ? [{ to: '/admin', label: '⚙️ Panel Admin' }, { to: '/carte', label: '🗺️ Carte' }] : []),
          ].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOuvert(false)}
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-bold text-sm transition-all">
              {label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOuvert(false); }}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl font-bold text-sm">
              🚪 Déconnexion
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOuvert(false)}
              className="block px-4 py-3 bg-blue-600 text-white rounded-xl font-black text-sm text-center mt-2">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
