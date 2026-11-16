'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from '@/lib/router';
import { customDestinations, carOptions } from '../data/customTrips';
import { useCurrency } from '../context/CurrencyContext';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';

const TripCalculator = ({ inline = false, noCard = false, onPlanCreated }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { bookingData, updateBooking, resetBooking } = useBooking();
  const { t } = useLanguage();

  // Initialize from context if available (for sync between pages)
  const [selectedDestinations, setSelectedDestinations] = useState(bookingData.selectedDestinations || []);
  const [selectedCar, setSelectedCar] = useState(bookingData.selectedVehicle || carOptions[0]);

  // Sync state if context changes (important for the Booking page mount)
  useEffect(() => {
    if (bookingData.selectedDestinations) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDestinations(bookingData.selectedDestinations);
    }
    if (bookingData.selectedVehicle) {
      setSelectedCar(bookingData.selectedVehicle);
    }
  }, [bookingData.selectedDestinations, bookingData.selectedVehicle]);

  const calculateLocalPrice = (dests, car) => {
    let total = car.basePrice;
    const hasFarZone = dests.some(d => d.zone === 'north' || d.zone === 'east');
    if (hasFarZone) total += 150000;
    if (dests.length > 2) {
      total += (dests.length - 2) * 25000;
    }
    return total;
  };

  const toggleDestination = (dest) => {
    let newDestinations;
    if (selectedDestinations.find(d => d.id === dest.id)) {
      newDestinations = selectedDestinations.filter(d => d.id !== dest.id);
    } else {
      if (selectedDestinations.length < 6) {
        newDestinations = [...selectedDestinations, dest];
      } else {
        return;
      }
    }
    setSelectedDestinations(newDestinations);
    
    if (inline && onPlanCreated) {
      onPlanCreated({
        destinations: newDestinations,
        car: selectedCar,
        price: calculateLocalPrice(newDestinations, selectedCar)
      });
    }
  };

  const handleCarChange = (car) => {
    setSelectedCar(car);
    if (inline && onPlanCreated) {
      onPlanCreated({
        destinations: selectedDestinations,
        car: car,
        price: calculateLocalPrice(selectedDestinations, car)
      });
    }
  };

  const calculation = useMemo(() => calculateLocalPrice(selectedDestinations, selectedCar), [selectedDestinations, selectedCar]);

  const handleBook = () => {
    resetBooking();
    updateBooking({
      serviceType: 'custom',
      specialRequests: `Custom Trip Plan: ${selectedDestinations.map(d => d.name).join(' -> ')}`,
      selectedVehicle: selectedCar,
      selectedDestinations: selectedDestinations, // Store the raw array too
      estimatedPrice: calculation
    });
    navigate('/booking');
  };

  const containerClasses = (inline || noCard)
    ? "w-full" 
    : "bg-white dark:bg-dark-green-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-green-700 max-w-5xl mx-auto transition-colors";

  return (
    <div className={containerClasses}>
      <div className={`grid grid-cols-1 ${(inline && !noCard) ? 'lg:grid-cols-1 gap-8' : 'lg:grid-cols-5 gap-8 lg:gap-12'}`}>
        
        {/* Selection Area */}
        <div className={`${(inline && !noCard) ? '' : 'lg:col-span-3'}`}>
          <div className="mb-8">
            <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
              {t('calculator.buildRouteTitle')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('calculator.buildRouteSubtitle')}
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${inline ? '' : 'max-h-[400px] overflow-y-auto md:max-h-none md:overflow-visible pr-2 custom-scrollbar'}`}>
            {customDestinations.map((dest) => {
              const isSelected = selectedDestinations.find(d => d.id === dest.id);
              return (
                <button
                  key={dest.id}
                  onClick={() => toggleDestination(dest)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-[color,background-color,border-color,opacity,transform,box-shadow] text-left ${
 isSelected 
 ? 'bg-[#1a4d3e] border-[#1a4d3e] text-white shadow-md' 
 : 'bg-white dark:bg-dark-green-800 border-gray-200 dark:border-dark-green-800 text-gray-700 dark:text-gray-200 hover:border-[#c4935f] dark:hover:border-[#4ade80]'
 }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-[color,background-color,border-color,opacity,transform,box-shadow] ${isSelected ? 'bg-white dark:bg-[#4ade80] border-white dark:border-[#4ade80] text-[#1a4d3e] dark:text-gray-900' : 'bg-white dark:bg-dark-green-700 border-gray-200 dark:border-gray-500'}`}>
                    {isSelected && <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>}
                  </div>
                  <span className="text-sm font-medium">{dest.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Area */}
        <div className={`${(inline && !noCard) ? 'bg-[#1a4d3e]/5 dark:bg-[#4ade80]/5 p-6 rounded-2xl border-2 border-[#1a4d3e]/10 dark:border-[#4ade80]/10' : 'lg:col-span-2 p-8 bg-[#f3ede6]/50 dark:bg-dark-green-950/50 rounded-3xl border-2 border-[#f3ede6] dark:border-dark-green-700 flex flex-col'}`}>
          <h4 className="text-xl font-light text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Fraunces, serif' }}>{t('calculator.tripSummary')}</h4>
          
          <div className="space-y-6 flex-grow">
            {/* Selected List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{t('calculator.destinations')}</span>
              {selectedDestinations.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 bg-[#f3ede6]/60 dark:bg-dark-green-900/60 rounded-2xl text-center">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">{t('calculator.noDestinations')}</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedDestinations.map((dest, i) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={dest.id} 
                      className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-green-800 px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-dark-green-800"
                    >
                      <span className="w-4 h-4 bg-[#c4935f] text-white rounded-full flex items-center justify-center text-[8px] font-semibold">{i + 1}</span>
                      {dest.name}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Car Type */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{t('calculator.selectVehicle')}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {carOptions.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => handleCarChange(car)}
                    className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 selectedCar.id === car.id
 ? 'border-[#1a4d3e] dark:border-[#4ade80] bg-white dark:bg-dark-green-800'
 : 'border-transparent bg-white dark:bg-dark-green-800/70 hover:border-gray-200 dark:hover:border-gray-600'
 }`}
                  >
                    <svg className="w-[18px] h-[18px] shrink-0 text-[#c4935f]" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13m-18 0v5a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-5m-18 0h18M7 16h.01M17 16h.01" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-xs truncate">{car.name}</div>
                    </div>
                    <div className="shrink-0 text-xs font-medium text-gray-600 dark:text-gray-300 tabular-nums">{formatPrice(car.basePrice)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Area */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-green-700">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 justify-between">
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{t('calculator.estimatedPrice')}</span>
                <div className="text-3xl font-semibold text-[#1a4d3e] dark:text-[#4ade80] tabular-nums">
                  {formatPrice(calculation)}
                </div>
              </div>
              {!inline && (
                <button
                  onClick={handleBook}
                  disabled={selectedDestinations.length === 0}
                  className={`w-full px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
 selectedDestinations.length > 0
 ? 'btn-3d btn-3d-bronze'
 : 'bg-gray-300 cursor-not-allowed'
 }`}
                >
                  <span>{t('calculator.bookNow')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCalculator;