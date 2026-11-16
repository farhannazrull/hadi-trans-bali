'use client';

import { useEffect, useState } from 'react';
import { useLocation, Link } from '@/lib/router';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader, PackageCard, SEO, TripCalculator, FeatureCard } from '../components';
import { fleet as staticFleet } from '../data/services';
import { packages as staticPackages } from '../data/packages';
import { getWhatsAppLink } from '../data/config';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

const Services = () => {
  const location = useLocation();
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeFilter, setActiveFilter] = useState('all');
  const [packages, setPackages] = useState(staticPackages);
  const [fleet, setFleet] = useState(staticFleet);
  const [activeSection, setActiveSection] = useState('packages');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Packages
        const pkgSnap = await getDocs(query(collection(db, 'packages'), orderBy('id', 'asc')));
        if (!pkgSnap.empty) setPackages(pkgSnap.docs.map(doc => doc.data()));

        // Fetch Fleet
        const fleetSnap = await getDocs(query(collection(db, 'fleet'), orderBy('id', 'asc')));
        if (!fleetSnap.empty) setFleet(fleetSnap.docs.map(doc => doc.data()));
      } catch (error) {
        console.log("Background sync skipped:", error.message);
      }
    };
    fetchData();
  }, []);

  const filters = [
    { id: 'all', label: t('packages.filterAll') },
    { id: 'full', label: t('packages.filterFullDay') },
    { id: 'half', label: t('packages.filterHalfDay') },
    { id: 'special', label: t('packages.filterSpecial') },
    { id: 'outoftown', label: t('packages.filterOutOfTown') },
  ];

  const filteredPackages = (packages || []).filter(pkg => {
    // Always classify against the English copy: duration/difficulty are display text that
    // changes with the UI language, but "full"/"half"/"early" here are category keywords, not
    // something to translate.
    const duration = (typeof pkg.duration === 'object' ? (pkg.duration?.en || '') : (pkg.duration || '')).toLowerCase();
    const difficulty = (typeof pkg.difficulty === 'object' ? (pkg.difficulty?.en || '') : (pkg.difficulty || '')).toLowerCase();
    
    if (activeFilter === 'all') return true;
    if (activeFilter === 'full') return duration.includes('full') && !pkg.isOutOfTown;
    if (activeFilter === 'half') return duration.includes('half');
    if (activeFilter === 'special') return duration.includes('early') || difficulty.includes('hard');
    if (activeFilter === 'outoftown') return pkg.isOutOfTown === true;
    return true;
  });

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Highlight whichever quick-nav tab matches the section currently in view.
  useEffect(() => {
    const sections = ['packages', 'fleet']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Prefer the entry closest to the top of the viewport.
          const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActiveSection(top.target.id);
        }
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors">
      <SEO 
        title={language === 'id' ? 'Paket Tour Hadi Trans Bali' : 'Hadi Trans Bali Tour Packages'}
        description={t('services.subtitle')}
        url="/services"
      />
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <img
            src="/backgrounds/hero-bali-5.webp"
            alt="Bali Temple"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fdfcfb] dark:from-dark-green-950 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-[#c4935f] text-sm mb-6">
              {t('nav.services')}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white font-light mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
              {language === 'id' ? 'Paket Tour' : 'Tour Packages'}<br />
              <span className="text-[#c4935f]">Hadi Trans Bali</span>
            </h1>
            <p className="text-xl text-white/95 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Nav */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="sticky top-24 lg:top-32 z-30 py-4 mb-12"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-center">
          <div className="inline-flex items-center bg-white/90 dark:bg-dark-green-950/90 rounded-xl shadow-lg border border-gray-100 dark:border-dark-green-700 p-2 px-3 sm:px-4 gap-1 sm:gap-2">
            <a
              href="#packages"
              onClick={() => setActiveSection('packages')}
              aria-current={activeSection === 'packages' ? 'true' : undefined}
              className={`relative px-2.5 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === 'packages'
                  ? 'bg-gray-100 dark:bg-dark-green-800 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('packages.title')}
            </a>
            <a
              href="#fleet"
              onClick={() => setActiveSection('fleet')}
              aria-current={activeSection === 'fleet' ? 'true' : undefined}
              className={`relative px-2.5 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === 'fleet'
                  ? 'bg-gray-100 dark:bg-dark-green-800 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('services.fleetTitle')}
            </a>
            <span className="w-px h-6 bg-gray-200 dark:bg-dark-green-700 mx-0.5" aria-hidden="true" />
            <Link to="/booking" className="btn-3d btn-3d-green inline-flex items-center px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap text-white">
              <span>{t('common.bookNow')}</span>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Tour Packages Section */}
      <section id="packages" className="py-16 lg:py-24 bg-[#fdfcfb] dark:bg-dark-green-950 scroll-mt-32 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader eyebrow={t('packages.title')} title={t('packages.heroTitle')} subtitle={t('packages.heroSubtitle')} className="dark:text-white" />
          
          <div className="flex flex-wrap justify-center gap-3 mt-12 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors ${activeFilter === filter.id ? 'bg-[#1a4d3e] text-white' : 'bg-white dark:bg-dark-green-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => (
              <PackageCard key={pkg.id} tourPackage={pkg} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Trip Calculator Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-dark-green-900 transition-colors" style={{ contentVisibility: 'auto' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow={language === 'id' ? 'Kalkulator Custom' : 'Custom Calculator'}
            title={language === 'id' ? 'Buat Rencana Trip Anda' : 'Build Your Own Trip'}
            subtitle={language === 'id' 
              ? 'Bingung dengan paket yang ada? Pilih sendiri destinasi Anda dan lihat estimasi harganya langsung.' 
              : 'Can\'t find the perfect package? Choose your own destinations and see the price instantly.'}
            className="dark:text-white"
          />
          <div className="mt-16">
            <TripCalculator noCard={true} />
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-24 lg:py-32 bg-white dark:bg-dark-green-900 scroll-mt-32 transition-colors" style={{ contentVisibility: 'auto' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader eyebrow={t('services.fleetTitle')} title={language === 'id' ? 'Armada Kami' : 'Our Fleet'} subtitle={t('services.fleetSubtitle')} className="dark:text-white" />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fleet.map((vehicle, index) => (
              <motion.div 
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#fdfcfb] dark:bg-dark-green-950 rounded-3xl overflow-hidden border border-gray-100 dark:border-dark-green-700 hover:shadow-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 group"
                style={{ transform: 'translateZ(0)' }}
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-dark-green-900 p-4">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-contain transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{language === 'id' && vehicle.nameId ? vehicle.nameId : vehicle.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{language === 'id' && vehicle.capacityId ? vehicle.capacityId : vehicle.capacity}</p>
                  <div className="space-y-2">
                    {vehicle.pricing.map((price, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-dark-green-700 last:border-0 font-medium">
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{price.hours} {t('common.hours')}</span>
                        <span className="text-[#1a4d3e] dark:text-[#4ade80]">{formatPrice(price.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Banner */}
      <section className="py-20 bg-white dark:bg-dark-green-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 dark:text-white" style={{ fontFamily: 'Fraunces, serif' }}>
              {t('packages.everyTourIncludes')}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[ 
              { icon: (
                <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              ), text: t('packages.privateVehicle') },
              { icon: (
                <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ), text: t('packages.englishDriver') },
              { icon: (
                <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
              ), text: t('packages.fuelParking') },
              { icon: (
                <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ), text: t('packages.bottledWater') },
              { icon: (
                <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              ), text: t('packages.hotelPickup') },
              { icon: (
                <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              ), text: t('packages.photoAssistance') },
              { icon: (
                <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              ), text: t('packages.flexibleSchedule') },
              { icon: (
                <svg className="w-8 h-8 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              ), text: t('packages.localTips') },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3 text-[#1a4d3e] dark:text-[#4ade80] transition-colors">{item.icon}</div>
                <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Request Section */}
      <section className="py-24 lg:py-32 bg-white dark:bg-dark-green-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative bg-[#1a4d3e] rounded-3xl overflow-hidden shadow-lg">
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 p-12 lg:p-16 items-center">
              <div>
                <span className="inline-block text-[#c4935f] text-sm mb-4">
                  {t('services.somethingSpecial')}
                </span>
                <h2 className="text-4xl lg:text-5xl text-white font-light mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
                  {t('services.cantFind')}<br />
                  <span className="">{t('services.lookingFor')}</span>
                </h2>
                <p className="text-white/70 text-lg mb-8">{t('services.specialRequestDesc')}</p>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-3d btn-3d-bronze group inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl">
                  <span>{t('common.chatWhatsApp')}</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[ 
                  { 
                    icon: (
                      <svg className="w-8 h-8 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    ), 
                    title: t('services.customRoutes'), 
                    desc: t('services.customRoutesDesc') 
                  }, 
                  { 
                    icon: (
                      <svg className="w-8 h-8 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    ), 
                    title: t('services.groupTravel'), 
                    desc: t('services.groupTravelDesc') 
                  },
                  { 
                    icon: (
                      <svg className="w-8 h-8 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    ), 
                    title: t('services.multiDayTrips'), 
                    desc: t('services.multiDayTripsDesc') 
                  },
                  { 
                    icon: (
                      <svg className="w-8 h-8 text-[#c4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                      </svg>
                    ), 
                    title: t('services.specialEvents'), 
                    desc: t('services.specialEventsDesc') 
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-colors border border-white/10">
                    <div className="mb-3">{item.icon}</div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/60 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 lg:py-32 bg-[#f3ede6] dark:bg-dark-green-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader eyebrow={t('services.howItWorks')} title={t('services.bookingSimple')} subtitle={t('services.bookingSimpleDesc')} className="dark:text-white" />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[ 
              { step: '01', title: t('services.step1'), desc: t('services.step1Desc') },
              { step: '02', title: t('services.step2'), desc: t('services.step2Desc') },
              { step: '03', title: t('services.step3'), desc: t('services.step3Desc') },
            ].map((item, index) => (
              <motion.div 
                key={item.step} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-7xl font-light text-[#c4935f]/20 mb-4" style={{ fontFamily: 'Fraunces, serif' }}>{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-[#c4935f]/30 z-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
