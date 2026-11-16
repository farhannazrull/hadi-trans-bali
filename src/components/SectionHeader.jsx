'use client';

import { motion } from 'framer-motion';

const SectionHeader = ({
  eyebrow,
  title, 
  subtitle, 
  centered = true, 
  light = false,
  className = '' 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`${centered ? 'text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-sm mb-4 ${
 light ? 'text-[#c4935f]' : 'text-[#c4935f]'
 }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-6 ${
 light ? 'text-white' : 'text-gray-900 dark:text-white'
 }`}
        style={{ fontFamily: 'Fraunces, serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${
 light ? 'text-white/70' : 'text-gray-600 dark:text-gray-300'
 }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
