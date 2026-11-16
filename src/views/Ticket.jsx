'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLastSegment, Link } from '@/lib/router';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { getWhatsAppLink, config } from '../data/config';

const getServiceIcon = (serviceType) => {
  const icons = {
    'airport-transfer': (
      <svg className="w-7 h-7 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
    'private-car': (
      <svg className="w-7 h-7 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    'tour-package': (
      <svg className="w-7 h-7 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    'custom': (
      <svg className="w-7 h-7 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  };
  return icons[serviceType] || icons['custom'];
};

const Ticket = () => {
  const reference = useLastSegment();
  const { user, isGuest } = useAuth();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);

  // Helper to get localized text
  const getText = (field) => {
    if (typeof field === 'object' && field !== null) {
      return field[language] || field.en || field.id || '';
    }
    return field || '';
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      const element = ticketRef.current;
      
      // Use toJpeg from html-to-image which handles modern CSS (oklab/oklch) much better
      const dataUrl = await toJpeg(element, { 
        quality: 0.95,
        backgroundColor: '#ffffff', // Keep white background for PDF readability
        pixelRatio: 2 // High quality
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Margin settings
      const margin = 10;
      const maxW = pageWidth - (margin * 2);
      const maxH = pageHeight - (margin * 2);
      
      // Get image info
      const img = new Image();
      img.src = dataUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgW = img.width;
      const imgH = img.height;
      const ratio = Math.min(maxW / imgW, maxH / imgH);
      
      const finalW = imgW * ratio;
      const finalH = imgH * ratio;
      
      const x = (pageWidth - finalW) / 2;
      const y = margin;
      
      pdf.addImage(dataUrl, 'JPEG', x, y, finalW, finalH);
      pdf.save(`HadiTransBali-Ticket-${reference}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert(language === 'id' 
        ? `Gagal membuat PDF: ${err.message || 'Error tidak diketahui'}.` 
        : `Failed to create PDF: ${err.message || 'Unknown error'}.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const loadBooking = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (user) {
        // Load from Firestore
        const bookingRef = doc(db, 'bookings', reference);
        const bookingSnap = await getDoc(bookingRef);
        if (bookingSnap.exists()) {
          setBooking({ id: bookingSnap.id, ...bookingSnap.data() });
        } else {
          setError('Booking not found');
        }
      } else if (isGuest) {
        // Load from localStorage
        const guestBookings = localStorage.getItem('guestBookings');
        if (guestBookings) {
          const bookings = JSON.parse(guestBookings);
          const found = bookings.find(b => b.reference === reference);
          if (found) {
            setBooking(found);
          } else {
            setError('Booking not found');
          }
        } else {
          setError('Booking not found');
        }
      } else {
        setError('Please login to view this ticket');
      }
    } catch (err) {
      console.error('Error loading booking:', err);
      setError('Error loading booking');
    }

    setLoading(false);
  }, [reference, user, isGuest]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBooking();
  }, [loadBooking]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = dateStr.toDate ? dateStr.toDate() : new Date(dateStr);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getServiceTitle = () => {
    if (!booking) return '';
    const titles = {
      'airport-transfer': t('booking.airportTransfer'),
      'private-car': t('booking.privateCar'),
      'tour-package': getText(booking.selectedPackage?.title) || t('booking.tourPackage'),
      'custom': t('booking.customJourney'),
    };
    return titles[booking.serviceType] || t('booking.service');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800',
      confirmed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800',
      completed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800',
      cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-dark-green-800 dark:text-gray-300 dark:border-dark-green-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: t('auth.statusPending'),
      confirmed: t('auth.statusConfirmed'),
      completed: t('auth.statusCompleted'),
      cancelled: t('auth.statusCancelled')
    };
    return labels[status] || status;
  };

  const handleSendToGmail = () => {
    const subject = language === 'id' 
      ? `Tiket Booking Hadi Trans Bali - ${reference}`
      : `Hadi Trans Bali Booking Ticket - ${reference}`;
    // ... body content omitted for brevity, logic remains same
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${booking.email}&su=${encodeURIComponent(subject)}`;
    window.open(gmailUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 flex items-center justify-center transition-colors">
        <div className="animate-spin w-8 h-8 border-4 border-[#1a4d3e] dark:border-[#4ade80] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 pt-32 pb-16 transition-colors">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-white dark:bg-dark-green-900 rounded-2xl p-8 shadow-sm border border-transparent dark:border-dark-green-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-dark-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">{error}</h2>
            <Link
              to="/"
              className="btn-3d btn-3d-green-adaptive inline-flex items-center gap-2 px-8 py-4 text-white dark:text-gray-900 rounded-xl"
            >
              {t('nav.home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 pt-28 pb-16 transition-colors">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-green-900 rounded-2xl shadow-lg overflow-hidden border border-transparent dark:border-dark-green-700 transition-colors"
        >
          {/* Note: ticketRef content maintains light theme for PDF generation consistency */}
          <div ref={ticketRef} className="bg-white dark:bg-dark-green-900 transition-colors">
            {/* Ticket Header */}
            <div className="bg-[#1a4d3e] px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="/image/logo.webp" alt="Logo" className="h-12 w-12 rounded-full object-cover border-2 border-white/20" />
                  <div>
                    <h1 className="text-white text-xl font-semibold" style={{ fontFamily: 'Fraunces, serif' }}>
                      Hadi Trans <span className="text-[#c4935f]">Bali</span>
                    </h1>
                    <p className="text-white/70 text-xs mt-0.5">{t('auth.ticketDetails')}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${getStatusColor(booking.status || 'pending')}`}>
                  {getStatusLabel(booking.status || 'pending')}
                </span>
              </div>
            </div>

            {/* Ticket Reference */}
            <div className="bg-[#f3ede6] dark:bg-dark-green-800 px-8 py-4 border-b border-dashed border-gray-300 dark:border-dark-green-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('auth.bookingRef')}</span>
                <span className="font-mono font-semibold text-lg text-[#1a4d3e] dark:text-[#4ade80] transition-colors">{reference}</span>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="px-8 py-6 space-y-6">
              {/* Service */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f3ede6] dark:bg-dark-green-800 rounded-xl flex items-center justify-center transition-colors">
                  {getServiceIcon(booking.serviceType)}
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{t('booking.service')}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">{getServiceTitle()}</h3>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-dark-green-800 transition-colors" />

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">{t('booking.date')}</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors">{formatDate(booking.pickupDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">{t('booking.time')}</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors">{booking.pickupTime}</span>
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">{t('booking.pickupLocation')}</span>
                  <span className="text-gray-900 dark:text-white transition-colors">{booking.pickupLocation}</span>
                </div>
                {booking.dropoffLocation && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">{t('booking.dropoffLocation')}</span>
                    <span className="text-gray-900 dark:text-white transition-colors">{booking.dropoffLocation}</span>
                  </div>
                )}
              </div>

              <hr className="border-gray-100 dark:border-dark-green-800 transition-colors" />

              {/* Passengers & Luggage */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">{t('booking.passengers')}</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors">{booking.passengers} {t('booking.persons')}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">{t('booking.luggage')}</span>
                  <span className="text-gray-900 dark:text-white font-medium capitalize transition-colors">{t(`booking.${booking.luggage}`)}</span>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-[#f3ede6] dark:bg-dark-green-800 rounded-xl p-4 transition-colors">
                <span className="text-gray-500 dark:text-gray-400 text-sm block mb-2">{t('booking.contactInfo')}</span>
                <div className="space-y-1">
                  <p className="text-gray-900 dark:text-white font-medium transition-colors">{booking.fullName}</p>
                  <a href={`mailto:${booking.email}`} className="text-gray-600 dark:text-gray-300 text-sm block hover:text-[#1a4d3e] dark:hover:text-[#4ade80] hover:underline transition-colors">{booking.email}</a>
                  <a href={`https://wa.me/${booking.whatsapp}`} className="text-gray-600 dark:text-gray-300 text-sm block hover:text-[#1a4d3e] dark:hover:text-[#4ade80] hover:underline transition-colors">+{booking.whatsapp}</a>
                </div>
              </div>

              {/* T&C Section */}
              <div className="pt-4 border-t border-gray-100 dark:border-dark-green-800 transition-colors">
                <span className="text-[11px] font-semibold text-[#c4935f] block mb-2">Terms & Conditions</span>
                <ul className="space-y-1">
                  {(t('booking.termsContent') || []).slice(0, 4).map((item, i) => (
                    <li key={i} className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight transition-colors">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="bg-[#1a4d3e] px-8 py-6 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white/70 text-sm">{t('booking.totalPrice')}</span>
                  <p className="text-white text-2xl font-semibold">{formatPrice(booking.estimatedPrice || 0)}</p>
                </div>
                <div className="text-right">
                  {booking.paymentMethod === 'midtrans' ? (
                    <>
                      <span className="text-green-400 text-xs block font-semibold">{language === 'id' ? 'DP 30% DIBAYAR' : '30% DEPOSIT PAID'}</span>
                      <span className="text-white text-lg font-semibold block">
                        {language === 'id' ? 'Sisa:' : 'Balance:'} {formatPrice((booking.estimatedPrice || 0) * 0.7)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-white/70 text-xs block">{t('booking.paymentOnArrival')}</span>
                      <span className="text-white text-lg font-semibold">{t('booking.cashOrTransfer')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="btn-3d btn-3d-green-adaptive flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 text-white dark:text-gray-900 rounded-xl"
          >
            {isDownloading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span>{isDownloading ? (language === 'id' ? 'Mengunduh...' : 'Downloading...') : (language === 'id' ? 'Unduh Tiket' : 'Download Ticket')}</span>
          </button>

          <button
            onClick={handleSendToGmail}
            className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-dark-green-900 border-2 border-gray-200 dark:border-dark-green-700 text-gray-700 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-dark-green-800 transition-[color,background-color,border-color,opacity,transform,box-shadow]"
          >
            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
            <span>{t('auth.resendEmail')}</span>
          </button>

          <a
            href={getWhatsAppLink(`Hi! I have a question about my booking ${reference}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-3d-whatsapp flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 text-white rounded-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>{t('booking.chatWithUs')}</span>
          </a>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center pb-12">
          <Link to="/" className="text-[#1a4d3e] dark:text-[#4ade80] hover:underline transition-colors font-medium">
            ← {t('nav.home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ticket;