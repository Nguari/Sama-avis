import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setChargement(true);

    try {
      await authService.register({
        prenom:       formData.prenom,
        nom:          formData.nom,
        email:        formData.email,
        mot_de_passe: formData.password
      });

      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
            <span className="text-4xl -rotate-12">🇸🇳</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sama Avis</h2>
          <p className="text-slate-400 mt-2 font-semibold uppercase text-[10px] tracking-[0.3em]">Rejoignez le mouvement</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 text-center uppercase tracking-wider">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-xs font-black rounded-2xl border border-emerald-100 text-center uppercase tracking-wider">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-5 uppercase tracking-widest">Identité</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nom"
                value={formData.nom}
                required
                className="w-full px-6 py-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent"
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
              <input
                type="text"
                placeholder="Prénom"
                value={formData.prenom}
                required
                className="w-full px-6 py-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent"
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-5 uppercase tracking-widest">Contact</label>
            <input
              type="email"
              placeholder="Adresse mail"
              required
              className="w-full px-8 py-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all border border-transparent"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Pass"
              required
              className="w-full px-6 py-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <input
              type="password"
              placeholder="Confirmer"
              required
              className="w-full px-6 py-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={chargement}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chargement ? 'Inscription...' : 'Devenir Citoyen'}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-400 text-sm font-bold">
          Déjà inscrit ? <Link to="/login" className="text-blue-600 hover:underline underline-offset-8">Connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;