import React from 'react';
// On commente les imports qui peuvent poser problème pour l'instant
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

const Carte = () => {
  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Carte des Signalements</h2>
      <div className="bg-slate-100 h-96 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">
          La carte interactive (Leaflet) s'affichera ici dès que les dépendances seront prêtes.
        </p>
      </div>
    </div>
  );
};

export default Carte;