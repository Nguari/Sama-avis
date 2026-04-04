import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">📢</span>
          <span className="text-2xl font-black text-blue-400 tracking-tighter italic">
            SAMA<span className="text-white">AVIS</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-300">
          <Link to="/" className="hover:text-blue-400 transition-colors">Accueil</Link>
          
          {/* BOUTON CARTE (SEULEMENT POUR ADMIN) */}
          {user && user.role === 'admin' && (
            <Link to="/carte" className="hover:text-blue-400 transition-colors">Carte</Link>
          )}
          
          {user ? (
            <div className="flex items-center space-x-5">
              {/* SEUL L'ADMIN VOIT CE LIEN */}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-blue-400 border-b-2 border-blue-400">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">Déconnexion</button>
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-400">
                {user.nom.charAt(0)}
              </div>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all shadow-md shadow-blue-600">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;