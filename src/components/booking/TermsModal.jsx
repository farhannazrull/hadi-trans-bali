'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';

const TermsModal = () => {
  const { showTermsModal, setShowTermsModal } = useBooking();
  const { t, tr } = useLanguage();

  if (!showTermsModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
        onClick={() => setShowTermsModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-dark-green-900 w-full max-w-2xl rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[85vh] transition-colors"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 dark:border-dark-green-800">
            <h3 className="text-xl text-gray-900 dark:text-white" style={{ fontFamily: 'Fraunces, serif' }}>{t('booking.termsTitle')}</h3>
            <button
              onClick={() => setShowTermsModal(false)}
              aria-label={tr('Tutup', 'Close')}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-2 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Hardware Accelerated Scroll */}
          <div 
            className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar overscroll-contain"
            style={{ 
              WebkitOverflowScrolling: 'touch', 
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            {t('booking.termsContent')?.map((term, index) => (
              <div key={index} className="flex gap-4">
                <span className="shrink-0 w-6 text-sm font-medium text-[#c4935f] tabular-nums pt-0.5">{index + 1}</span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base transition-colors">
                  {term}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 dark:bg-dark-green-950 border-t border-gray-100 dark:border-dark-green-800 flex justify-end transition-colors">
            <button
              onClick={() => setShowTermsModal(false)}
              className="btn-3d btn-3d-green-adaptive px-8 py-3 text-white dark:text-gray-900 rounded-xl font-medium"
            >
              {tr('Tutup', 'Close')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TermsModal;
