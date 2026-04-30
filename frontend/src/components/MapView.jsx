import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '250px',
  borderRadius: '0.75rem'
};

export default function MapView({ locationName, lat, lng }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  if (loadError) return <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-xl text-center text-sm">Error loading map API. Check your VITE_GOOGLE_MAPS_API_KEY.</div>;
  
  const hasCoords = lat !== undefined && lng !== undefined && lat !== 0 && lng !== 0;
  const center = hasCoords ? { lat, lng } : { lat: 40.7128, lng: -74.0060 };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-[var(--border-color)] bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center min-h-[250px] shadow-inner relative">
      {!hasCoords ? (
        <div className="p-6 text-center z-10 relative flex flex-col items-center">
          <MapPin className="w-12 h-12 text-emerald-500 mb-3 drop-shadow-lg" />
          <h4 className="font-bold text-lg text-[var(--text-primary)] mb-1">{locationName || "Location details"}</h4>
          <p className="text-sm text-[var(--text-secondary)]">Coordinates not provided by NGO</p>
        </div>
      ) : (
        <div className="w-full h-full min-h-[250px] relative">
          <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-[var(--border-color)] shadow-lg max-w-[80%]">
            <h4 className="font-bold text-sm text-[var(--text-primary)] break-words">{locationName || "Event Location"}</h4>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1">{lat.toFixed(4)}, {lng.toFixed(4)}</p>
          </div>
          {!isLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
               <span className="text-[var(--text-secondary)] animate-pulse">Loading Map...</span>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={14}
              options={{ disableDefaultUI: true, zoomControl: true }}
            >
              <Marker position={center} />
            </GoogleMap>
          )}
        </div>
      )}
    </div>
  );
}
