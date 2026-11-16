'use client';

import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

const Step3Passengers = () => {
  const { bookingData, updateBooking, nextStep, prevStep, goToStep } = useBooking();
  const { t, tr } = useLanguage();
  const { formatPrice } = useCurrency();

  // Get max passengers from selected car tier or default to 4
  const singleVehicleMaxPax = (() => {
    if (bookingData.selectedCarTier?.capacity) {
      const capString = bookingData.selectedCarTier.capacity;
      const parts = capString.split(/[ -]/);
      const numbers = parts.map(p => parseInt(p)).filter(n => !isNaN(n));
      if (numbers.length > 0) {
        return Math.max(...numbers);
      }
    }
    return 4;
  })();

  const totalMaxPax = singleVehicleMaxPax * (bookingData.vehicleCount || 1);

  const handlePassengerChange = (increment) => {
    const newValue = Math.max(1, Math.min(24, bookingData.passengers + increment));
    updateBooking({ passengers: newValue });
    
    // Auto-reset vehicleCount to 1 if it now fits in one car
    if (newValue <= singleVehicleMaxPax && (bookingData.vehicleCount || 1) > 1) {
      updateBooking({ vehicleCount: 1 });
    }
  };

  const handleChildSeatChange = (increment) => {
    const newValue = Math.max(0, Math.min(3, bookingData.childSeatCount + increment));
    updateBooking({ 
      childSeatCount: newValue,
      childSeat: newValue > 0,
    });
  };

  const handleLuggageChange = (type, increment) => {
    const counts = { 
      small: 0, 
      medium: 0, 
      large: 0, 
      ...(bookingData.luggageCounts || {}) 
    };
    counts[type] = Math.max(0, Math.min(10, (counts[type] || 0) + increment));
    updateBooking({ luggageCounts: counts });
  };

  // Calculate luggage load in "Large" units: L=1, M=0.75, S=0.5
  const currentLuggageLoad = (
    (bookingData.luggageCounts?.large || 0) * 1 +
    (bookingData.luggageCounts?.medium || 0) * 0.75 +
    (bookingData.luggageCounts?.small || 0) * 0.5
  );

  const maxLuggageCapacity = (bookingData.selectedCarTier?.maxLuggage || 2) * (bookingData.vehicleCount || 1);
  const isLuggageOver = currentLuggageLoad > maxLuggageCapacity;

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
          {t('booking.whosTraveling')} <span className="text-[#c4935f]">{t('booking.traveling')}</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">{t('booking.tellUsAboutGroup')}</p>
      </div>

      {/* Number of Passengers */}
      <div className="bg-white dark:bg-dark-green-900 rounded-2xl border border-gray-100 dark:border-dark-green-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">{t('booking.passengers')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('booking.includingYourself')}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePassengerChange(-1)}
              disabled={bookingData.passengers <= 1}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 bookingData.passengers <= 1
 ? 'border-gray-200 dark:border-dark-green-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
 : 'border-[#1a4d3e] dark:border-[#4ade80] text-[#1a4d3e] dark:text-[#4ade80] hover:bg-[#1a4d3e] dark:hover:bg-[#4ade80] hover:text-white dark:hover:text-gray-900'
 }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white w-12 text-center transition-colors">
              {bookingData.passengers}
            </span>
            <button
              onClick={() => handlePassengerChange(1)}
              disabled={bookingData.passengers >= 24}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 bookingData.passengers >= 24
 ? 'border-gray-200 dark:border-dark-green-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
 : 'border-[#1a4d3e] dark:border-[#4ade80] text-[#1a4d3e] dark:text-[#4ade80] hover:bg-[#1a4d3e] dark:hover:bg-[#4ade80] hover:text-white dark:hover:text-gray-900'
 }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        
        {bookingData.passengers > totalMaxPax && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          >
            <p className="text-sm text-amber-800 dark:text-amber-400 font-medium flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t('booking.capacityWarning').replace('{pax}', bookingData.passengers)}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => goToStep(1)}
                className="flex flex-col items-center p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-dark-green-900 hover:border-amber-400 transition-[color,background-color,border-color,opacity,transform,box-shadow] text-center"
              >
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">{t('booking.upgradeCar')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('booking.largerVehicleNote').replace('{max}', singleVehicleMaxPax)}</span>
              </button>
              <button
                onClick={() => updateBooking({ vehicleCount: 2 })}
                className={`flex flex-col items-center p-3 rounded-lg border transition-[color,background-color,border-color,opacity,transform,box-shadow] text-center ${
 bookingData.vehicleCount === 2 
 ? 'border-[#1a4d3e] dark:border-[#4ade80] bg-[#1a4d3e]/5' 
 : 'border-amber-200 dark:border-amber-800 bg-white dark:bg-dark-green-900 hover:border-amber-400'
 }`}
              >
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">{t('booking.addAnotherCar')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">2x {bookingData.selectedCarTier?.car || 'Mobil'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {bookingData.vehicleCount > 1 && bookingData.passengers <= totalMaxPax && (
          <div className="mt-4 p-3 rounded-lg bg-[#1a4d3e]/5 dark:bg-[#4ade80]/10 border border-[#1a4d3e]/20 flex items-center justify-between">
            <span className="text-sm font-medium text-[#1a4d3e] dark:text-[#4ade80]">
              {bookingData.vehicleCount}x {bookingData.selectedCarTier?.car} ({t('booking.passengers')}: max {totalMaxPax})
            </span>
            <button 
              onClick={() => updateBooking({ vehicleCount: 1 })}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              {tr('Atur ulang', 'Reset')}
            </button>
          </div>
        )}
      </div>

      {/* Child Seats */}
      <div className="bg-white dark:bg-dark-green-900 rounded-2xl border border-gray-100 dark:border-dark-green-700 p-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">{t('booking.childSeats')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('booking.childSeatsDesc')}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleChildSeatChange(-1)}
              disabled={bookingData.childSeatCount <= 0}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 bookingData.childSeatCount <= 0
 ? 'border-gray-200 dark:border-dark-green-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
 : 'border-[#1a4d3e] dark:border-[#4ade80] text-[#1a4d3e] dark:text-[#4ade80] hover:bg-[#1a4d3e] dark:hover:bg-[#4ade80] hover:text-white dark:hover:text-gray-900'
 }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white w-12 text-center transition-colors">
              {bookingData.childSeatCount}
            </span>
            <button
              onClick={() => handleChildSeatChange(1)}
              disabled={bookingData.childSeatCount >= 3}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 bookingData.childSeatCount >= 3
 ? 'border-gray-200 dark:border-dark-green-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
 : 'border-[#1a4d3e] dark:border-[#4ade80] text-[#1a4d3e] dark:text-[#4ade80] hover:bg-[#1a4d3e] dark:hover:bg-[#4ade80] hover:text-white dark:hover:text-gray-900'
 }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
        {bookingData.childSeatCount > 0 && (
          <p className="mt-3 text-sm text-[#1a4d3e] dark:text-[#4ade80] flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {bookingData.childSeatCount} {t('booking.childSeatProvided').replace('{price}', formatPrice(50000))}
          </p>
        )}
      </div>

      {/* Luggage Selection */}
      <div className="bg-white dark:bg-dark-green-900 rounded-2xl border border-gray-100 dark:border-dark-green-700 p-6 transition-colors">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">{t('booking.luggageSize')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('booking.maxLuggageInfo')
              .replace('{car}', bookingData.selectedCarTier?.car || 'Mobil')
              .replace('{max}', maxLuggageCapacity)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'small', label: t('booking.small'), desc: t('booking.smallDesc'), icon: 'backpack' },
            { id: 'medium', label: t('booking.medium'), desc: t('booking.mediumDesc'), icon: 'suitcase' },
            { id: 'large', label: t('booking.large'), desc: t('booking.largeDesc'), icon: 'luggage' },
          ].map((option) => {
            const currentCount = bookingData.luggageCounts?.[option.id] || 0;

            return (
              <div key={option.id} className="flex flex-col p-4 rounded-xl border border-gray-100 dark:border-dark-green-800 bg-white dark:bg-dark-green-900/50 transition-[color,background-color,border-color,opacity,transform,box-shadow] hover:border-[#1a4d3e]/20">
                <div className="flex flex-col text-left mb-4 flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{option.label}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight h-8 flex items-center">{option.desc}</p>
                </div>
                
                <div className="flex flex-col items-center gap-1 pt-3 border-t border-gray-50 dark:border-dark-green-800">
                  <span className="text-xs font-semibold text-gray-400 mb-1">{tr('Jumlah', 'Qty')}</span>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleLuggageChange(option.id, -1)}
                      disabled={currentCount <= 0}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 currentCount <= 0
 ? 'border-gray-100 dark:border-dark-green-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
 : 'border-[#1a4d3e] dark:border-[#4ade80] text-[#1a4d3e] dark:text-[#4ade80] hover:bg-[#1a4d3e] dark:hover:bg-[#4ade80] hover:text-white dark:hover:text-gray-900'
 }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white w-6 text-center">
                      {currentCount}
                    </span>
                    <button
                      onClick={() => handleLuggageChange(option.id, 1)}
                      disabled={currentCount >= 10}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 currentCount >= 10
 ? 'border-gray-100 dark:border-dark-green-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
 : 'border-[#1a4d3e] dark:border-[#4ade80] text-[#1a4d3e] dark:text-[#4ade80] hover:bg-[#1a4d3e] dark:hover:bg-[#4ade80] hover:text-white dark:hover:text-gray-900'
 }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isLuggageOver && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          >
            <p className="text-sm text-amber-800 dark:text-amber-400 font-medium flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t('booking.luggageCapacityWarning').replace('{car}', bookingData.selectedCarTier?.car || 'Mobil')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => goToStep(1)}
                className="flex flex-col items-center p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-dark-green-900 hover:border-amber-400 transition-[color,background-color,border-color,opacity,transform,box-shadow] text-center"
              >
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">{t('booking.upgradeCar')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('booking.largerVehicleNote').replace('{max}', 'lebih')}</span>
              </button>
              <button
                onClick={() => updateBooking({ vehicleCount: 2 })}
                className={`flex flex-col items-center p-3 rounded-lg border transition-[color,background-color,border-color,opacity,transform,box-shadow] text-center ${
 bookingData.vehicleCount === 2 
 ? 'border-[#1a4d3e] dark:border-[#4ade80] bg-[#1a4d3e]/5' 
 : 'border-amber-200 dark:border-amber-800 bg-white dark:bg-dark-green-900 hover:border-amber-400'
 }`}
              >
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">{t('booking.addAnotherCar')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">2x {bookingData.selectedCarTier?.car || 'Mobil'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Special Requests */}
      <div className="space-y-3">
        <label htmlFor="special-requests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
          {t('booking.specialRequests')} <span className="text-gray-400 dark:text-gray-500">({t('common.optional')})</span>
        </label>
        <textarea
          id="special-requests"
          name="specialRequests"
          value={bookingData.specialRequests}
          onChange={(e) => updateBooking({ specialRequests: e.target.value })}
          placeholder={t('booking.specialRequestsPlaceholder')}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-gray-900 dark:text-white focus:border-[#1a4d3e] dark:focus:border-[#4ade80] focus:ring-0 outline-none transition-colors resize-none placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

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
          disabled={bookingData.passengers > totalMaxPax || isLuggageOver}
          className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium ${
 (bookingData.passengers > totalMaxPax || isLuggageOver)
 ? 'bg-gray-200 dark:bg-dark-green-800 text-gray-400 cursor-not-allowed'
 : 'btn-3d btn-3d-green-adaptive text-white dark:text-gray-900'
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

export default Step3Passengers;
