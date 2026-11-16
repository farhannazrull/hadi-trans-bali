'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { getAddressFromCoords } from '../../utils/location';
import { useLanguage } from '../../context/LanguageContext';

// Fix for default marker icon issue in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map events and center logic
const MapEvents = ({ onMove, onMoveEnd }) => {
  const map = useMapEvents({
    move: () => {
      onMove(map.getCenter());
    },
    moveend: () => {
      onMoveEnd(map.getCenter());
    },
  });
  return null;
};

// Component to update map center
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const defaultCenter = { lat: -8.4095, lng: 115.1889 }; // Center of Bali (fallback)

const MapPickerModal = ({ isOpen, onClose, onConfirm, initialCoords }) => {
  const { language, tr } = useLanguage();

  const [center, setCenter] = useState(initialCoords || defaultCenter);
  const [tempCoords, setTempCoords] = useState(initialCoords || defaultCenter);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const fetchAddress = useCallback(async (coords) => {
    setLoading(true);
    try {
      const addr = await getAddressFromCoords(coords.lat, coords.lng);
      setAddress(addr || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-detect user location when modal opens
  useEffect(() => {
    if (isOpen) {
      // If initialCoords provided, use those
      if (initialCoords) {
        setTempCoords(initialCoords);
        setCenter(initialCoords);
        fetchAddress(initialCoords);
        return;
      }

      // Otherwise, try to get user's current GPS location
      setGpsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setTempCoords(userCoords);
            setCenter(userCoords);
            fetchAddress(userCoords);
            setGpsLoading(false);
          },
          (err) => {
            console.error('GPS error:', err);
            // Fallback to default if GPS fails
            setTempCoords(defaultCenter);
            setCenter(defaultCenter);
            fetchAddress(defaultCenter);
            setGpsLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      } else {
        // Fallback if geolocation not supported
        setTempCoords(defaultCenter);
        setCenter(defaultCenter);
        fetchAddress(defaultCenter);
        setGpsLoading(false);
      }
    }
  }, [isOpen, initialCoords, fetchAddress]);

  const handleMove = (newCenter) => {
    setTempCoords(newCenter);
  };

  const handleMoveEnd = (newCenter) => {
    fetchAddress(newCenter);
  };

  const handleConfirm = () => {
    onConfirm({
      coords: tempCoords,
      address: address
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-dark-green-950 rounded-2xl overflow-hidden shadow-lg flex flex-col h-[80vh] max-h-[700px]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-dark-green-800 bg-white dark:bg-dark-green-950 z-30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Fraunces, serif' }}>
                    {tr('Titik jemput', 'Pickup point')}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {tr('Geser peta untuk menentukan lokasi', 'Drag the map to choose a location')}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-green-800 rounded-full">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-gray-100">
              {gpsLoading ? (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-green-900">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1a4d3e] border-t-transparent mb-4"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {language === 'id' ? 'Mendeteksi lokasi Anda...' : 'Detecting your location...'}
                  </p>
                </div>
              ) : (
                <MapContainer center={center} zoom={15} className="h-full w-full outline-none" zoomControl={false}>
                  <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <ChangeView center={center} />
                  <MapEvents onMove={handleMove} onMoveEnd={handleMoveEnd} />
                </MapContainer>
              )}

              {/* Static Center Marker - positioned so pin tip points to exact center */}
              {!gpsLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
                  <div className="relative" style={{ transform: 'translateY(-50%)' }}>
                    <motion.div animate={{ y: loading ? [0, -10, 0] : 0 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <svg className="w-10 h-10 text-[#c4935f]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </motion.div>
                    <div className="w-4 h-1.5 bg-black/20 rounded-full blur-[2px] mx-auto" />
                  </div>
                </div>
              )}

              {/* Current Location Button */}
              {!gpsLoading && (
                <button
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                      setCenter(userCoords);
                      fetchAddress(userCoords);
                    });
                  }}
                  className="absolute bottom-6 right-6 z-[1000] p-3 bg-white dark:bg-dark-green-900 rounded-full shadow-lg border border-gray-100 dark:border-dark-green-800 text-[#1a4d3e] dark:text-[#4ade80] transition-transform"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="12" r="3" strokeWidth={2} /></svg>
                </button>
              )}
            </div>

            {/* Bottom Info & Confirm */}
            <div className="p-6 bg-white dark:bg-dark-green-950 border-t border-gray-100 dark:border-dark-green-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#f3ede6] dark:bg-dark-green-800 flex items-center justify-center flex-shrink-0 text-[#1a4d3e] dark:text-[#4ade80]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#c4935f] mb-1">{tr('Alamat terdeteksi', 'Detected address')}</p>
                  {loading ? (
                    <div className="space-y-2"><div className="h-4 bg-gray-100 dark:bg-dark-green-800 rounded animate-pulse w-3/4" /><div className="h-4 bg-gray-100 dark:bg-dark-green-800 rounded animate-pulse w-1/2" /></div>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2 leading-relaxed">{address || (language === 'id' ? 'Mencari alamat...' : 'Searching address...')}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={loading || !address}
                className="btn-3d btn-3d-green-adaptive w-full py-4 text-white dark:text-gray-900 rounded-xl font-medium text-sm"
              >
                {language === 'id' ? 'Konfirmasi Lokasi' : 'Confirm Location'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MapPickerModal;
