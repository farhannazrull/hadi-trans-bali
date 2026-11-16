'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FeatureCard, SectionHeader, SEO } from '../components';
import { getWhatsAppLink, config } from '../data/config';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Gallery images - replace with actual photos
  const galleryImages = [
    { src: '/gallery/photo-2026-01-24-19-01-44.webp', alt: 'Hadi Trans Guest', caption: language === 'id' ? 'Tamu bahagia bersama Hadi Trans' : 'Happy guests with Hadi Trans' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.44.webp', alt: 'Bali Trip', caption: '' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.47.webp', alt: 'Bali Trip', caption: '' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.48.webp', alt: 'Bali Trip', caption: language === 'id' ? 'Perjalanan ke destinasi indah' : 'Trip to beautiful destinations' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.49.webp', alt: 'Bali Trip', caption: '' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.50.webp', alt: 'Bali Trip', caption: language === 'id' ? 'Momen tak terlupakan' : 'Unforgettable moments' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.51.webp', alt: 'Bali Trip', caption: '' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.56.webp', alt: 'Bali Trip', caption: '' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.58.webp', alt: 'Bali Trip', caption: '' },
    { src: '/gallery/whatsapp-image-2026-01-24-at-19.01.46.webp', alt: 'Bali Trip', caption: '' },
  ];

  const values = [
    { id: 1, title: t('about.safetyFirst'), description: t('about.safetyFirstDesc'), icon: "ShieldCheckIcon" },
    { id: 2, title: t('about.localHeart'), description: t('about.localHeartDesc'), icon: "HeartIcon" },
    { id: 3, title: t('about.yourPace'), description: t('about.yourPaceDesc'), icon: "ClockIcon" },
    { id: 4, title: t('about.realPrices'), description: t('about.realPricesDesc'), icon: "CurrencyDollarIcon" },
  ];

  const timeline = [
    { year: t('about.year2019'), title: t('about.title2019'), desc: t('about.desc2019') },
    { year: t('about.year2020'), title: t('about.title2020'), desc: t('about.desc2020') },
    { year: t('about.year2021'), title: t('about.title2021'), desc: t('about.desc2021') },
    { year: t('about.year2023'), title: t('about.title2023'), desc: t('about.desc2023') },
    { year: t('about.yearNow'), title: t('about.titleNow'), desc: t('about.descNow') },
  ];

  return (
    <div className="overflow-hidden bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors">
      <SEO 
        title={t('about.tagline')}
        description={t('about.heroSubtitle')}
        url="/about"
      />
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <img
            src="/backgrounds/hero-bali-2.webp"
            alt="Bali Waterfall"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fdfcfb] dark:from-dark-green-950 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block text-[#c4935f] text-sm mb-6"
            >
              {t('about.tagline')}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-light mb-6"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              {t('about.title')}<br />
              <span className="">{t('about.titleAccent')}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/95 max-w-2xl mx-auto"
            >
              {t('about.heroSubtitle')}
            </motion.p>
          </div>
        </div>

        {/* White Fade Separator */}
      </section>

      {/* Story Section */}
      <section className="py-24 lg:py-32 bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Images Collage */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-48">
                    <img
                      src="/tours/ubud.webp"
                      alt="Ubud Bali"
                      className="w-full h-full object-cover transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-64">
                    <img
                      src="/tours/uluwatu.webp"
                      alt="Uluwatu Temple"
                      className="w-full h-full object-cover transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden h-64">
                    <img
                      src="/tours/kintamani.webp"
                      alt="Kintamani Volcano"
                      className="w-full h-full object-cover transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-48">
                    <img
                      src="/tours/bedugul.webp"
                      alt="Bedugul Temple"
                      className="w-full h-full object-cover transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              
              {/* Stats Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="card-3d card-3d-green absolute -bottom-6 left-1/2 -translate-x-1/2 text-white dark:text-gray-900 px-8 py-6 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-light">200+</div>
                    <div className="text-sm text-white/70 dark:text-gray-800">{t('about.happyGuests')}</div>
                  </div>
                  <div className="w-px h-12 bg-white/20 dark:bg-black/10" />
                  <div className="text-center">
                    <div className="text-3xl font-light">5+</div>
                    <div className="text-sm text-white/70 dark:text-gray-800">{t('about.years')}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#c4935f] text-sm font-semibold">{t('about.whoWeAre')}</span>
              <h2 
                className="text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mt-4 mb-6"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                {t('about.theRealStory')} <span className="">{t('about.theRealStoryAccent')}</span>
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  {t('about.storyP1')}
                </p>
                <p>
                  {t('about.storyP2')}
                </p>
                <p>
                  {t('about.storyP3')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-24 lg:py-32 bg-white dark:bg-dark-green-900 transition-colors" style={{ contentVisibility: 'auto' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow={t('about.meetTeam')}
            title={t('about.teamTitle')}
            subtitle={t('about.teamSubtitle')}
            className="dark:text-white"
          />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Team Photo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden group">
                <img
                  src="/image/driver-profile.webp"
                  alt="Hadi Trans Bali Team"
                  className="w-full max-w-md lg:max-w-none mx-auto aspect-[3/4] object-cover object-top transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 rounded-2xl p-6 border border-white/20"
                  >
                    <h3 className="text-3xl text-white font-light" style={{ fontFamily: 'Fraunces, serif' }}>
                      {t('about.teamTitle')}
                    </h3>
                    <p className="text-white/80 mt-1">{t('about.teamRole')}</p>
                    <p className="text-white/70 text-sm mt-4">{t('about.teamQuote')}</p>
                  </motion.div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[ 
                  { value: t('about.teamExperience'), label: t('about.teamExperienceLabel') },
                  { value: t('about.teamTrips'), label: t('about.teamTripsLabel') },
                  { value: t('about.teamLanguages'), label: t('about.teamLanguagesLabel') },
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="bg-[#f3ede6] dark:bg-dark-green-800 rounded-2xl p-3 sm:p-4 text-center overflow-hidden transition-colors"
                  >
                    <div className="text-base sm:text-xl font-semibold text-[#1a4d3e] dark:text-[#4ade80] truncate">{stat.value}</div>
                    <div className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 mt-1 leading-tight">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Team Bio */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed text-justify">
                <p>{t('about.teamBio1')}</p>
                <p>{t('about.teamBio2')}</p>
                <p>{t('about.teamBio3')}</p>
              </div>

              <div className="mt-10 bg-[#fdfcfb] dark:bg-dark-green-950 rounded-2xl p-8 border border-gray-100 dark:border-dark-green-700 transition-colors">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t('about.personalTouch')}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{t('about.personalTouchDesc')}</p>

                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">{t('about.whyOurTeam')}</h5>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {[ 
                    t('about.whyOurTeam1'),
                    t('about.whyOurTeam2'),
                    t('about.whyOurTeam3'),
                    t('about.whyOurTeam4'),
                  ].map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                      className="flex items-start gap-3"
                    >
                      <svg className="w-4 h-4 mt-1.5 shrink-0 text-[#c4935f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a
                    href={getWhatsAppLink("Hi Hadi Trans! I'd like to plan a trip with your team.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d btn-3d-green-adaptive group inline-flex items-center gap-3 px-8 py-4 text-white dark:text-gray-900 rounded-xl"
                  >
                    <span>{t('about.sayHello')}</span>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 bg-white dark:bg-dark-green-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow={t('about.whatWeStandFor')}
            title={t('about.ourValues')}
            subtitle={t('about.valuesSubtitle')}
            className="dark:text-white"
          />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {values.map((value, index) => (
              <div key={value.id} className="flex h-full">
                <FeatureCard feature={value} index={index} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-32 bg-[#f3ede6] dark:bg-dark-green-950 transition-colors">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow={t('about.ourJourney')}
            title={t('about.howWeGotHere')}
            className="dark:text-white"
          />
          <div className="mt-16 relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#c4935f]/30 hidden md:block" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-0 md:pl-24"
                >
                  {/* Year Badge */}
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-[#c4935f] rounded-full items-center justify-center text-white font-semibold shadow-lg">
                    {item.year}
                  </div>
                  
                  <div className="bg-white dark:bg-dark-green-900 rounded-2xl p-8 shadow-sm transition-colors hover:shadow-md border border-gray-100 dark:border-dark-green-800">
                    <div className="md:hidden text-[#c4935f] font-semibold mb-2">{item.year}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-24 lg:py-32 bg-white dark:bg-dark-green-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow={t('about.whyTrustUs')}
            title={t('about.peaceOfMind')}
            className="dark:text-white"
          />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75l2.25 2.25L15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: t('about.licensedInsured'),
                desc: t('about.licensedInsuredDesc')
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: t('about.maintainedVehicles'),
                desc: t('about.maintainedVehiclesDesc')
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-[#1a4d3e] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: t('about.support247'),
                desc: t('about.support247Desc')
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex gap-6 p-8 bg-[#f3ede6] dark:bg-dark-green-900 rounded-2xl border border-transparent dark:border-dark-green-700 transition-[color,background-color,border-color,opacity,transform,box-shadow] hover:shadow-md"
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 lg:py-32 bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            eyebrow={language === 'id' ? 'Galeri' : 'Gallery'}
            title={language === 'id' ? 'Momen Bersama Tamu' : 'Moments with Our Guests'}
            subtitle={language === 'id' 
              ? 'Dokumentasi perjalanan bersama tamu-tamu kami dari berbagai negara' 
              : 'Journey documentation with our guests from around the world'}
            className="dark:text-white"
          />
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryImages.map((image, index) => {
              // Advanced Bento-style grid logic for 10 images
              let spanClass = "md:col-span-1 md:row-span-1";
              if (index === 0) spanClass = "md:col-span-2 md:row-span-2"; // Feature Large
              if (index === 2) spanClass = "md:col-span-1 md:row-span-2"; // Tall
              if (index === 5) spanClass = "md:col-span-2 md:row-span-1"; // Wide
              if (index === 6) spanClass = "md:col-span-1 md:row-span-2"; // Tall

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl group ${spanClass} shadow-sm hover:shadow-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 flex items-end p-5">
                    {image.caption && (
                      <p className="text-white text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {image.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <a 
              href={config.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#1a4d3e] dark:hover:text-[#4ade80] transition-colors group"
            >
              <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">
                {language === 'id' 
                  ? 'Lihat lebih banyak momen di Instagram @haditransbali' 
                  : 'See more moments on Instagram @haditransbali'}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/backgrounds/hero-bali-4.webp"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#1a4d3e]/85" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-white font-light mb-6"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {t('about.readyToMeet')}<br />
            <span className="">{t('about.yourNewFriends')}</span>
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            {t('about.ctaDesc')}
          </p>
          <a
            href={getWhatsAppLink("Hi! I'd love to learn more about your services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-3d-bronze group inline-flex items-center gap-4 px-10 py-5 text-white text-lg rounded-xl"
          >
            <span>{t('about.sayHello')}</span>
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;