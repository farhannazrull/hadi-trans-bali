'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BookingSteps from '../components/booking/BookingSteps';
import Step1Service from '../components/booking/Step1Service';
import Step2Details from '../components/booking/Step2Details';
import Step3Passengers from '../components/booking/Step3Passengers';
import Step4Contact from '../components/booking/Step4Contact';
import Step5Confirm from '../components/booking/Step5Confirm';
import BookingSuccess from '../components/booking/BookingSuccess';
import BookingSummary from '../components/booking/BookingSummary';
import TermsModal from '../components/booking/TermsModal';

const Booking = () => {
  const { currentStep, isBookingComplete, bookingData, resetBooking, resumedDraft } = useBooking();
  const { user, isGuest, loading: authLoading, continueAsGuest } = useAuth();
  const { t, language, tr } = useLanguage();
  const header = (
    <section className="bg-[#06120e] pt-32 pb-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        <h1 className="text-4xl md:text-5xl text-white font-normal" style={{ fontFamily: 'Fraunces, serif' }}>
          {t('nav.bookNow')}
        </h1>
        <p className="text-white/70 mt-3">{tr('Isi detail perjalanan Anda, lalu kirim lewat WhatsApp.', 'Fill in your trip details, then send them via WhatsApp.')}</p>
      </div>
    </section>
  );

  // Safety check for data
  const hasData = !!bookingData;

  useEffect(() => {
    // Force scroll to top when step changes
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Fallback for some mobile browsers
      document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, behavior: 'instant' });
    };

    // Small timeout to ensure step content is rendered before scrolling
    const timeoutId = setTimeout(scrollToTop, 10);
    return () => clearTimeout(timeoutId);
  }, [currentStep, isBookingComplete]);

  useEffect(() => {
    if (!authLoading && !user && !isGuest) continueAsGuest();
  }, [authLoading, user, isGuest, continueAsGuest]);

  // 1. Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] dark:bg-dark-green-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a4d3e]"></div>
      </div>
    );
  }

  // 2. No sign-in: every booking ends in WhatsApp, so a guest session is started automatically
  if (!user && !isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] dark:bg-dark-green-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1a4d3e]"></div>
      </div>
    );
  }

  // 3. Safety Check for data
  if (!hasData) return null;

  // Check if we are resuming a draft
  const isResumed = resumedDraft && currentStep > 1 && !isBookingComplete;

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Service />;
      case 2: return <Step2Details />;
      case 3: return <Step3Passengers />;
      case 4: return <Step4Contact />;
      case 5: return <Step5Confirm />;
      default: return <Step1Service />;
    }
  };

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors pb-20">
        {header}
        <div className="mx-auto w-[92%] max-w-2xl pt-10">
          <BookingSuccess />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors pb-20">
      {header}
      <div className="mx-auto w-[92%] max-w-6xl py-8 md:py-12">
        {/* Progress Steps (Normal Scroll) */}
        <div className="mb-8 border-b border-gray-100 dark:border-dark-green-800 pb-8">
          <BookingSteps />
        </div>

        {/* Resume Notification Card - Informative Slim Version */}
        <AnimatePresence>
          {isResumed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="mb-8 bg-[#fdfcfb] dark:bg-dark-green-900 rounded-2xl p-4 shadow-sm border border-[#1a4d3e]/10 dark:border-dark-green-700 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-full bg-[#1a4d3e]/5 dark:bg-dark-green-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                    {language === 'id' ? 'Melanjutkan draf sebelumnya' : 'Continuing from your draft'}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {language === 'id'
                      ? 'Kami memuat data terakhir Anda agar pemesanan lebih cepat.'
                      : 'We loaded your last inputs to help you book faster.'}
                  </p>
                </div>
              </div>
              <button
                onClick={resetBooking}
                className="w-full sm:w-auto px-4 py-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-[11px] font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h14" />
                </svg>
                {language === 'id' ? 'Hapus & Mulai Baru' : 'Clear & Start Over'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start relative">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            {renderStep()}
          </div>

          {/* Sidebar Summary (Sticky on Desktop) */}
          <aside className="lg:sticky lg:top-28 z-10 self-start h-fit">
            <BookingSummary />
          </aside>
        </div>
      </div>
      <TermsModal />
    </div>
  );
};

export default Booking;
