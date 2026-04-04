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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter italic">
          SAMA<span className="text-slate-900">AVIS</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <Link to="/carte" className="hover:text-blue-600 transition-colors">Carte</Link>
          
          {user ? (
            <div className="flex items-center space-x-5">
              {/* SEUL L'ADMIN VOIT CE LIEN */}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-blue-600 border-b-2 border-blue-600">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">Quitter</button>
              <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                {user.nom.charAt(0)}
              </div>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;