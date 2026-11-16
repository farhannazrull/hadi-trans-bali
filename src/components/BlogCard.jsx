'use client';

import { Link } from '@/lib/router';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const BlogCard = ({ post, index = 0 }) => {
  const { language } = useLanguage();

  const title = post.title[language] || post.title.en;
  const excerpt = post.excerpt[language] || post.excerpt.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        to={`/blog/${post.slug}`}
        className="group h-full flex flex-col bg-white dark:bg-dark-green-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 border border-gray-100 dark:border-dark-green-700"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.img
            src={post.image}
            alt={title}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1.5 bg-white/90 dark:bg-dark-green-950/90 text-[#1a4d3e] dark:text-[#4ade80] text-[11px] font-semibold rounded-xl shadow-sm">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="flex-1 p-6 md:p-8 flex flex-col">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-4">
            <span>{post.date}</span>
            <span className="text-[#c4935f]">•</span>
            <span>{post.author}</span>
          </div>
          
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-[#1a4d3e] dark:group-hover:text-[#4ade80] transition-colors leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
            {title}
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-1 text-justify leading-relaxed">
            {excerpt}
          </p>
          
          <div className="flex items-center text-[#c4935f] dark:text-[#d4b08a] text-xs font-semibold">
            <span className="border-b border-transparent group-hover:border-[#c4935f] transition-[color,background-color,border-color,opacity,transform,box-shadow]">
              {language === 'id' ? 'Baca Selengkapnya' : 'Read More'}
            </span>
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
