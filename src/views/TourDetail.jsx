'use client';

import { useState, useEffect } from 'react';
import { useLastSegment, useNavigate, Link } from '@/lib/router';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, limit, query, where } from 'firebase/firestore';
import { packages as staticPackages, getPackageById as getStaticPackageById } from '../data/packages';
import { getWhatsAppLink } from '../data/config';
import { SEO } from '../components';

const TourDetail = () => {
  const id = useLastSegment();
  const navigate = useNavigate();
  const { language, t, tr } = useLanguage();
  const { updateBooking, resetBooking } = useBooking();
  const { formatPrice } = useCurrency();
  
  const [tour, setTour] = useState(getStaticPackageById(id)); // Default to static
  const [otherTours, setOtherTours] = useState(staticPackages.filter(p => p.id !== parseInt(id)).slice(0, 3));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'packages', id));
        if (docSnap.exists()) {
          const dbData = docSnap.data();
          setTour(dbData);
          
          // Fetch recommendations from DB
          const q = query(collection(db, 'packages'), where('id', '!=', parseInt(id)), limit(3));
          const otherSnap = await getDocs(q);
          if (!otherSnap.empty) {
            setOtherTours(otherSnap.docs.map(d => d.data()));
          }
        }
      } catch (error) {
        console.log("Background sync skipped for tour detail:", error.message);
      }
      setLoading(false);
    };
    fetchTourData();
  }, [id]);

  // Helper to get localized text
  const getText = (field) => {
    if (typeof field === 'object' && field !== null) {
      return field[language] || field.en || field.id || '';
    }
    return field || '';
  };

  const getArray = (field) => {
    if (typeof field === 'object' && field !== null && !Array.isArray(field)) {
      return field[language] || field.en || field.id || [];
    }
    return field || [];
  };

  // Handle booking
  const handleBook = () => {
    resetBooking();
    updateBooking({
      serviceType: 'tour-package',
      selectedPackage: tour,
    });
    navigate('/booking');
  };

  // If tour not found
  if (!tour && !loading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 pt-32 pb-20 flex items-center justify-center transition-colors">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
            {language === 'id' ? 'Tour Tidak Ditemukan' : 'Tour Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {language === 'id' 
              ? 'Maaf, paket tour yang Anda cari tidak tersedia.' 
              : 'Sorry, the tour package you are looking for is not available.'}
          </p>
          <Link
            to="/services#packages"
            className="btn-3d btn-3d-green-adaptive inline-flex items-center gap-2 px-6 py-3 text-white dark:text-gray-900 rounded-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>{language === 'id' ? 'Lihat Semua Tour' : 'View All Tours'}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Still loading and no initial static data
  if (!tour && loading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 flex items-center justify-center transition-colors">
        <div className="animate-spin w-8 h-8 border-4 border-[#1a4d3e] dark:border-[#4ade80] border-t-transparent rounded-full" />
      </div>
    );
  }

  const title = getText(tour.title);
  const description = getText(tour.description);
  const duration = getText(tour.duration);
  const hours = getText(tour.hours);
  const highlights = getArray(tour.highlights);
  const destinations = tour.destinations || [];

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors">
      <SEO 
        title={title}
        description={description}
        image={tour.image}
        url={`/tour/${tour.id}`}
      />
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={tour.image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fdfcfb] dark:from-dark-green-950 to-transparent" />
        </div>
        
        {/* Back Button */}
        <Link
          to="/services#packages"
          className="absolute top-24 left-6 lg:left-12 z-10 flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span className="font-medium">{language === 'id' ? 'Kembali' : 'Back'}</span>
        </Link>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12 pb-20">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm">
              {duration}
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm">
              {hours}
            </span>
            {tour.isOutOfTown && (
              <span className="px-4 py-1.5 bg-[#c4935f] rounded-xl text-white text-sm">
                {t('packages.filterOutOfTown')}
              </span>
            )}
          </div>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl text-white font-light"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {title}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16 bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4 transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
                  {language === 'id' ? 'Tentang Tour Ini' : 'About This Tour'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed transition-colors">{description}</p>
              </div>

              {/* Destinations & Itinerary */}
              <div>
                <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6 transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
                  {language === 'id' ? 'Destinasi & Itinerary' : 'Destinations & Itinerary'}
                </h2>
                <div className="space-y-4">
                  {destinations.map((dest, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#1a4d3e] dark:bg-[#4ade80] rounded-full flex items-center justify-center text-white dark:text-gray-900 font-semibold transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-gray-900 dark:text-white font-medium transition-colors">{dest}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Map */}
              {tour.mapUrl && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6 transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
                    {language === 'id' ? 'Peta Rute Perjalanan' : 'Tour Route Map'}
                  </h2>
                  <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-dark-green-700 transition-colors">
                    <iframe
                      src={tour.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={tr('Rute perjalanan', 'Tour route')}
                    ></iframe>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 transition-colors">
                    {language === 'id' 
                      ? '* Rute dapat berubah menyesuaikan kondisi lalu lintas atau permintaan tamu.' 
                      : '* Route may change depending on traffic conditions or guest requests.'}
                  </p>
                </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6 transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
                    {language === 'id' ? 'Highlight' : 'Highlights'}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {highlights.map((highlight, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-[#f3ede6] dark:bg-dark-green-900 text-[#1a4d3e] dark:text-[#4ade80] rounded-xl text-sm font-medium transition-colors"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included */}
              <div>
                <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6 transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
                  {language === 'id' ? 'Termasuk dalam Paket' : "What's Included"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { 
                      icon: (
                        <svg className="w-6 h-6 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                      ), 
                      text: language === 'id' ? 'Kendaraan Pribadi' : 'Private Vehicle' 
                    },
                    { 
                      icon: (
                        <svg className="w-6 h-6 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      ), 
                      text: language === 'id' ? 'Driver Berpengalaman' : 'Experienced Driver' 
                    },
                    { 
                      icon: (
                        <svg className="w-6 h-6 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                        </svg>
                      ), 
                      text: language === 'id' ? 'BBM & Parkir' : 'Fuel & Parking' 
                    },
                    { 
                      icon: (
                        <svg className="w-6 h-6 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ), 
                      text: language === 'id' ? 'Air Mineral' : 'Mineral Water' 
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-dark-green-900 rounded-xl border border-gray-100 dark:border-dark-green-700 transition-colors">
                      <span>{item.icon}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Not Included */}
              <div>
                <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4 transition-colors" style={{ fontFamily: 'Fraunces, serif' }}>
                  {language === 'id' ? 'Tidak Termasuk' : 'Not Included'}
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 transition-colors">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {language === 'id' ? 'Tiket masuk objek wisata' : 'Entrance tickets'}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {language === 'id' ? 'Makan & minum' : 'Meals & drinks'}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {language === 'id' ? 'Pengeluaran pribadi' : 'Personal expenses'}
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 lg:top-36 bg-white dark:bg-dark-green-900 rounded-2xl border border-gray-100 dark:border-dark-green-700 shadow-lg p-6 space-y-6 transition-colors">
                {/* Price */}
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    {tour.startingPrice ? (language === 'id' ? 'Mulai dari' : 'Starting from') : ''}
                  </span>
                  <div className="text-3xl font-semibold text-[#1a4d3e] dark:text-[#4ade80] transition-colors">
                    {tour.startingPrice ? formatPrice(tour.startingPrice) : t('packages.priceByAgreement')}
                  </div>
                  {tour.startingPrice && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                      {language === 'id' ? 'per hari / per mobil' : 'per day / per car'}
                    </span>
                  )}
                  <p className="text-xs text-[#c4935f] mt-2 transition-colors">
                    {language === 'id' 
                      ? '* Belum termasuk tiket masuk wisata' 
                      : '* Excludes entrance tickets'}
                  </p>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBook}
                  className="btn-3d btn-3d-green-adaptive w-full py-4 text-white dark:text-dark-green-950 rounded-xl font-medium"
                >
                  {t('common.bookNow')}
                </button>

                {/* WhatsApp Button */}
                <a
                  href={getWhatsAppLink(`Hi! I'm interested in ${title} tour.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 border-2 border-[#25D366] text-[#25D366] rounded-xl font-medium hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>{language === 'id' ? 'Chat WhatsApp' : 'Chat on WhatsApp'}</span>
                </a>

                {/* Quick Info */}
                <div className="pt-4 border-t border-gray-100 dark:border-dark-green-700 space-y-3 text-sm transition-colors">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{hours}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{destinations.length} {language === 'id' ? 'destinasi' : 'destinations'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{language === 'id' ? 'Untuk 1-7 orang' : 'For 1-7 people'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Tours */}
      <section className="py-16 bg-[#f3ede6] dark:bg-dark-green-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 
            className="text-3xl font-light text-gray-900 dark:text-white mb-8 text-center transition-colors"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {language === 'id' ? 'Tour Lainnya' : 'Other Tours'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherTours.map((pkg) => {
              const pkgTitle = getText(pkg.title);
              const pkgDuration = getText(pkg.duration);
              
              return (
                <Link
                  key={pkg.id}
                  to={`/tour/${pkg.id}`}
                  className="group bg-white dark:bg-dark-green-950 rounded-2xl overflow-hidden hover:shadow-lg transition-[color,background-color,border-color,opacity,transform,box-shadow] border border-transparent dark:border-dark-green-800"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkgTitle}
                      className="w-full h-full object-cover transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{pkgDuration}</span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-[#1a4d3e] dark:group-hover:text-[#4ade80] transition-colors">
                      {pkgTitle}
                    </h3>
                    <p className="text-[#1a4d3e] dark:text-[#4ade80] font-semibold mt-2">
                      {pkg.startingPrice ? formatPrice(pkg.startingPrice) : t('packages.priceByAgreement')}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourDetail;