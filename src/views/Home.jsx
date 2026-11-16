'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/lib/router';
import { motion } from 'framer-motion';
import PackageCard from '../components/PackageCard';
import TestimonialCard from '../components/TestimonialCard';
import FeatureCard from '../components/FeatureCard';
import SectionHeader from '../components/SectionHeader';
import QuickBooking from '../components/QuickBooking';
import SEO from '../components/SEO';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { packages } from '../data/packages';
import { testimonials as staticReviews } from '../data/testimonials';
import { db } from '../config/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { config } from '../data/config';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { language, t } = useLanguage();
  const [featuredTestimonials, setReviews] = useState(staticReviews.filter(t => t.featured));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), where('featured', '==', true), limit(6));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setReviews(snap.docs.map(doc => doc.data()));
        }
      } catch (e) { console.log("Reviews sync skipped:", e.message); }
    };
    fetchReviews();
  }, []);

  return (
    <div className="overflow-hidden">
      <SEO 
        title={language === 'id' ? 'Transport & Tour Bali' : 'Bali Transport & Tour'} 
        description={t('home.heroSubtitle')}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[640px] lg:h-screen lg:min-h-[720px] flex items-start lg:items-center bg-[#06120e]">
        <div className="absolute inset-0">
          <img
            src="/backgrounds/hero-bali-1.webp"
            alt="Pura Ulun Danu Beratan di tepi danau, salah satu destinasi tour Hadi Trans Bali"
            className="w-full h-full object-cover"
            style={{ contentVisibility: 'auto' }}
          />
          <div className="absolute inset-0 bg-[#06120e]/55" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06120e]/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-28 lg:pt-0 pb-[27rem] md:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-normal mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
              {t('home.heroTitle')} <span className="text-[#c4935f]">{t('home.heroTitleAccent')}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/booking" className="btn-3d btn-3d-bronze px-8 py-4 text-white rounded-xl text-lg text-center">
                {t('common.startAdventure')}
              </Link>
              <Link to="/services" className="px-8 py-4 border border-white/30 bg-black/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 transition-colors active:scale-[0.98] text-lg text-center">
                {t('common.exploreTours')}
              </Link>
            </div>
          </motion.div>
        </div>
        <QuickBooking />
      </section>

      {/* Hero fade-out */}
      <div className="h-24 lg:h-32 bg-gradient-to-b from-[#06120e] to-slate-50 dark:to-dark-green-950 transition-colors" />

      {/* About Intro */}
      <section className="py-24 lg:py-32 bg-slate-50 dark:bg-dark-green-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img src="/backgrounds/hero-bali-2.webp" alt="Sawah terasering hijau khas Bali" className="w-full rounded-2xl shadow-lg" />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-dark-green-800 hidden lg:block">
                <img src="/backgrounds/hero-bali-3.webp" alt="Pura Tanah Lot saat matahari terbenam" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[#c4935f] text-sm">{t('home.whoWeAre')}</span>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mt-4 mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
                {t('home.aboutTitle')}<br /><span className="">{t('home.aboutTitleAccent')}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">{t('home.aboutDesc1')}</p>
              <Link to="/about" className="group inline-flex items-center gap-3 text-[#1a4d3e] dark:text-[#4ade80] font-medium">
                <span>{t('home.readOurStory')}</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tour Packages Section (REVERTED) */}
      <section className="py-24 lg:py-32 bg-white dark:bg-dark-green-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow={t('home.whatWeOffer')}
            title={t('home.servicesTitle')}
            subtitle={t('home.servicesSubtitle')}
            className="dark:text-white"
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 3).map((pkg, index) => (
              <PackageCard key={pkg.id} tourPackage={pkg} index={index} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/services#packages"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1a4d3e] text-[#1a4d3e] dark:text-[#4ade80] dark:border-[#4ade80] rounded-xl hover:bg-[#1a4d3e] hover:text-white dark:hover:bg-[#4ade80] dark:hover:text-gray-900 transition-colors duration-300"
            >
              <span>{t('common.viewAllServices')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Hidden Gems Section (Inspired by ss.png) */}
      <section className="relative py-32 lg:py-48 overflow-hidden bg-[#f7fbf9] dark:bg-dark-green-950 transition-colors">
        {/* Floating Images Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Top Left */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-[5%] left-[2%] md:left-[10%] w-24 md:w-72 aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white opacity-60 md:opacity-100"
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          >
            <img src="/gallery/whatsapp-image-2026-01-24-at-19.01.48.webp" className="w-full h-full object-cover" alt="" />
          </motion.div>

          {/* Top Right */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute top-[2%] right-[2%] md:right-[12%] w-20 md:w-64 aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white opacity-60 md:opacity-100"
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          >
            <img src="/gallery/whatsapp-image-2026-01-24-at-19.01.56.webp" className="w-full h-full object-cover" alt="" />
          </motion.div>

          {/* Bottom Left */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 0.5 }}
            className="absolute bottom-[10%] left-[5%] md:left-[15%] w-20 md:w-48 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden sm:block opacity-60 md:opacity-100"
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          >
            <img src="/gallery/whatsapp-image-2026-01-24-at-19.01.51.webp" className="w-full h-full object-cover" alt="" />
          </motion.div>

          {/* Bottom Right */}
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 1.5 }}
            className="absolute bottom-[5%] right-[5%] md:right-[15%] w-32 md:w-80 aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border-4 border-white opacity-60 md:opacity-100"
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          >
            <img src="/gallery/whatsapp-image-2026-01-24-at-19.01.50.webp" className="w-full h-full object-cover" alt="" />
          </motion.div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="text-3xl md:text-6xl text-gray-900 dark:text-white leading-tight mb-8"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              {t('home.leaveTrafficTitle1')}<br className="hidden md:block" />
              {t('home.leaveTrafficTitle2')} <span className="font-semibold text-[#1a4d3e] dark:text-[#4ade80]">{t('home.leaveTrafficTitleAccent')}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('home.leaveTrafficSubtitle')}
            </p>
            <Link
              to="/booking"
              className="btn-3d btn-3d-green-adaptive inline-flex items-center gap-3 px-10 py-5 text-white dark:text-gray-900 text-lg font-medium rounded-2xl"
            >
              <span>{t('home.startAdventureBtn')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>


      {/* Why Us */}
      <section className="py-24 lg:py-32 bg-white dark:bg-dark-green-900 transition-colors" style={{ contentVisibility: 'auto' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <span className="text-[#c4935f] text-sm">{t('home.whyUs')}</span>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mt-4 mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
                {t('home.differenceTitlePrefix')}<br /><span className="">{t('home.differenceTitle')}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{t('home.differenceDesc')}</p>
            </motion.div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {config.features.slice(0, 4).map((feature, index) => (
                <FeatureCard key={feature.id} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (hidden until there are real reviews to show) */}
      {featuredTestimonials.length > 0 && (
        <section className="py-24 lg:py-32 bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors" style={{ contentVisibility: 'auto' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader eyebrow={t('home.travelerStories')} title={t('home.testimonialTitle')} subtitle={t('home.testimonialSubtitle')} className="dark:text-white" />
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
              {t('home.testimonialSource')}
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTestimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/backgrounds/hero-bali-4.webp" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1a4d3e]/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-[#c4935f] text-sm mb-4 block">{t('common.ready')}</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
            {t('home.ctaTitle')}<br /><span className="">{t('home.ctaTitleAccent')}</span>
          </h2>
          <div className="flex justify-center">
            <Link to="/booking" className="btn-3d btn-3d-bronze group inline-flex items-center gap-4 px-10 py-5 text-white text-lg rounded-xl">
              <span>{t('common.bookYourTrip')}</span>
              <span className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      <WhatsAppFloat />
    </div>
  );
};

export default Home;
