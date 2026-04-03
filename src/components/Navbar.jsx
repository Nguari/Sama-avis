import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
          SAMA<span className="text-slate-900">AVIS</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <Link to="/carte" className="hover:text-blue-600 transition-colors">Carte</Link>
          <Link to="/suivi" className="hover:text-blue-600 transition-colors">Suivi</Link>
          <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
  Connexion
</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;