import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

export default function MapPicker({ onLocationSelect }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState(null);
  const [markerPos, setMarkerPos] = useState(null);
  const [locName, setLocName] = useState('');

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (e) => {
    const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(newPos);
  };

  const handleConfirm = () => {
    if (onLocationSelect) {
      onLocationSelect({ 
        location_name: locName || "Selected Location", 
        lat: markerPos ? markerPos.lat : 0, 
        lng: markerPos ? markerPos.lng : 0 
      });
    }
  };

  if (loadError) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error loading Google Maps API. Check your VITE_GOOGLE_MAPS_API_KEY in .env</div>;

  return (
    <div className="p-4 border border-[var(--border-color)] rounded-xl bg-slate-50 dark:bg-slate-800/30">
      <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)] font-semibold">
        <MapPin className="w-5 h-5 text-emerald-500" />
        Location Selection
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location Name / Details</label>
        <input 
          type="text" 
          value={locName}
          onChange={(e) => setLocName(e.target.value)}
          className="w-full p-2 rounded-lg border border-[var(--border-color)] bg-white dark:bg-slate-900 text-[var(--text-primary)] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          placeholder="e.g. Central Park Pavilion"
        />
      </div>

      <div className="mb-4 rounded-xl overflow-hidden border border-[var(--border-color)] relative bg-slate-200 dark:bg-slate-700 min-h-[300px] flex items-center justify-center">
        {!isLoaded ? (
          <span className="text-[var(--text-secondary)] animate-pulse">Loading Map...</span>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPos || defaultCenter}
            zoom={markerPos ? 15 : 10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={{ disableDefaultUI: false, zoomControl: true }}
          >
            {markerPos && <Marker position={markerPos} />}
          </GoogleMap>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-4 text-xs text-[var(--text-secondary)]">
        <span>{markerPos ? `Lat: ${markerPos.lat.toFixed(4)}, Lng: ${markerPos.lng.toFixed(4)}` : "Click on map to place pin"}</span>
      </div>

      <button 
        type="button" 
        onClick={handleConfirm}
        className="btn btn-primary w-full py-2 shadow-md shadow-emerald-500/20"
      >
        Confirm Location Data
      </button>
    </div>
  );
}
