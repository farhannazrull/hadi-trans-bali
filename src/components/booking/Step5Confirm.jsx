'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { getWhatsAppLink, config } from '../../data/config';
import { track } from '../../lib/analytics';

const Step5Confirm = () => {
  const { bookingData, calculatePrice, submitBooking, prevStep, setShowTermsModal } = useBooking();
  const { t, language, tr } = useLanguage();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Helper to get localized text
  const getText = (field) => {
    if (typeof field === 'object' && field !== null) {
      return field[language] || field.en || field.id || '';
    }
    return field || '';
  };

  const estimatedPrice = calculatePrice();
  const luggageSummary = Object.entries(bookingData.luggageCounts || {})
    .filter(([, count]) => count > 0)
    .map(([size, count]) => `${count}${{ small: 'S', medium: 'M', large: 'L' }[size] || ''}`)
    .join(', ') || '-';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getServiceTitle = () => {
    const titles = {
      'airport-transfer': t('booking.airportTransfer'),
      'private-car': t('booking.privateCar'),
      'tour-package': getText(bookingData.selectedPackage?.title) || t('booking.tourPackage'),
      'custom': t('booking.customJourney'),
    };
    return titles[bookingData.serviceType] || t('booking.service');
  };

  const handleSubmit = async () => {
    track('booking_submitted', {
      service_type: bookingData.serviceType,
      value: estimatedPrice,
      currency: 'IDR',
      passengers: bookingData.passengers,
    });
    // Open WhatsApp inside the click so the browser does not block it, then save the booking
    window.open(getWhatsAppLink(generateWhatsAppMessage(), config.whatsapp.adminNumber), '_blank', 'noopener,noreferrer');
    setIsSubmitting(true);
    try {
      await submitBooking(user);
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
    setIsSubmitting(false);
  };

  const generateWhatsAppMessage = () => {
    const vehicleName = bookingData.selectedVehicle?.name || bookingData.selectedCarTier?.car;

    return `Halo Hadi Trans Bali, saya ingin booking:

*Detail Booking*
Layanan: ${getServiceTitle()}
Tanggal: ${formatDate(bookingData.pickupDate)}
Jam: ${bookingData.pickupTime}
Jemput: ${bookingData.pickupLocation}
${bookingData.dropoffLocation ? `Tujuan: ${bookingData.dropoffLocation}` : ''}
Penumpang: ${bookingData.passengers}
${vehicleName ? `Kendaraan: ${vehicleName}` : ''}

*Kontak*
Nama: ${bookingData.fullName}
${bookingData.email ? `Email: ${bookingData.email}\n` : ''}WhatsApp: ${bookingData.whatsapp}

Estimasi: ${formatPrice(estimatedPrice)}

Mohon konfirmasinya. Terima kasih.`;
  };

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
          {t('booking.reviewYour')} <span className="text-[#c4935f]">{t('booking.bookingTitle')}</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">{t('booking.checkAllDetails')}</p>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-white dark:bg-dark-green-900 rounded-2xl border border-gray-100 dark:border-dark-green-700 overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-dark-green-700">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Fraunces, serif' }}>{getServiceTitle()}</h3>
          {bookingData.tripType === 'round-trip' && (
            <span className="text-gray-500 dark:text-gray-400 text-sm">{t('booking.roundTrip')}</span>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Trip Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t('booking.tripDetailsTitle')}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{t('booking.date')}</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors">{formatDate(bookingData.pickupDate)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{t('booking.pickupTime')}</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors">{bookingData.pickupTime}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400 block">{t('booking.pickupLocation')}</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors text-sm">{bookingData.pickupLocation}</span>
              </div>
              {bookingData.dropoffLocation && (
                <div className="col-span-2">
                  <span className="text-gray-500 dark:text-gray-400 block">{t('booking.dropoffLocation')}</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors text-sm">{bookingData.dropoffLocation}</span>
                </div>
              )}
              {bookingData.flightNumber && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">{t('booking.flightNumber')}</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors">{bookingData.flightNumber}</span>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100 dark:border-dark-green-700 transition-colors" />

          {/* Passengers */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t('booking.passengersExtras')}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{t('booking.passengers')}</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors">{bookingData.passengers} {t('booking.persons')}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{t('booking.luggage')}</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors">{luggageSummary}</span>
              </div>
              {bookingData.childSeat && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">{t('booking.childSeats')}</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors">{bookingData.childSeatCount}</span>
                </div>
              )}
              {(bookingData.selectedVehicle || bookingData.selectedCarTier) && (
                <div className="col-span-2">
                  <span className="text-gray-500 dark:text-gray-400 block">{t('booking.vehicle')}</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors">
                    {bookingData.selectedVehicle?.name || bookingData.selectedCarTier?.car}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 text-xs ml-2">
                    ({bookingData.selectedVehicle 
                      ? (language === 'id' ? bookingData.selectedVehicle.capacityId : bookingData.selectedVehicle.capacity)
                      : (language === 'id' ? `Max ${bookingData.selectedCarTier?.capacity || '-'} orang` : `Max ${bookingData.selectedCarTier?.capacity || '-'} pax`)
                    })
                  </span>
                </div>
              )}
            </div>
            {bookingData.specialRequests && (
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-sm">{t('booking.specialRequests')}</span>
                <span className="text-gray-900 dark:text-white text-sm transition-colors">{bookingData.specialRequests}</span>
              </div>
            )}
          </div>

          <hr className="border-gray-100 dark:border-dark-green-700 transition-colors" />

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t('booking.contactInfo')}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400 block">{t('booking.name')}</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors">{bookingData.fullName}</span>
              </div>
              {bookingData.email && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">{t('booking.email')}</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors">{bookingData.email}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{t('booking.whatsapp')}</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors">+{bookingData.whatsapp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-[#f3ede6] dark:bg-dark-green-950/50 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('booking.estimatedTotal')}</p>
              <p className="text-2xl font-semibold text-[#1a4d3e] dark:text-[#4ade80] transition-colors">{formatPrice(estimatedPrice)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400 block">{tr('Pembayaran lewat WhatsApp', 'Payment via WhatsApp')}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{tr('setelah booking dikonfirmasi', 'once the booking is confirmed')}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 transition-colors">
            {t('booking.priceDisclaimer')}
          </p>
        </div>
      </div>

      {/* Payment (information only, paid via WhatsApp) */}
      <div className="bg-white dark:bg-dark-green-900 rounded-2xl border border-gray-200 dark:border-dark-green-800 p-6">
        <h3 className="font-medium text-gray-900 dark:text-white">{t('booking.paymentMethod')}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {tr('Pembayaran tidak dilakukan di website. Setelah booking dikonfirmasi lewat WhatsApp, kami kirim detail pembayarannya. Metode yang tersedia:', 'Payment is not made on the website. Once the booking is confirmed on WhatsApp, we send the payment details. Available methods:')}
        </p>
        <dl className="mt-4 divide-y divide-gray-100 dark:divide-dark-green-800">
          {[
            ['payOnArrival', 'payOnArrivalDesc'],
            ['payBankTransfer', 'payBankTransferDesc'],
            ['payQRIS', 'payQRISDesc'],
          ].map(([title, desc]) => (
            <div key={title} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-6">
              <dt className="text-sm font-medium text-gray-900 dark:text-white shrink-0">{t(`booking.${title}`)}</dt>
              <dd className="text-sm text-gray-500 dark:text-gray-400 sm:text-right">{t(`booking.${desc}`)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Terms Agreement */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-dark-green-700 bg-white dark:bg-dark-green-900 text-[#1a4d3e] dark:text-[#4ade80] focus:ring-[#1a4d3e] dark:focus:ring-[#4ade80] cursor-pointer transition-[color,background-color,border-color,opacity,transform,box-shadow]"
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('booking.termsAgreementStart')} <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#1a4d3e] dark:text-[#4ade80] font-semibold underline hover:text-[#c4935f] transition-colors">{t('booking.termsConditions')}</button>{t('booking.termsAgreementEnd')}
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Single action: send the booking to WhatsApp */}
        <button
          onClick={handleSubmit}
          disabled={!agreedToTerms || isSubmitting}
          className="btn-3d btn-3d-green w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium text-white"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{t('booking.submitting')}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{t('booking.sendViaWhatsApp')}</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {tr('Rincian booking dikirim ke WhatsApp kami untuk dikonfirmasi.', 'Your booking details are sent to our WhatsApp for confirmation.')}
        </p>
      </div>

      {/* Back Button */}
      <div className="flex justify-start pt-4">
        <button
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>{t('booking.backToEdit')}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Step5Confirm;
