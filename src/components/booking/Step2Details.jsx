'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurrentLocation } from '../../utils/location';

// Leaflet touches `window` on import, so the map is loaded on the client only.
const MapPickerModal = dynamic(() => import('./MapPickerModal'), { ssr: false });

const popularLocations = [
  'Ngurah Rai Airport (DPS)',
  'Seminyak',
  'Kuta',
  'Ubud',
  'Canggu',
  'Sanur',
  'Nusa Dua',
  'Jimbaran',
  'Uluwatu',
  'Kintamani',
];

const Step2Details = () => {
  const { bookingData, updateBooking, nextStep, prevStep } = useBooking();
  const { language, t, tr } = useLanguage();
  const isAirportTransfer = bookingData.serviceType === 'airport-transfer';
  const [isDetecting, setIsDetecting] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isManual, setIsManual] = useState(false);

  // Refs for triggering pickers
  const pickupDateRef = useRef(null);
  const pickupTimeRef = useRef(null);
  const returnDateRef = useRef(null);
  const returnTimeRef = useRef(null);

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      const loc = await getCurrentLocation();
      updateBooking({ 
        pickupLocation: loc.address,
        pickupCoords: { lat: loc.latitude, lng: loc.longitude }
      });
      setIsManual(false); // Reset to non-manual when auto-detected
    } catch (err) {
      console.error('Location error:', err.message);
      alert(language === 'id' ? 'Gagal mendeteksi lokasi. Pastikan izin GPS aktif.' : 'Failed to detect location. Please check GPS permissions.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleMapConfirm = ({ coords, address }) => {
    updateBooking({
      pickupLocation: address,
      pickupCoords: { lat: coords.lat, lng: coords.lng }
    });
    setIsManual(false); // Always non-manual when confirmed from map
  };

  const handleInputClick = () => {
    if (!isManual) {
      setIsMapOpen(true);
    }
  };

  const triggerPicker = (ref) => {
    if (!ref.current) return;
    ref.current.focus();
    try {
      ref.current.showPicker();
    } catch {
      ref.current.click();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBooking({ [name]: value });
  };

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const canProceed = bookingData.pickupDate && bookingData.pickupTime && 
    bookingData.pickupLocation && 
    (bookingData.serviceType !== 'airport-transfer' || bookingData.dropoffLocation);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
          {t('booking.tripDetails')} <span className="text-[#c4935f]">{t('booking.trip')}</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">{t('booking.tellUsWhenWhere')}</p>
      </div>

      {/* Airport Transfer - Trip Type */}
      {isAirportTransfer && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('booking.tripType')}</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'one-way', label: t('booking.oneWay'), icon: 'arrow-right' },
              { id: 'round-trip', label: t('booking.roundTrip'), icon: 'arrows-exchange' }
            ].map((type) => {
              const icons = {
                'arrow-right': (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                ),
                'arrows-exchange': (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                ),
              };
              return (
                <button
                  key={type.id}
                  onClick={() => updateBooking({ tripType: type.id })}
                  className={`p-4 rounded-xl border text-center transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 bookingData.tripType === type.id
 ? 'border-[#1a4d3e] bg-[#1a4d3e]/5 dark:border-[#4ade80] dark:bg-[#4ade80]/10'
 : 'border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 hover:border-[#c4935f]'
 }`}
                >
                  <span className={`block mb-2 flex justify-center ${bookingData.tripType === type.id ? 'text-[#1a4d3e] dark:text-[#4ade80]' : 'text-gray-500 dark:text-gray-400'}`}>
                    {icons[type.icon]}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pickup Location */}
      <div className="space-y-3">
        <label htmlFor="pickup-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
          {isAirportTransfer ? t('booking.pickupLocation') : t('booking.wherePickup')}
        </label>
        <div className="relative group">
          <input
            id="pickup-location"
            type="text"
            name="pickupLocation"
            value={bookingData.pickupLocation}
            onChange={handleChange}
            onClick={handleInputClick}
            readOnly={!isManual}
            placeholder={t('booking.hotelNameAddress')}
            className={`w-full pl-4 pr-24 sm:pr-48 py-3.5 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-gray-900 dark:text-white focus:border-[#1a4d3e] dark:focus:border-[#4ade80] focus:ring-0 outline-none transition-[color,background-color,border-color,opacity,transform,box-shadow] placeholder-gray-400 dark:placeholder-gray-500 shadow-sm ${!isManual ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-green-800' : ''}`}
            list="pickup-locations"
          />
          <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              title={language === 'id' ? 'Deteksi Lokasi GPS' : 'Auto Detect GPS'}
              className={`h-full flex items-center justify-center w-10 rounded-lg transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 isDetecting 
 ? 'bg-gray-100 text-gray-400' 
 : 'bg-[#f3ede6] dark:bg-dark-green-800 text-[#1a4d3e] dark:text-[#4ade80] hover:bg-[#1a4d3e] hover:text-white dark:hover:bg-[#4ade80] dark:hover:text-gray-900'
 }`}
            >
              {isDetecting ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="btn-3d btn-3d-green h-full flex items-center gap-2 px-2.5 sm:px-3 text-white rounded-lg font-semibold text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="hidden sm:inline">{tr('Peta', 'Map')}</span>
            </button>
          </div>
        </div>

        {/* Manual Toggle */}
        <div className="flex justify-between items-center px-1">
          <button
            type="button"
            onClick={() => setIsManual(!isManual)}
            className="text-xs font-semibold text-gray-400 hover:text-[#c4935f] transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isManual 
              ? (language === 'id' ? 'Gunakan Peta Kembali' : 'Use Map instead') 
              : (language === 'id' ? 'Ketik Alamat Manual' : 'Type address manually')}
          </button>
          
          {!isManual && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {tr('Klik kolom untuk membuka peta', 'Click the field to open the map')}
            </span>
          )}
        </div>
        
        {/* GPS Verification Badge */}
        {bookingData.pickupCoords && !isManual && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#1a4d3e] dark:text-[#4ade80] bg-[#1a4d3e]/5 dark:bg-[#4ade80]/10 px-3 py-1.5 rounded-lg w-fit border border-[#1a4d3e]/10"
          >
            <span className="inline-flex rounded-full h-2 w-2 bg-[#1a4d3e] dark:bg-[#4ade80]"></span>
            {tr('Titik GPS tersimpan', 'GPS point saved')}
            <button 
              type="button"
              onClick={() => window.open(`https://www.google.com/maps?q=${bookingData.pickupCoords.lat},${bookingData.pickupCoords.lng}`, '_blank')}
              className="ml-2 underline hover:no-underline"
            >
              {tr('Lihat di peta', 'View on map')}
            </button>
          </motion.div>
        )}

        <datalist id="pickup-locations">
          {popularLocations.map((loc) => (
            <option key={loc} value={loc} />
          ))}
        </datalist>
        <div className="flex flex-wrap gap-2">
          {popularLocations.slice(0, 5).map((loc) => (
            <button
              key={loc}
              onClick={() => updateBooking({ pickupLocation: loc })}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-dark-green-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-[#f3ede6] dark:hover:bg-slate-600 transition-colors"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <MapPickerModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onConfirm={handleMapConfirm}
        initialCoords={bookingData.pickupCoords}
      />

      {/* Dropoff Location (for airport transfer) */}
      {isAirportTransfer && (
        <div className="space-y-3">
          <label htmlFor="dropoff-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('booking.dropoffLocation')}</label>
          <input
            id="dropoff-location"
            type="text"
            name="dropoffLocation"
            value={bookingData.dropoffLocation}
            onChange={handleChange}
            placeholder={t('booking.hotelNameAddress')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-gray-900 dark:text-white focus:border-[#1a4d3e] dark:focus:border-[#4ade80] focus:ring-0 outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
            list="dropoff-locations"
          />
          <datalist id="dropoff-locations">
            {popularLocations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>
      )}

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('booking.pickupDate')}</label>
          <div
            className="group w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 focus-within:border-[#1a4d3e] dark:focus-within:border-[#4ade80] transition-colors cursor-pointer flex items-center justify-between overflow-hidden"
            onClick={() => triggerPicker(pickupDateRef)}
          >
            <input
              id="pickup-date"
              ref={pickupDateRef}
              type="date"
              name="pickupDate"
              value={bookingData.pickupDate}
              onChange={handleChange}
              onClick={(e) => e.stopPropagation()}
              min={getTomorrow()}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-gray-900 dark:text-white cursor-pointer z-10 transition-colors"
            />
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#1a4d3e] dark:group-hover:text-[#4ade80] transition-colors pointer-events-none ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('booking.pickupTime')}</label>
          <div
            className="group w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 focus-within:border-[#1a4d3e] dark:focus-within:border-[#4ade80] transition-colors cursor-pointer flex items-center justify-between overflow-hidden"
            onClick={() => triggerPicker(pickupTimeRef)}
          >
            <input
              id="pickup-time"
              ref={pickupTimeRef}
              type="time"
              name="pickupTime"
              value={bookingData.pickupTime}
              onChange={handleChange}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-gray-900 dark:text-white cursor-pointer z-10 transition-colors"
            />
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#1a4d3e] dark:group-hover:text-[#4ade80] transition-colors pointer-events-none ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Return Date & Time (for round-trip airport transfer) */}
      {isAirportTransfer && bookingData.tripType === 'round-trip' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label htmlFor="return-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('booking.returnDate')}</label>
            <div
              className="group w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 focus-within:border-[#1a4d3e] dark:focus-within:border-[#4ade80] transition-colors cursor-pointer flex items-center justify-between overflow-hidden"
              onClick={() => triggerPicker(returnDateRef)}
            >
              <input
                id="return-date"
                ref={returnDateRef}
                type="date"
                name="returnDate"
                value={bookingData.returnDate}
                onChange={handleChange}
                onClick={(e) => e.stopPropagation()}
                min={bookingData.pickupDate || getTomorrow()}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-gray-900 dark:text-white cursor-pointer z-10 transition-colors"
              />
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#1a4d3e] dark:group-hover:text-[#4ade80] transition-colors pointer-events-none ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <label htmlFor="return-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('booking.returnTime')}</label>
            <div
              className="group w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 focus-within:border-[#1a4d3e] dark:focus-within:border-[#4ade80] transition-colors cursor-pointer flex items-center justify-between overflow-hidden"
              onClick={() => triggerPicker(returnTimeRef)}
            >
              <input
                id="return-time"
                ref={returnTimeRef}
                type="time"
                name="returnTime"
                value={bookingData.returnTime}
                onChange={handleChange}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-gray-900 dark:text-white cursor-pointer z-10 transition-colors"
              />
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#1a4d3e] dark:group-hover:text-[#4ade80] transition-colors pointer-events-none ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Flight Number (for airport transfer) */}
      {isAirportTransfer && (
        <div className="space-y-3">
          <label htmlFor="flight-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            {t('booking.flightNumber')} <span className="text-gray-400 dark:text-gray-500">({t('common.optional')})</span>
          </label>
          <input
            id="flight-number"
            type="text"
            name="flightNumber"
            value={bookingData.flightNumber}
            onChange={handleChange}
            placeholder="e.g., GA 402"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-gray-900 dark:text-white focus:border-[#1a4d3e] dark:focus:border-[#4ade80] focus:ring-0 outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{t('booking.flightNumberHint')}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>{t('booking.back')}</span>
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium ${
 canProceed
 ? 'btn-3d btn-3d-green-adaptive text-white dark:text-gray-900'
 : 'bg-gray-200 dark:bg-dark-green-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
 }`}
        >
          <span>{t('booking.continue')}</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default Step2Details;
