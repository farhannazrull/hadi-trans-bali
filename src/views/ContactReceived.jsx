'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '../data/config';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components';
import Link from 'next/link';

const ContactReceived = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="overflow-hidden bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors min-h-screen flex flex-col">
      <SEO
        title={t('contact.receivedTitle') || 'Terima Kasih'}
        description={t('contact.receivedDesc') || 'Kami telah menerima pesan Anda.'}
        url="/contact-received"
      />

      {/* Header band gelap biar navbar teks putih terbaca */}
      <section className="bg-[#1a4d3e] dark:bg-[#0f3528] border-b border-[#c4935f]/20">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl text-[#c4935f] font-light mb-6"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {t('contact.receivedTitle') || 'Terima Kasih'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-[#1a4d3e]/20 dark:text-[#c4935f]/30 max-w-2xl mx-auto leading-relaxed"
          >
            {t('contact.receivedDesc') ||
              'Kami telah menerima pesan Anda. Hadi akan segera menghubungi Anda melalui WhatsApp untuk mengonfirmasi detail reservasi.'}
          </motion.p>
        </div>
      </section>

      {/* Konten */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-center space-y-8"
        >
          <div className="w-16 h-16 bg-[#1a4d3e] dark:bg-[#2d6a54] rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-9 h-9 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={config.whatsapp.defaultMessage ? `https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(config.whatsapp.defaultMessage)}` : `https://wa.me/${config.whatsapp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d btn-3d-whatsapp group inline-flex items-center gap-3 px-8 py-4 text-white text-lg rounded-xl"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat Langsung WhatsApp
            </a>

            <Link
              href="/"
              className="btn-3d btn-3d-bronze group inline-flex items-center gap-3 px-8 py-4 text-white text-lg rounded-xl"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContactReceived;
