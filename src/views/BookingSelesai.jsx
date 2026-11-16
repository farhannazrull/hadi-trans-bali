'use client';

import { Link } from '@/lib/router';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppLink, config } from '../data/config';
import BookingSuccess from '../components/booking/BookingSuccess';

// Dedicated static route so ad platforms (e.g. Google Ads' URL-based conversion tracking) can
// detect a real page load here. Visited right after a real booking it shows the full receipt
// (data comes from BookingContext, which stays mounted across client-side navigation); visited
// cold (a bookmark, or a platform's own verification check) there is no booking in memory, so it
// falls back to a generic thank-you instead of a confusing, data-less receipt.
const BookingSelesai = () => {
  const { bookingReference } = useBooking();
  const { t, tr } = useLanguage();

  const header = (
    <section className="bg-[#06120e] pt-32 pb-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        <h1 className="text-4xl md:text-5xl text-white font-normal" style={{ fontFamily: 'Fraunces, serif' }}>
          {t('nav.bookNow')}
        </h1>
        <p className="text-white/70 mt-3">{tr('Terima kasih, booking Anda sudah kami terima.', 'Thank you, your booking has been received.')}</p>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors pb-20">
      {header}
      <div className="mx-auto w-[92%] max-w-2xl pt-10">
        {bookingReference ? (
          <BookingSuccess />
        ) : (
          <div className="text-center space-y-8 py-12">
            <div className="w-16 h-16 bg-[#1a4d3e]/10 dark:bg-[#4ade80]/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="px-4">
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 dark:text-white mb-3 transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
                {tr('Terima Kasih', 'Thank You')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors">
                {tr('Kami telah menerima permintaan booking Anda. Tim kami akan segera menghubungi Anda lewat WhatsApp.', 'We have received your booking request. Our team will contact you on WhatsApp shortly.')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={getWhatsAppLink('Halo Hadi Trans Bali, saya ingin bertanya soal booking saya.', config.whatsapp.adminNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-whatsapp w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium text-white"
              >
                {tr('Chat dengan Kami', 'Chat With Us')}
              </a>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium border border-gray-200 dark:border-dark-green-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-green-800 transition-colors"
              >
                {tr('Kembali ke Beranda', 'Back to Home')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSelesai;
