export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-slate-950 to-black border-t border-slate-800 overflow-hidden">
      {/* Fond animé avec éléments flous */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Section À propos */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-black group-hover:scale-110 transition-transform">
                ✓
              </div>
              <h3 className="text-2xl font-black text-white">Sama-Avis</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plateforme de signalement et de suivi des incidents pour une meilleure qualité de vie dans nos villes.
            </p>
          </div>

          {/* Section Liens utiles */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Liens utiles</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-slate-400 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:translate-x-2 inline-block">→ Accueil</a></li>
              <li><a href="/signaler" className="text-slate-400 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:translate-x-2 inline-block">→ Signaler un problème</a></li>
              <li><a href="/carte" className="text-slate-400 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:translate-x-2 inline-block">→ Carte</a></li>
              <li><a href="/suivi" className="text-slate-400 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:translate-x-2 inline-block">→ Suivi</a></li>
            </ul>
          </div>

          {/* Section Contact */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-black mb-1">Email</p>
                <a href="mailto:contact@sama-avis.com" className="text-slate-300 hover:text-blue-400 transition-all text-sm font-medium hover:underline">contact@sama-avis.com</a>
              </li>
              <li>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-black mb-1">Téléphone</p>
                <a href="tel:+221774121502" className="text-slate-300 hover:text-blue-400 transition-all text-sm font-medium hover:underline">+221 77 412 15 02</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation animée */}
        <div className="border-t border-slate-800 pt-8 md:pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">
              &copy; {currentYear} Sama-Avis. Tous droits réservés.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-all text-sm font-medium group">
                <span className="relative">
                  Politique de confidentialité
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
                </span>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-all text-sm font-medium group">
                <span className="relative">
                  Conditions d'utilisation
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
