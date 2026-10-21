import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Crosshair, X, Check, Loader2, Edit3, Globe, AlertCircle } from 'lucide-react';

interface MapLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAddress?: string;
  initialCity?: string;
  initialProvince?: string;
  initialCoordinates?: { lat: number; lng: number };
  onApplyLocation: (data: {
    address: string;
    streetNumber: string;
    city: string;
    province: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyABbDDr9alsQEuHu-L3wYis0Qf7PqxQb3Q';

// Default Milan coordinates if no GPS or previous coords
const DEFAULT_CENTER = { lat: 45.4642, lng: 9.19 };

export const MapLocationModal: React.FC<MapLocationModalProps> = ({
  isOpen,
  onClose,
  initialAddress = '',
  initialCity = '',
  initialProvince = '',
  initialCoordinates,
  onApplyLocation,
}) => {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>(
    initialCoordinates || DEFAULT_CENTER
  );
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    initialCoordinates || DEFAULT_CENTER
  );
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('hybrid');

  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Address parts suggested by reverse geocoding (user can edit them)
  const [suggestedRoute, setSuggestedRoute] = useState(initialAddress);
  const [suggestedStreetNumber, setSuggestedStreetNumber] = useState('');
  const [suggestedCity, setSuggestedCity] = useState(initialCity);
  const [suggestedProvince, setSuggestedProvince] = useState(initialProvince);
  const [formattedAddress, setFormattedAddress] = useState('');

  // Perform reverse geocoding via Google Maps Geocoding API REST with solution_id
  const performReverseGeocoding = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=it&key=${GOOGLE_MAPS_API_KEY}&solution_id=gmp_mcp_codeassist_v1_aistudio`;
      const res = await fetch(url);
      
      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        return;
      }
      
      const data = await res.json();
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const topResult = data.results[0];
        setFormattedAddress(topResult.formatted_address || '');

        let route = '';
        let streetNumber = '';
        let city = '';
        let province = '';

        for (const comp of topResult.address_components) {
          if (comp.types.includes('route')) {
            route = comp.long_name;
          } else if (comp.types.includes('street_number')) {
            streetNumber = comp.long_name;
          } else if (
            comp.types.includes('locality') ||
            comp.types.includes('administrative_area_level_3')
          ) {
            city = comp.long_name;
          } else if (comp.types.includes('administrative_area_level_2')) {
            province = comp.short_name;
          }
        }

        // If route was found, update fields
        if (route) {
          setSuggestedRoute(route);
        } else {
          // fallback to first part of formatted address
          setSuggestedRoute(topResult.formatted_address.split(',')[0] || '');
        }

        if (streetNumber) {
          setSuggestedStreetNumber(streetNumber);
        }

        if (city) {
          setSuggestedCity(city);
        }

        if (province) {
          setSuggestedProvince(province);
        }
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Locate user with GPS
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocalizzazione non supportata dal dispositivo.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newCoords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        setMarkerPosition(newCoords);
        setMapCenter(newCoords);
        performReverseGeocoding(newCoords.lat, newCoords.lng);
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Impossibile ottenere la posizione GPS.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Permesso GPS negato. Puoi comunque selezionare il fabbricato toccando la mappa.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Segnale GPS non disponibile. Tocca la mappa per posizionare il cantiere.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Tempo scaduto per il rilevamento GPS. Riprova o tocca la mappa.';
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [performReverseGeocoding]);

  // When modal opens: locate immediately or use initial coordinates
  useEffect(() => {
    if (isOpen) {
      if (initialCoordinates && initialCoordinates.lat && initialCoordinates.lng) {
        setMarkerPosition(initialCoordinates);
        setMapCenter(initialCoordinates);
        performReverseGeocoding(initialCoordinates.lat, initialCoordinates.lng);
      } else {
        handleLocateMe();
      }
    }
  }, [isOpen, initialCoordinates, handleLocateMe, performReverseGeocoding]);

  if (!isOpen) return null;

  // Handle marker drag end
  const handleMarkerDragEnd = (e: { latLng?: { lat: () => number; lng: () => number } | null }) => {
    if (e.latLng) {
      const lat = Number(e.latLng.lat().toFixed(6));
      const lng = Number(e.latLng.lng().toFixed(6));
      const newPos = { lat, lng };
      setMarkerPosition(newPos);
      performReverseGeocoding(lat, lng);
    }
  };

  // Handle map click to reposition marker
  const handleMapClick = (e: { detail: { latLng: { lat: number; lng: number } | null } }) => {
    if (e.detail.latLng) {
      const lat = Number(e.detail.latLng.lat.toFixed(6));
      const lng = Number(e.detail.latLng.lng.toFixed(6));
      const newPos = { lat, lng };
      setMarkerPosition(newPos);
      performReverseGeocoding(lat, lng);
    }
  };

  const handleApply = () => {
    // Combine route and street number for Italian address format
    const cleanStreet = suggestedRoute.trim();
    const cleanNum = suggestedStreetNumber.trim();
    const fullAddress = cleanNum ? `${cleanStreet}, ${cleanNum}` : cleanStreet;

    onApplyLocation({
      address: fullAddress,
      streetNumber: cleanNum,
      city: suggestedCity.trim(),
      province: suggestedProvince.trim().toUpperCase(),
      coordinates: markerPosition,
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Modal Top Header */}
        <div className="p-4 md:px-6 md:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900">
                Localizzazione Cantiere & Rilevamento Indirizzo
              </h3>
              <p className="text-[11px] text-slate-500">
                Google Maps GPS · Rileva posizione, correggi numero civico e applica all'APE
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Status Banner */}
        {gpsError && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{gpsError}</span>
            </div>
            <button
              type="button"
              onClick={handleLocateMe}
              className="px-2 py-1 bg-amber-200/80 hover:bg-amber-200 rounded font-semibold text-amber-900 text-[11px] shrink-0"
            >
              Riprova GPS
            </button>
          </div>
        )}

        {/* Center: Interactive Google Map */}
        <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-100">
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY} solutionChannel="gmp_mcp_codeassist_v1_aistudio">
            <Map
              defaultCenter={mapCenter}
              center={mapCenter}
              zoom={18}
              mapId="DEMO_MAP_ID"
              mapTypeId={mapType}
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              onClick={handleMapClick}
              style={{ width: '100%', height: '100%' }}
            >
              <AdvancedMarker
                position={markerPosition}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                title="Punto sopralluogo (trascina per centrare l'ingresso del fabbricato)"
              >
                <Pin
                  background="#4f46e5"
                  glyphColor="#ffffff"
                  borderColor="#312e81"
                  scale={1.2}
                />
              </AdvancedMarker>
            </Map>
          </APIProvider>

          {/* Floating Controls on Map: GPS Locate & Map Type Switch */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              title="Centra su posizione GPS attuale"
              className="min-h-[44px] min-w-[44px] px-3 py-2 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 flex items-center gap-2 text-xs font-semibold backdrop-blur-xs transition-all active:scale-95"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              ) : (
                <Crosshair className="w-4 h-4 text-indigo-600" />
              )}
              <span className="hidden sm:inline">GPS Attuale</span>
            </button>

            <div className="flex bg-white/95 rounded-xl shadow-md border border-slate-200 p-0.5 backdrop-blur-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setMapType('hybrid')}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                  mapType === 'hybrid'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satellite
              </button>
              <button
                type="button"
                onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                  mapType === 'roadmap'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mappa
              </button>
            </div>
          </div>

          {/* Hint Overlay at bottom of Map */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 pointer-events-none">
            <div className="bg-slate-900/85 text-white text-[11px] px-3 py-1.5 rounded-lg backdrop-blur-xs shadow-md inline-flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Tocca la mappa o trascina il cursore per allineare l'ingresso</span>
            </div>
          </div>
        </div>

        {/* Address and Geocode Suggestions Form */}
        <div className="p-4 md:p-5 bg-white border-t border-slate-200 space-y-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Dati Rilevati da Google Maps (Modificabili)
              </span>
            </div>
            {isGeocoding && (
              <span className="text-xs text-indigo-600 flex items-center gap-1 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Rilevamento indirizzo...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Indirizzo / Via */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Indirizzo suggerito (Via / Piazza / Corso) *
              </label>
              <input
                type="text"
                value={suggestedRoute}
                onChange={(e) => setSuggestedRoute(e.target.value)}
                placeholder="es. Via Dante Alighieri"
                className="w-full h-11 px-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Numero Civico */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                N° Civico (da verificare/correggere) *
              </label>
              <input
                type="text"
                value={suggestedStreetNumber}
                onChange={(e) => setSuggestedStreetNumber(e.target.value)}
                placeholder="es. 22 o 14/B"
                className="w-full h-11 px-3 text-sm font-mono font-bold bg-amber-50/70 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Comune & Provincia */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Comune
                </label>
                <input
                  type="text"
                  value={suggestedCity}
                  onChange={(e) => setSuggestedCity(e.target.value)}
                  placeholder="Milano"
                  className="w-full h-11 px-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
              <div className="w-16">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Prov.
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={suggestedProvince}
                  onChange={(e) => setSuggestedProvince(e.target.value.toUpperCase())}
                  placeholder="MI"
                  className="w-full h-11 px-2 text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-center"
                />
              </div>
            </div>
          </div>

          {/* Coordinate Display */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-mono">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Lat: <strong className="text-slate-800">{markerPosition.lat}</strong></span>
              <span className="text-slate-300">·</span>
              <span>Lng: <strong className="text-slate-800">{markerPosition.lng}</strong></span>
            </div>
            {formattedAddress && (
              <span className="text-[11px] text-slate-400 truncate max-w-md hidden md:inline">
                Google Maps: {formattedAddress}
              </span>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
          >
            Annulla
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="min-h-[44px] px-6 py-2 text-xs md:text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Conferma e Applica all'APE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
