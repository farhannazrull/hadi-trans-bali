'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, BlogCard, SEO } from '../components';
import { posts as staticPosts } from '../data/posts';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';

const Blog = () => {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState(staticPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'posts'), orderBy('date', 'desc')));
        if (!querySnapshot.empty) {
          setPosts(querySnapshot.docs.map(doc => doc.data()));
        }
      } catch (error) {
        console.log("Blog background sync skipped:", error.message);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors">
      <SEO 
        title={language === 'id' ? 'Blog & Artikel Wisata' : 'Travel Blog & Articles'}
        description={language === 'id' 
          ? 'Temukan inspirasi liburan, tips perjalanan, dan panduan wisata Bali terbaru dari Hadi Trans Bali.'
          : 'Discover holiday inspiration, travel tips, and the latest Bali travel guides from Hadi Trans Bali.'}
        url="/blog"
      />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <img
            src="/backgrounds/hero-bali-4.webp"
            alt="Tanah Lot Bali"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fdfcfb] dark:from-dark-green-950 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pt-20 pb-32">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[#c4935f] text-sm mb-6"
          >
            {language === 'id' ? 'Jurnal Perjalanan' : 'Travel Journal'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl text-white font-light mb-6"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {language === 'id' ? 'Cerita dari' : 'Stories from'} <span className="">Bali</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/95 max-w-2xl mx-auto"
          >
            {language === 'id' 
              ? 'Inspirasi, tips, dan panduan lokal untuk liburan tak terlupakan.'
              : 'Inspiration, tips, and local guides for an unforgettable holiday.'}
          </motion.p>
        </div>

        {/* White Fade Separator */}
      </section>

      {/* Blog Grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
