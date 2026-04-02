import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900">Créer un compte</h2>
          <p className="text-slate-500 mt-2 font-medium">Rejoignez la communauté Sama Avis</p>
        </div>

        <form className="space-y-5">
          <input type="text" placeholder="Nom complet" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
          <input type="email" placeholder="Email" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
          <input type="password" placeholder="Mot de passe" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
          
          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-lg shadow-blue-200">
            S'inscrire
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600 text-sm font-medium">
          Déjà un compte ? <Link to="/login" className="text-blue-600 font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;