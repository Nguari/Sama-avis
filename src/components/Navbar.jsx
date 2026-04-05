import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Protection contre undefined/null/"undefined"/"null"
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' && userStr !== 'null'
    ? JSON.parse(userStr)
    : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">📢</span>
          <span className="text-2xl font-black text-blue-400 tracking-tighter italic">
            SAMA<span className="text-white">AVIS</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-300">
          <Link to="/" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]">Accueil</Link>
          
          {/* LIEN SUIVI : Toujours visible pour les citoyens */}
          <Link to="/suivi" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px] flex items-center gap-2">
            Suivi
          </Link>
          
          {/* LIEN CARTE : Réservé à l'Admin */}
          {user && user.role === 'admin' && (
            <Link to="/carte" className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]">Carte</Link>
          )}
          
          {user ? (
            <div className="flex items-center space-x-6 border-l border-slate-800 pl-6">
              {/* LIEN ADMIN : Si l'utilisateur est admin */}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-blue-400 border-b-2 border-blue-400 pb-1 uppercase tracking-widest text-[11px]">Panel Admin</Link>
              )}
              
              <button 
                onClick={handleLogout} 
                className="text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest text-[10px]"
              >
                Déconnexion
              </button>

              {/* AVATAR */}
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-300/30 font-black text-lg">
                  {user.nom ? user.nom.charAt(0).toUpperCase() : '?'}
                </div>
                {/* Petit point indicateur en ligne */}
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
              </div>
            </div>
          ) : (
            /* BOUTON CONNEXION : Si non connecté */
            <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 font-black uppercase tracking-widest text-[10px]">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
