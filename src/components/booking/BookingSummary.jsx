'use client';

import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

const Row = ({ label, children }) => (
  <div className="flex items-start justify-between gap-6 py-3 border-b border-gray-100 dark:border-dark-green-800 last:border-0">
    <dt className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{label}</dt>
    <dd className="text-sm font-medium text-gray-900 dark:text-white text-right break-words min-w-0">{children}</dd>
  </div>
);

const BookingSummary = () => {
  const { bookingData, calculatePrice } = useBooking();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const estimatedPrice = calculatePrice();

  const getText = (field) => {
    if (typeof field === 'object' && field !== null) {
      return field[language] || field.en || field.id || '';
    }
    return field || '';
  };

  const getServiceTitle = () => {
    const titles = {
      'airport-transfer': t('booking.airportTransfer'),
      'private-car': t('booking.privateCar'),
      'tour-package': getText(bookingData.selectedPackage?.title) || t('booking.tourPackage'),
      'custom': t('booking.customJourney'),
    };
    return titles[bookingData.serviceType] || '';
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  const luggage = Object.entries(bookingData.luggageCounts || {})
    .filter(([, count]) => count > 0)
    .map(([size, count]) => `${count}${{ small: 'S', medium: 'M', large: 'L' }[size] || ''}`)
    .join(', ');

  const vehicle = bookingData.selectedVehicle?.name || bookingData.selectedCarTier?.car;

  if (!bookingData.serviceType) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-dark-green-700 p-6">
        <h3 className="text-lg text-gray-900 dark:text-white" style={{ fontFamily: 'Fraunces, serif' }}>{t('booking.bookingSummary')}</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('booking.selectServiceToStart')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-dark-green-800 bg-white dark:bg-dark-green-900 p-6">
      <h3 className="text-lg text-gray-900 dark:text-white" style={{ fontFamily: 'Fraunces, serif' }}>{t('booking.bookingSummary')}</h3>
      <p className="mt-1 text-sm text-[#1a4d3e] dark:text-[#4ade80] font-medium">{getServiceTitle()}</p>

      <dl className="mt-4">
        <Row label={`${t('booking.date')} & ${t('booking.time')}`}>
          {bookingData.pickupDate ? formatDate(bookingData.pickupDate) : '-'}
          {bookingData.pickupTime && <span className="block text-gray-500 dark:text-gray-400 font-normal tabular-nums">{bookingData.pickupTime}</span>}
        </Row>
        {bookingData.pickupLocation && <Row label={t('booking.pickupLocation')}>{bookingData.pickupLocation}</Row>}
        {bookingData.dropoffLocation && <Row label={t('booking.dropoffLocation')}>{bookingData.dropoffLocation}</Row>}
        {vehicle && (
          <Row label={t('booking.vehicle')}>
            {bookingData.vehicleCount > 1 ? `${bookingData.vehicleCount}x ` : ''}{vehicle}
          </Row>
        )}
        <Row label={t('booking.passengers')}><span className="tabular-nums">{bookingData.passengers}</span></Row>
        <Row label={t('booking.luggage')}><span className="tabular-nums">{luggage || '-'}</span></Row>
      </dl>

      <div className="mt-2 pt-5 border-t border-gray-200 dark:border-dark-green-700 flex items-baseline justify-between gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{t('booking.estimatedTotal')}</span>
        <span className="text-2xl font-medium text-gray-900 dark:text-white tabular-nums">
          {estimatedPrice > 0 ? formatPrice(estimatedPrice) : '-'}
        </span>
      </div>
    </div>
  );
};

export default BookingSummary;
