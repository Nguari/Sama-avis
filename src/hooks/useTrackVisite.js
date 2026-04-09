// FRONTEND — useTrackVisite.js : Hook qui enregistre automatiquement une visite de page.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

// Pages à tracker avec leur label
const PAGES_LABELS = {
  '/':         'Accueil',
  '/login':    'Connexion',
  '/register': 'Inscription',
  '/suivi':    'Suivi',
  '/carte':    'Carte',
};

const useTrackVisite = () => {
  const location = useLocation();

  useEffect(() => {
    const label = PAGES_LABELS[location.pathname];
    if (!label) return; // Ne tracker que les pages définies
    api.post('/visites', { page: label }).catch(() => {});
  }, [location.pathname]);
};

export default useTrackVisite;
