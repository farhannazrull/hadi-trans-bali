'use client';

import { useNavigate } from '@/lib/router';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

const PackageCard = ({ tourPackage, index = 0, variant = 'default' }) => {
  const navigate = useNavigate();
  const { updateBooking, resetBooking } = useBooking();
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();

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

  const handleBookPackage = () => {
    resetBooking();
    updateBooking({
      serviceType: 'tour-package',
      selectedPackage: tourPackage,
    });
    navigate('/booking');
  };

  const handleViewDetail = () => {
    navigate(`/tour/${tourPackage.id}`);
  };

  const renderPrice = () => {
    if (tourPackage.startingPrice === null) {
      return <span className="text-[#c4935f]">{t('packages.priceByAgreement')}</span>;
    }
    return formatPrice(tourPackage.startingPrice);
  };

  const title = getText(tourPackage.title);
  const description = getText(tourPackage.description);
  const duration = getText(tourPackage.duration);
  const hours = getText(tourPackage.hours);
  const highlights = getArray(tourPackage.highlights);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: index * 0.1 }
    }
  };

  // Large featured card (for homepage featured section)
  if (variant === 'featured') {
    return (
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-xl" 
        onClick={handleViewDetail}
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="relative h-[500px] lg:h-[600px]">
          <img
            src={tourPackage.image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
            loading="lazy"
            style={{ backfaceVisibility: 'hidden' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm">
              <span className="text-sm font-medium text-gray-900">{duration}</span>
              <span className="text-sm text-gray-500 ml-2">· {hours}</span>
            </div>
            {tourPackage.isOutOfTown && (
              <div className="px-4 py-2 bg-[#c4935f] rounded-xl shadow-sm">
                <span className="text-sm font-medium text-white">{t('packages.filterOutOfTown')}</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 
              className="text-3xl lg:text-4xl text-white font-light mb-3"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              {title}
            </h3>
            <p className="text-white/80 line-clamp-2 max-w-lg mb-4">{description}</p>

            {/* Highlights/Features */}
            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {highlights.slice(0, 4).map((highlight, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-xl text-sm text-white/90 border border-white/10">
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/60 text-sm">{tourPackage.startingPrice ? t('packages.startingFrom') : ''}</span>
                <p className="text-2xl text-white font-semibold">{renderPrice()}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleBookPackage(); }}
                className="btn-3d btn-3d-bronze group/btn inline-flex items-center gap-3 px-6 py-3 text-white rounded-xl"
              >
                <span>{t('common.bookNow')}</span>
                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default card - same style as featured but smaller (for grid layouts)
  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 transition-transform duration-300 hover:-translate-y-2" 
      onClick={handleViewDetail}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="relative h-[380px] md:h-[420px]">
        <img
          src={tourPackage.image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
          loading="lazy"
          style={{ backfaceVisibility: 'hidden' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Duration Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="px-3 py-1.5 bg-white dark:bg-dark-green-950 rounded-xl shadow-sm">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{duration}</span>
          </div>
          {tourPackage.isOutOfTown && (
            <div className="px-3 py-1.5 bg-[#c4935f] rounded-xl shadow-sm">
              <span className="text-xs font-medium text-white">{t('packages.filterOutOfTown')}</span>
            </div>
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 
            className="text-xl md:text-2xl text-white font-light mb-2"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {title}
          </h3>
          
          {/* Short Description */}
          <p className="text-white/70 text-xs line-clamp-2 mb-3 leading-relaxed">{description}</p>
          
          {/* Highlights/Features */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {highlights.slice(0, 3).map((highlight, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/10 rounded border border-white/5 text-[11px] text-white/90">
                  {highlight}
                </span>
              ))}
              {highlights.length > 3 && (
                <span className="px-2 py-0.5 bg-white/10 rounded text-[11px] text-white/90">
                  +{highlights.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white/50 text-[11px]">{tourPackage.startingPrice ? t('packages.startingFrom') : ''}</span>
              <p className="text-lg text-white font-semibold tracking-tight">{renderPrice()}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleBookPackage(); }}
              className="btn-3d btn-3d-bronze-adaptive w-10 h-10 rounded-full flex items-center justify-center text-white dark:text-gray-900 group/btn"
            >
              <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
