// FRONTEND — NotFound.jsx : Page 404 affichée quand l'URL ne correspond à aucune route.
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6">

    {/* Icône animée */}
    <div className="text-8xl mb-4 animate-bounce-slow">🗺️</div>

    {/* Numéro 404 en grand */}
    <h1 className="text-[10rem] font-black text-slate-100 tracking-tighter leading-none select-none">404</h1>

    <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">Page introuvable</h2>
    <p className="text-slate-500 mt-3 font-medium max-w-md leading-relaxed">
      Cette page n'existe pas ou a été déplacée. Mais votre quartier, lui, a besoin de vous !
    </p>

    {/* Mini icônes thématiques */}
    <div className="mt-8 flex gap-6 text-center">
      <div className="bg-blue-50 rounded-2xl px-6 py-4">
        <p className="text-2xl font-black text-blue-600">📢</p>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Signalez</p>
      </div>
      <div className="bg-emerald-50 rounded-2xl px-6 py-4">
        <p className="text-2xl font-black text-emerald-600">✅</p>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Suivez</p>
      </div>
      <div className="bg-amber-50 rounded-2xl px-6 py-4">
        <p className="text-2xl font-black text-amber-600">🏛️</p>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Agissez</p>
      </div>
    </div>

    {/* Boutons de navigation */}
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Link to="/" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
        ← Retour à l'accueil
      </Link>
      <Link to="/signaler" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all">
        📢 Faire un signalement
      </Link>
    </div>

    {/* Slogan */}
    <p className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
      Le citoyen, acteur de la performance publique.
    </p>
  </div>
);

export default NotFound;
