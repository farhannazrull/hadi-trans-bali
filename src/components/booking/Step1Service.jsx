'use client';

import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { packages } from '../../data/packages';
import TripCalculator from '../TripCalculator';

const Step1Service = () => {
  const { bookingData, updateBooking, nextStep } = useBooking();
  const { language, t, tr } = useLanguage();
  const { formatPrice } = useCurrency();

  const handleCustomPlanCreated = (plan) => {
    updateBooking({
      selectedDestinations: plan.destinations,
      selectedVehicle: plan.car,
      estimatedPrice: plan.price,
      specialRequests: `Custom Trip: ${plan.destinations.map(d => d.name).join(' -> ')}`
    });
  };

  // Helper to get localized text
  const getText = (field) => {
    if (typeof field === 'object' && field !== null) {
      return field[language] || field.en || field.id || '';
    }
    return field || '';
  };

  const serviceOptions = [
    {
      id: 'airport-transfer',
      title: t('booking.airportTransfer'),
      description: t('booking.airportTransferDesc'),
      icon: (
        <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
      priceFrom: 250000,
    },
    {
      id: 'private-car',
      title: t('booking.privateCar'),
      description: t('booking.privateCarDesc'),
      icon: (
        <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      priceFrom: 500000,
    },
    {
      id: 'tour-package',
      title: t('booking.tourPackage'),
      description: t('booking.tourPackageDesc'),
      icon: (
        <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      ),
      priceFrom: 450000,
    },
    {
      id: 'custom',
      title: t('booking.customJourney'),
      description: t('booking.customJourneyDesc'),
      icon: (
        <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      ),
      priceFrom: 500000,
    },
  ];

  const handleServiceSelect = (serviceId) => {
    updateBooking({ 
      serviceType: serviceId,
      selectedPackage: null, // Reset package when service changes
      selectedCarTier: null, // Reset car tier
      estimatedPrice: 0 // Reset price
    });
  };

  const handlePackageSelect = (pkg) => {
    updateBooking({ 
      selectedPackage: pkg,
      selectedCarTier: null, // Reset tier when package changes
      estimatedPrice: 0 
    });
  };

  const canProceed = bookingData.serviceType && 
    (bookingData.serviceType === 'custom' 
      ? bookingData.selectedDestinations?.length > 0 
      : (bookingData.serviceType !== 'tour-package' || (bookingData.selectedPackage && bookingData.selectedCarTier)));

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
          {t('booking.whatDoYouNeed')} <span className="text-[#c4935f]">{t('booking.need')}</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">{t('booking.selectServiceType')}</p>
      </div>

      {/* Service Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {serviceOptions.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => handleServiceSelect(service.id)}
            className={`relative p-6 rounded-2xl border text-left transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ${
 bookingData.serviceType === service.id
 ? 'border-[#1a4d3e] bg-[#1a4d3e]/5 dark:bg-[#4ade80]/10 dark:border-[#4ade80]'
 : 'border-gray-200 dark:border-dark-green-700 hover:border-[#c4935f] bg-white dark:bg-dark-green-900'
 }`}
          >
            {/* Selected Indicator */}
            {bookingData.serviceType === service.id && (
              <div
                className="absolute top-4 right-4 w-6 h-6 bg-[#1a4d3e] dark:bg-[#4ade80] rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <span className="mb-4 block">{service.icon}</span>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 transition-colors">{service.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors">{service.description}</p>
            <p className="text-sm">
              <span className="text-gray-400 dark:text-gray-500">{t('booking.from')} </span>
              <span className="font-semibold text-[#1a4d3e] dark:text-[#4ade80] transition-colors">{formatPrice(service.priceFrom)}</span>
            </p>
          </button>
        ))}
      </div>

      {/* Custom Journey Info/Integration */}
      {bookingData.serviceType === 'custom' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-dark-green-900 rounded-2xl border border-[#c4935f]/30 dark:border-[#4ade80]/30 p-6 transition-colors">
            <TripCalculator 
              inline={true} 
              onPlanCreated={handleCustomPlanCreated} 
            />
          </div>
        </motion.div>
      )}

      {/* Private Car Details (Duration & Area) */}
      {bookingData.serviceType === 'private-car' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white dark:bg-dark-green-900 rounded-2xl border border-gray-200 dark:border-dark-green-800">
            {/* Duration Selection */}
            <div>
              <span className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                {tr('Durasi sewa', 'Rental duration')}
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[10, 12].map((dur) => {
                  const on = bookingData.rentalDuration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      aria-pressed={on}
                      onClick={() => updateBooking({ rentalDuration: dur })}
                      className={`min-h-[64px] px-4 py-3 rounded-xl border text-left flex flex-col justify-center transition-colors ${on ? 'border-[#1a4d3e] dark:border-[#4ade80] bg-[#1a4d3e]/5 dark:bg-[#4ade80]/10' : 'border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 hover:border-[#c4935f]'}`}
                    >
                      <span className={`text-sm font-medium ${on ? 'text-[#1a4d3e] dark:text-[#4ade80]' : 'text-gray-900 dark:text-white'}`}>{dur} {t('common.hours')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tr('Seharian', 'Full day')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Area Selection */}
            <div>
              <span className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                {tr('Area perjalanan', 'Travel area')}
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'standard', label: tr('Standar', 'Standard'), sub: tr('Kuta, Ubud, dll', 'Kuta, Ubud, etc') },
                  { id: 'out-of-town', label: tr('Luar kota', 'Outer'), sub: tr('Lovina, dll', 'Lovina, etc') },
                ].map((area) => {
                  const on = bookingData.tripArea === area.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => updateBooking({ tripArea: area.id })}
                      className={`min-h-[64px] px-4 py-3 rounded-xl border text-left flex flex-col justify-center transition-colors ${on ? 'border-[#1a4d3e] dark:border-[#4ade80] bg-[#1a4d3e]/5 dark:bg-[#4ade80]/10' : 'border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 hover:border-[#c4935f]'}`}
                    >
                      <span className={`text-sm font-medium ${on ? 'text-[#1a4d3e] dark:text-[#4ade80]' : 'text-gray-900 dark:text-white'}`}>{area.label}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{area.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-[#f3ede6] dark:bg-dark-green-800/50 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {language === 'id' 
                ? 'Harga dasar sudah termasuk mobil, driver, dan BBM. Biaya tambahan mungkin berlaku untuk area yang sangat jauh.' 
                : 'Base price includes car, driver, and fuel. Additional surcharges may apply for remote areas.'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Vehicle Selection for Tour Package OR Private Car */}
      {(bookingData.serviceType === 'tour-package' || bookingData.serviceType === 'private-car') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6"
        >
          {/* Package Selection (ONLY for tour-package) */}
          {bookingData.serviceType === 'tour-package' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors">{t('booking.selectTourPackage')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`relative p-4 rounded-xl border text-left transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 bookingData.selectedPackage?.id === pkg.id
 ? 'border-[#1a4d3e] bg-[#1a4d3e]/5 dark:bg-[#4ade80]/10 dark:border-[#4ade80]'
 : 'border-gray-200 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 hover:border-[#c4935f]'
 }`}
                  >
                    <div className="flex gap-4">
                      <img 
                        src={pkg.image} 
                        alt={getText(pkg.title)}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white transition-colors truncate mb-0.5">{getText(pkg.title)}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors font-medium">{getText(pkg.duration)} · {getText(pkg.hours)}</p>
                        
                        {pkg.destinations?.length > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                            {pkg.destinations.slice(0, 3).join(' · ')}
                            {pkg.destinations.length > 3 ? ` · +${pkg.destinations.length - 3} ${tr('lainnya', 'more')}` : ''}
                          </p>
                        )}

                        <p className="text-base font-medium text-[#1a4d3e] dark:text-[#4ade80] tabular-nums">
                          {formatPrice(pkg.startingPrice)}
                        </p>
                      </div>
                    </div>
                    {bookingData.selectedPackage?.id === pkg.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#1a4d3e] dark:bg-[#4ade80] rounded-full flex items-center justify-center transition-colors">
                        <svg className="w-3 h-3 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Selection (Both Services) */}
          {(bookingData.serviceType === 'private-car' || bookingData.selectedPackage) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t border-gray-100 dark:border-dark-green-700 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors">
                {tr('Pilih armada', 'Select vehicle')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(bookingData.selectedPackage?.pricing || packages[0].pricing).map((tier, idx) => {
                  // For Private Car, we use the pricing from the first package as base, 
                  // but calculatePrice will handle the actual total.
                  // We need to show the price adjusted for duration/area in the selection card too.
                  
                  let displayPrice = tier.price;
                  if (bookingData.serviceType === 'private-car') {
                    if (bookingData.rentalDuration === 12) displayPrice += 100000;
                    if (bookingData.tripArea === 'out-of-town') displayPrice += 150000;
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => updateBooking({ 
                        selectedCarTier: tier,
                        estimatedPrice: displayPrice
                      })}
                      className={`group relative overflow-hidden rounded-2xl border text-left transition-[color,background-color,border-color,opacity,transform,box-shadow] ${
 bookingData.selectedCarTier?.car === tier.car
 ? 'border-[#1a4d3e] bg-[#1a4d3e]/5 dark:bg-[#4ade80]/10 dark:border-[#4ade80]'
 : 'border-gray-200 dark:border-dark-green-700 hover:border-[#c4935f]/50 bg-white dark:bg-dark-green-900'
 }`}
                    >
                      <div className="flex items-center gap-5 p-4 sm:p-5">
                        {/* Larger Vehicle Image Container */}
                        <div className="w-28 sm:w-32 h-20 sm:h-24 bg-gray-50 dark:bg-dark-green-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                          <img 
                            src={tier.image} 
                            alt={tier.car} 
                            className="w-full h-full object-contain transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/400x300/f3ede6/1a4d3e?text=Foto+belum+ada';
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate transition-colors tracking-tight">{tier.car}</span>
                            {bookingData.selectedCarTier?.car === tier.car && (
                              <div className="w-5 h-5 bg-[#1a4d3e] dark:bg-[#4ade80] rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                                <svg className="w-3.5 h-3.5 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[#1a4d3e] dark:text-[#4ade80] font-medium text-base tabular-nums">{formatPrice(displayPrice)}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                              {tr('Maks.', 'Max')} {tier.capacity} {tr('orang', 'pax')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end pt-6">
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

export default Step1Service;
