'use client';

import { useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { useLanguage } from '../context/LanguageContext';

const InstagramLive = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Load Elfsight platform script
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional: Cleanup script if necessary
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          eyebrow="Instagram"
          title={language === 'id' ? 'Momen Terbaru' : 'Live Moments'}
          subtitle={language === 'id' 
            ? 'Ikuti perjalanan seru kami bersama tamu-tamu Hadi Trans Bali setiap harinya di Instagram.' 
            : 'Follow our exciting daily journeys with Hadi Trans Bali guests on Instagram.'}
        />

        <div className="mt-16 bg-[#fdfcfb] rounded-3xl p-4 md:p-8 border border-gray-100 min-h-[400px] flex flex-col items-center justify-center relative">
          {/* 
            Catatan: Widget di bawah menggunakan placeholder ID.
            Untuk mengaktifkan akun asli @haditransbali:
            1. Daftar di elfsight.com
            2. Buat "Instagram Feed" widget.
            3. Ambil ID widget-nya dan ganti class 'elfsight-app-...' di bawah.
          */}
          <div 
            className="elfsight-app-66666666-1111-4444-8888-000000000000 w-full" 
            data-elfsight-app-lazy
          >
            {/* Fallback info if widget doesn't load or is still in setup */}
            <div className="text-center space-y-6 py-12">
              <div className="w-20 h-20 bg-[#1a4d3e] rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">@haditransbali</h4>
                <p className="text-gray-500 mb-6 text-sm">
                  {language === 'id' 
                    ? 'Klik tombol di bawah untuk melihat update perjalanan harian kami langsung di Instagram.' 
                    : 'Click the button below to see our daily journey updates directly on Instagram.'}
                </p>
                <a 
                  href="https://instagram.com/haditransbali" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-3d btn-3d-green inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium"
                >
                  View Feed on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramLive;
