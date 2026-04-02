import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction pour l'icône par défaut qui disparait parfois avec Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Carte = () => {
  // Coordonnées de Dakar
  const positionDakar = [14.7167, -17.4677];

  return (
    <div className="h-[calc(100-80px)] min-h-[600px] w-full relative">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 text-center">
          <h2 className="font-black text-slate-900">Carte des Signalements</h2>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Dakar, Sénégal</p>
        </div>
      </div>

      <MapContainer 
        center={positionDakar} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Exemple de marqueur pour le test */}
        <Marker position={positionDakar}>
          <Popup className="rounded-xl overflow-hidden">
            <div className="p-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Voirie</span>
              <h3 className="font-bold text-slate-900 mt-2">Nid de poule détecté</h3>
              <p className="text-sm text-slate-500">Signalé il y a 2 heures</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Carte;