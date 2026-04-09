// FRONTEND — Footer.jsx : Pied de page (logo, navigation, contact, newsletter, réseaux sociaux).

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const annee = new Date().getFullYear();
  const [email, setEmail]     = useState('');
  const [inscrit, setInscrit] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) { setInscrit(true); setEmail(''); }
  };

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-slate-950 to-black border-t border-slate-800 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📢</span>
              <span className="text-2xl font-black text-blue-400 tracking-tighter italic">SAMA<span className="text-white">AVIS</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              <strong className="text-white">Le citoyen, acteur de la performance publique.</strong><br /><br />
              Plateforme digitale de redevabilité participative pour transformer la relation entre l'administration et les citoyens de Dakar.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Facebook', icon: '📘', href: '#' },
                { label: 'Twitter',  icon: '🐦', href: '#' },
                { label: 'WhatsApp', icon: '💬', href: '#' },
              ].map(({ label, icon, href }) => (
                <a key={label} href={href} title={label}
                  className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-black text-white mb-5 uppercase tracking-widest">Navigation</h3>
            <ul className="space-y-3">
              {[
                { to: '/',         label: 'Accueil' },
                { to: '/signaler', label: 'Signaler un problème' },
                { to: '/suivi',    label: 'Suivi de mes dossiers' },
                { to: '/carte',    label: 'Carte des signalements' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-blue-400 transition-all text-sm font-medium hover:translate-x-1 inline-block">
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-black text-white mb-5 uppercase tracking-widest">Contact</h3>
            <ul className="space-y-4">
              <li>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-black mb-1">Email</p>
                <a href="mailto:contact@sama-avis.com" className="text-slate-300 hover:text-blue-400 transition-all text-sm font-medium">contact@sama-avis.com</a>
              </li>
              <li>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-black mb-1">Téléphone</p>
                <a href="tel:+221774121502" className="text-slate-300 hover:text-blue-400 transition-all text-sm font-medium">+221 77 412 15 02</a>
              </li>
              <li>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-black mb-1">Adresse</p>
                <p className="text-slate-300 text-sm font-medium">Dakar, Sénégal 🇸🇳</p>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-black text-white mb-5 uppercase tracking-widest">Restez informé</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">Recevez les mises à jour sur les signalements de votre quartier.</p>
            {inscrit ? (
              <div className="p-4 bg-emerald-900/40 border border-emerald-700 rounded-2xl text-emerald-400 text-sm font-bold text-center">
                ✓ Merci pour votre inscription !
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-3">
                <input type="email" required placeholder="votre@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 outline-none focus:border-blue-500 transition-all" />
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                  S'abonner
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">&copy; {annee} Sama-Avis. Tous droits réservés. Fait avec ❤️ à Dakar.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-all text-xs font-medium">Politique de confidentialité</a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-all text-xs font-medium">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
