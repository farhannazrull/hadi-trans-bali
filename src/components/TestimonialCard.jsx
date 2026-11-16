'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const TestimonialCard = ({ testimonial, index = 0 }) => {
  const { language } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white dark:bg-dark-green-900 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-shadow duration-500"
    >
      {/* Quote Mark */}
      <div className="absolute -top-4 left-8">
        <div className="w-12 h-12 bg-[#c4935f] dark:bg-[#b8824d] rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="pt-6 text-left">
        {/* Quote */}
        <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          "{language === 'id' ? testimonial.textId : testimonial.textEn}"
        </blockquote>

        {/* Trip Info */}
        <div className="inline-block px-3 py-1 bg-[#f3ede6] dark:bg-dark-green-800 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 mb-6">
          {language === 'id' ? testimonial.tripId : testimonial.tripEn}
        </div>

        {/* Author */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-dark-green-700">
          <div className="w-14 h-14 bg-[#1a4d3e] dark:bg-dark-green-700 rounded-full flex items-center justify-center text-white font-medium text-lg">
            {testimonial.avatar}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{language === 'id' ? testimonial.dateId : testimonial.dateEn}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
