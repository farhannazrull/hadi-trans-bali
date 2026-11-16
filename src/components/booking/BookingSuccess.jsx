'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/lib/router';
import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { getWhatsAppLink, config } from '../../data/config';

const BookingSuccess = () => {
  const { bookingData, bookingReference, calculatePrice, resetBooking } = useBooking();
  const { t, language, tr } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const estimatedPrice = calculatePrice();
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      const element = ticketRef.current;
      const dataUrl = await toJpeg(element, { 
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 10;
      const maxW = pageWidth - (margin * 2);
      const maxH = pageHeight - (margin * 2);
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const imgW = img.width;
      const imgH = img.height;
      const ratio = Math.min(maxW / imgW, maxH / imgH);
      
      const finalW = imgW * ratio;
      const finalH = imgH * ratio;
      
      pdf.addImage(dataUrl, 'JPEG', (pageWidth - finalW) / 2, margin, finalW, finalH);
      pdf.save(`HadiTransBali-Ticket-${bookingReference}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert(language === 'id' ? 'Gagal mengunduh PDF.' : 'Failed to download PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to get localized text
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
    return titles[bookingData.serviceType] || t('booking.service');
  };

  const luggageSummary = Object.entries(bookingData.luggageCounts || {})
    .filter(([, count]) => count > 0)
    .map(([size, count]) => `${count}${size.charAt(0).toUpperCase()}`)
    .join(', ') || '-';

  const followUpMessage = `Halo Hadi Trans Bali! Saya ingin mengonfirmasi booking saya.\n\n` +
                          `*Detail Booking:*\n` +
                          `- Ref: ${bookingReference}\n` +
                          `- Layanan: ${getServiceTitle()}\n` +
                          `- Nama: ${bookingData.fullName}\n` +
                          `- Tanggal: ${formatDate(bookingData.pickupDate)}\n` +
                          `- Penumpang: ${bookingData.passengers} orang\n` +
                          `- Unit: ${bookingData.vehicleCount || 1}x ${bookingData.selectedCarTier?.car || ''}\n` +
                          `- Bagasi: ${luggageSummary}\n` +
                          `- Lokasi: ${bookingData.pickupLocation}\n` +
                          (bookingData.pickupCoords 
                            ? `- Titik GPS: https://www.google.com/maps?q=${bookingData.pickupCoords.lat},${bookingData.pickupCoords.lng}\n` 
                            : '') +
                          `- Total: ${formatPrice(estimatedPrice)}\n\n` +
                          `Mohon konfirmasinya. Terima kasih.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="text-center space-y-8"
    >
      {/* Success Icon */}
      <div className="w-16 h-16 bg-[#1a4d3e]/10 dark:bg-[#4ade80]/10 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Success Message */}
      <div className="px-4">
        <h2 
          className="text-3xl lg:text-4xl font-light text-gray-900 dark:text-white mb-3 transition-colors"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          {t('booking.bookingSubmitted')} <span className="text-[#c4935f]">{t('booking.submitted')}</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors">
          {t('booking.thankYou')}, {bookingData.fullName.split(' ')[0]}. {t('booking.weReceivedBooking')}
        </p>
      </div>

      {/* Booking Reference */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#f3ede6] dark:bg-dark-green-900 rounded-2xl p-6 max-w-md mx-auto border border-transparent dark:border-dark-green-700 transition-colors"
      >
        <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2 font-medium">{t('booking.yourBookingRef')}</span>
        <span className="text-3xl font-mono font-semibold text-[#1a4d3e] dark:text-[#4ade80] transition-colors">
          {bookingReference}
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 ">
          {t('booking.saveRefNumber')}
        </p>
      </motion.div>

      {/* Quick Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-dark-green-900 rounded-2xl border border-gray-100 dark:border-dark-green-700 p-6 max-w-md mx-auto text-left transition-colors"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors">{t('booking.quickSummary')}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('booking.service')}</span>
            <span className="font-medium text-gray-900 dark:text-white transition-colors">{getServiceTitle()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('booking.date')}</span>
            <span className="font-medium text-gray-900 dark:text-white transition-colors">{formatDate(bookingData.pickupDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('booking.time')}</span>
            <span className="font-medium text-gray-900 dark:text-white transition-colors">{bookingData.pickupTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('booking.passengers')}</span>
            <span className="font-medium text-gray-900 dark:text-white transition-colors">{bookingData.passengers}</span>
          </div>
          <hr className="my-3 border-gray-100 dark:border-dark-green-800" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t('booking.totalPrice')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(estimatedPrice)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-semibold border-t border-gray-100 dark:border-dark-green-800 pt-2 text-[#1a4d3e] dark:text-[#4ade80]">
              <span>{t('booking.estimatedTotal')}</span>
              <span>{formatPrice(estimatedPrice)}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{tr('Pembayaran dilakukan lewat WhatsApp setelah booking dikonfirmasi.', 'Payment is made via WhatsApp once the booking is confirmed.')}</p>
          </div>
        </div>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg mx-auto"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors">{t('booking.whatsNext')}</h3>
        <div className="space-y-4 text-left">
          {[
          { title: t('booking.whatsappContact'), desc: t('booking.willMessageYou') },
          { title: t('booking.readyToGo'), desc: t('booking.driverWillArrive') },
        ].map((step, index) => {
          return (
            <div key={index} className="flex gap-4 items-start">
              <span className="w-6 shrink-0 text-sm font-medium text-[#c4935f] tabular-nums pt-0.5">{index + 1}</span>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white transition-colors">{step.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{step.desc}</p>
              </div>
            </div>
          );
        })}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 max-w-md mx-auto"
      >
        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium border border-gray-300 dark:border-dark-green-700 text-gray-700 dark:text-gray-200 hover:border-[#c4935f] transition-colors disabled:opacity-50"
        >
          {isDownloading ? (
            <svg className="animate-spin h-5 w-5 text-white dark:text-dark-green-950" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          <span>{isDownloading ? (language === 'id' ? 'Menyiapkan PDF...' : 'Preparing PDF...') : (language === 'id' ? 'Unduh voucher PDF' : 'Download PDF voucher')}</span>
        </button>

        <a
          href={getWhatsAppLink(followUpMessage, config.whatsapp.adminNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-3d btn-3d-whatsapp w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium text-white"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>
            {t('booking.chatWithUs')}
          </span>
        </a>

        <Link
          to="/"
          onClick={resetBooking}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium border border-gray-200 dark:border-dark-green-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-green-800 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300"
        >
          <span>{t('booking.backToHome')}</span>
        </Link>
      </motion.div>

      {/* Trust Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 transition-colors pb-12"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        {t('booking.infoSecure')}
      </motion.p>

      {/* Hidden Printable Template */}
      <div className="fixed top-[-9999px] left-[-9999px]">
        <div
          ref={ticketRef}
          className="w-[800px] bg-white text-gray-900 rounded-[28px] overflow-hidden border border-gray-200"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {/* Header band */}
          <div className="bg-[#1a4d3e] px-12 py-9 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/image/logo.webp" alt="Logo" className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20" />
              <div>
                <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Fraunces, serif' }}>
                  Hadi Trans <span className="text-[#c4935f]">Bali</span>
                </h1>
                <p className="text-white/60 text-sm mt-0.5">{tr('Transportasi & tour profesional di Bali', 'Professional Transport & Tour Service')}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block text-[10px] font-semibold tracking-wider text-[#1a4d3e] bg-[#c4935f] px-3 py-1 rounded-full mb-2">
                {tr('E-VOUCHER BOOKING', 'E-VOUCHER')}
              </span>
              <p className="text-xl font-mono font-semibold text-white tracking-wide">{bookingReference}</p>
            </div>
          </div>

          {/* Status strip */}
          <div className="flex items-center justify-between bg-[#f3ede6] px-12 py-3 border-b border-[#1a4d3e]/10">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#1a4d3e]">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {tr('Menunggu Konfirmasi dari Tim Kami', 'Awaiting Confirmation From Our Team')}
            </span>
            <span className="text-xs text-gray-500">
              {tr('Dibuat', 'Issued')}: {formatDate(new Date().toISOString())}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-10 p-12 pt-10">
            {/* Trip Info */}
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Layanan', 'Service Type')}</span>
                <p className="text-lg font-semibold">{getServiceTitle()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Tanggal', 'Date')}</span>
                  <p className="font-medium">{formatDate(bookingData.pickupDate)}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Jam', 'Time')}</span>
                  <p className="font-medium">{bookingData.pickupTime}</p>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Lokasi jemput', 'Pickup Location')}</span>
                <p className="text-sm leading-snug">{bookingData.pickupLocation}</p>
                {bookingData.pickupCoords && (
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">
                    GPS: {bookingData.pickupCoords.lat.toFixed(6)}, {bookingData.pickupCoords.lng.toFixed(6)}
                  </p>
                )}
              </div>
              {bookingData.dropoffLocation && (
                <div>
                  <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Tujuan', 'Destination')}</span>
                  <p className="text-sm leading-snug">{bookingData.dropoffLocation}</p>
                </div>
              )}
              {bookingData.selectedCarTier?.car && (
                <div>
                  <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Kendaraan', 'Vehicle')}</span>
                  <p className="text-sm font-medium">
                    {bookingData.vehicleCount > 1 ? `${bookingData.vehicleCount}x ` : ''}{bookingData.selectedCarTier.car}
                  </p>
                </div>
              )}

              {/* T&C Mini Section */}
              <div className="pt-4 border-t border-dashed border-gray-200">
                <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-2">{tr('Syarat & ketentuan', 'Terms & Conditions')}</span>
                <ul className="space-y-1">
                  {(t('booking.termsContent') || []).slice(0, 4).map((item, i) => (
                    <li key={i} className="text-[10px] text-gray-500 leading-tight">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Passenger & Price */}
            <div className="space-y-5 border-l border-dashed border-gray-200 pl-10">
              <div>
                <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Nama Pemesan', 'Customer Name')}</span>
                <p className="text-lg font-semibold">{bookingData.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Penumpang', 'Passengers')}</span>
                  <p className="font-medium">{bookingData.passengers} {tr('orang', 'pax')}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Bagasi', 'Luggage')}</span>
                  <p className="font-medium">{luggageSummary}</p>
                </div>
              </div>
              {bookingData.whatsapp && (
                <div>
                  <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">WhatsApp</span>
                  <p className="text-sm font-medium">+{bookingData.whatsapp}</p>
                </div>
              )}
              <div className="bg-[#fdfcfb] border border-gray-100 p-5 rounded-2xl">
                <span className="text-[11px] font-semibold text-[#c4935f] uppercase tracking-wide block mb-1">{tr('Estimasi Total', 'Estimated Total')}</span>
                <p className="text-2xl font-semibold text-[#1a4d3e]">{formatPrice(estimatedPrice)}</p>
                {currency.code !== 'IDR' && (
                  <p className="text-sm font-medium text-gray-500 mt-1">
                    (IDR {estimatedPrice.toLocaleString('id-ID')})
                  </p>
                )}
                <p className="text-[11px] text-gray-400 mt-2">{tr('*Pembayaran dilakukan lewat WhatsApp setelah booking dikonfirmasi.', '*Payment is settled via WhatsApp once the booking is confirmed.')}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#fdfcfb] px-12 py-7 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-3">{tr('Terima kasih telah memilih Hadi Trans Bali.', 'Thank you for choosing Hadi Trans Bali.')}</p>
            <div className="flex justify-center gap-8 text-[11px] font-medium text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-[#1a4d3e] font-semibold">WA:</span>
                <a href={`https://wa.me/${config.whatsapp.number}`} className="hover:text-[#1a4d3e] hover:underline">+{config.whatsapp.number}</a>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-[#1a4d3e] font-semibold">Email:</span>
                <a href={`mailto:${config.contact.email}`} className="hover:text-[#1a4d3e] hover:underline">{config.contact.email}</a>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-[#1a4d3e] font-semibold">Web:</span>
                <a href="https://haditransbali.my.id" className="hover:text-[#1a4d3e] hover:underline">haditransbali.my.id</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSuccess;
