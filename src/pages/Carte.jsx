// FRONTEND — Carte.jsx : Carte interactive des signalements avec géocodage automatique des adresses.
// Carte.jsx — Carte interactive des signalements
// Affiche TOUS les signalements sur la carte :
// - Ceux avec GPS → position exacte
// - Ceux sans GPS → géocodage automatique de l'adresse via Nominatim (OpenStreetMap)
// - Ceux sans adresse ni GPS → position par défaut (centre de Dakar)

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ticketService } from '../services/api';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Icône par défaut Leaflet
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon, shadowUrl: markerShadow,
  iconSize: [25, 41], iconAnchor: [12, 41]
});

// Icônes colorées selon le statut du ticket
const getIconCouleur = (statut) => {
  const couleurs = {
    recu:     'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    assigne:  'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    en_cours: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    resolu:   'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  };
  return L.icon({
    iconUrl:    couleurs[statut] || markerIcon,
    shadowUrl:  markerShadow,
    iconSize:   [25, 41],
    iconAnchor: [12, 41],
  });
};

const CATEGORIES = [
  { key: 'tous',      label: 'Tous',      icon: '🗺️' },
  { key: 'voirie',    label: 'Voirie',    icon: '🛣️' },
  { key: 'eclairage', label: 'Éclairage', icon: '💡' },
  { key: 'proprete',  label: 'Propreté',  icon: '♻️' },
  { key: 'eau',       label: 'Eau',       icon: '🚰' },
  { key: 'sante',     label: 'Santé',     icon: '❤️' },
  { key: 'autre',     label: 'Autre',     icon: '🔘' },
];

const getStatusColor = (s) => ({
  recu:     'bg-yellow-100 text-yellow-700',
  assigne:  'bg-blue-100 text-blue-700',
  en_cours: 'bg-orange-100 text-orange-700',
  resolu:   'bg-green-100 text-green-700',
}[s] || 'bg-slate-100 text-slate-700');

// Géocoder une adresse via Nominatim (OpenStreetMap, gratuit)
const geocoderAdresse = async (adresse) => {
  try {
    const query = encodeURIComponent(`${adresse}, Dakar, Sénégal`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch { /* ignore */ }
  return null;
};

// Composant pour recentrer la carte sur Dakar
const RecenterCarte = ({ position }) => {
  const map = useMap();
  useEffect(() => { map.setView(position, 13); }, [map, position]);
  return null;
};

const Carte = () => {
  const positionDakar = [14.7167, -17.4677];

  const [tickets, setTickets]               = useState([]);
  const [ticketsAvecCoords, setTicketsAvecCoords] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [geocoding, setGeocoding]           = useState(false);
  const [error, setError]                   = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState('tous');
  const [filtreStatut, setFiltreStatut]       = useState('tous');
  const [showPanel, setShowPanel]             = useState(true);
  const geocacheRef = useRef({}); // Cache pour éviter de géocoder 2x la même adresse

  // Charger tous les tickets
  useEffect(() => {
    ticketService.getAllTickets()
      .then(data => setTickets(Array.isArray(data) ? data : []))
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  // Quand les tickets sont chargés, résoudre les coordonnées manquantes
  useEffect(() => {
    if (tickets.length === 0) return;

    const resoudreCoords = async () => {
      setGeocoding(true);
      const resultats = [];

      for (const ticket of tickets) {
        // Cas 1 : GPS disponible → utiliser directement
        if (ticket.latitude && ticket.longitude) {
          resultats.push({
            ...ticket,
            lat: parseFloat(ticket.latitude),
            lng: parseFloat(ticket.longitude),
            sourceCoords: 'gps'
          });
          continue;
        }

        // Cas 2 : Adresse disponible → géocoder
        if (ticket.adresse || ticket.description) {
          const adresse = ticket.adresse || ticket.description?.slice(0, 50);
          // Vérifier le cache avant d'appeler l'API
          if (geocacheRef.current[adresse]) {
            resultats.push({ ...ticket, ...geocacheRef.current[adresse], sourceCoords: 'adresse' });
            continue;
          }
          const coords = await geocoderAdresse(adresse);
          if (coords) {
            geocacheRef.current[adresse] = coords;
            resultats.push({ ...ticket, ...coords, sourceCoords: 'adresse' });
            continue;
          }
        }

        // Cas 3 : Aucune info → position par défaut (centre Dakar) avec léger décalage aléatoire
        resultats.push({
          ...ticket,
          lat: positionDakar[0] + (Math.random() - 0.5) * 0.05,
          lng: positionDakar[1] + (Math.random() - 0.5) * 0.05,
          sourceCoords: 'defaut'
        });
      }

      setTicketsAvecCoords(resultats);
      setGeocoding(false);
    };

    resoudreCoords();
  }, [tickets]);

  // Appliquer les filtres
  const ticketsFiltres = ticketsAvecCoords.filter(t => {
    const okCat    = filtreCategorie === 'tous' || t.categorie === filtreCategorie;
    const okStatut = filtreStatut === 'tous' || t.statut === filtreStatut;
    return okCat && okStatut;
  });

  return (
    <div className="h-[calc(100vh-80px)] min-h-[600px] w-full relative">

      {/* Panneau de contrôle */}
      <div className={`absolute top-4 left-4 z-[1000] transition-all duration-300 ${showPanel ? 'w-72' : 'w-auto'}`}>
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

          {/* En-tête du panneau */}
          <div className="p-4 flex justify-between items-center border-b border-slate-100">
            <div>
              <h2 className="font-black text-slate-900 text-sm">🗺️ Carte des Signalements</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Dakar, Sénégal</p>
            </div>
            <button onClick={() => setShowPanel(!showPanel)}
              className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all font-black text-xs">
              {showPanel ? '←' : '→'}
            </button>
          </div>

          {showPanel && (
            <div className="p-4 space-y-4">

              {/* Compteurs */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-2xl p-3">
                  <p className="text-lg font-black text-slate-900">{loading ? '...' : tickets.length}</p>
                  <p className="text-[9px] uppercase text-slate-400 font-black">Total</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-3">
                  <p className="text-lg font-black text-blue-600">
                    {loading ? '...' : tickets.filter(t => t.latitude && t.longitude).length}
                  </p>
                  <p className="text-[9px] uppercase text-slate-400 font-black">GPS</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-3">
                  <p className="text-lg font-black text-emerald-600">{ticketsFiltres.length}</p>
                  <p className="text-[9px] uppercase text-slate-400 font-black">Affichés</p>
                </div>
              </div>

              {/* Légende des couleurs */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Légende</p>
                <div className="space-y-1">
                  {[
                    { dot: '🟡', label: 'Reçu' },
                    { dot: '🔵', label: 'Assigné' },
                    { dot: '🟠', label: 'En cours' },
                    { dot: '🟢', label: 'Résolu' },
                  ].map(({ dot, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <span>{dot}</span> {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtre catégorie */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Catégorie</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setFiltreCategorie(key)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${filtreCategorie === key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre statut */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Statut</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: 'tous',     label: 'Tous',     dot: '⚪' },
                    { key: 'recu',     label: 'Reçu',     dot: '🟡' },
                    { key: 'en_cours', label: 'En cours', dot: '🟠' },
                    { key: 'resolu',   label: 'Résolu',   dot: '🟢' },
                  ].map(({ key, label, dot }) => (
                    <button key={key} onClick={() => setFiltreStatut(key)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filtreStatut === key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {dot} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages d'état */}
              {error    && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
              {loading  && <p className="text-xs text-blue-600 font-bold text-center animate-pulse">Chargement des signalements...</p>}
              {geocoding && <p className="text-xs text-amber-600 font-bold text-center animate-pulse">📍 Localisation des adresses...</p>}
            </div>
          )}
        </div>
      </div>

      {/* Carte Leaflet */}
      <MapContainer center={positionDakar} zoom={13} scrollWheelZoom className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Afficher un marqueur pour chaque ticket */}
        {ticketsFiltres.map(ticket => (
          <Marker
            key={ticket.id}
            position={[ticket.lat, ticket.lng]}
            icon={getIconCouleur(ticket.statut)}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                {/* Statut + catégorie */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(ticket.statut)}`}>
                    {ticket.statut?.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{ticket.categorie}</span>
                </div>

                {/* Titre */}
                <h3 className="font-bold text-slate-900 text-sm mb-1">{ticket.titre}</h3>

                {/* Description */}
                {ticket.description && (
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{ticket.description}</p>
                )}

                {/* Adresse si disponible */}
                {ticket.adresse && (
                  <p className="text-xs text-slate-500 mb-1">📍 {ticket.adresse}</p>
                )}

                {/* Date */}
                <p className="text-xs text-slate-400">
                  📅 {new Date(ticket.date_creation).toLocaleDateString('fr-FR')}
                </p>

                {/* Indicateur de source des coordonnées */}
                <p className="text-[9px] text-slate-300 mt-1 italic">
                  {ticket.sourceCoords === 'gps'     && '✅ Position GPS exacte'}
                  {ticket.sourceCoords === 'adresse' && '📍 Position estimée (adresse)'}
                  {ticket.sourceCoords === 'defaut'  && '⚠️ Position approximative'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Carte;
