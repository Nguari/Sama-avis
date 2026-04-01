import React, { useState } from 'react';

const Suivi = () => {
  const [searchId, setSearchId] = useState('');

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Suivre mon signalement</h2>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Entrez votre ID (ex: 123)" 
          className="flex-1 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Vérifier
        </button>
      </div>
    </div>
  );
};

export default Suivi;