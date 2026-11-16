'use client';

import { useState, useEffect } from 'react';
import { useLastSegment, Link } from '@/lib/router';
import { motion } from 'framer-motion';
import { SectionHeader, SEO } from '../components';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { posts as staticPosts } from '../data/posts';
import { getWhatsAppLink } from '../data/config';
import { useLanguage } from '../context/LanguageContext';

const BlogPost = () => {
  const slug = useLastSegment();
  const { language, t, tr } = useLanguage();
  const [post, setPost] = useState(staticPosts.find(p => p.slug === slug));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'posts', slug));
        if (docSnap.exists()) {
          setPost(docSnap.data());
        }
      } catch (error) {
        console.log("Post background sync skipped:", error.message);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    // Reload TikTok embeds when post changes
    if (post && post.tiktokEmbeds?.length > 0) {
      const script = document.createElement('script');
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 pt-32 pb-20 flex items-center justify-center transition-colors">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
            {language === 'id' ? 'Artikel Tidak Ditemukan' : 'Article Not Found'}
          </h1>
          <Link to="/blog" className="text-[#1a4d3e] dark:text-[#4ade80] hover:underline">
            {language === 'id' ? 'Kembali ke Blog' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const title = post.title[language] || post.title.en;
  const content = post.content[language] || post.content.en;
  const excerpt = post.excerpt[language] || post.excerpt.en;

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-dark-green-950 transition-colors">
      <SEO 
        title={title}
        description={excerpt}
        image={post.image}
        url={`/blog/${post.slug}`}
        type="article"
      />

      {/* Hero Image */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/55" />
          <div className="absolute inset-x-0 bottom-0 h-16 lg:h-20 bg-gradient-to-t from-[#fdfcfb] dark:from-dark-green-950 to-transparent" />
        </div>
        
        {/* Back Link */}
        <div className="absolute top-24 left-6 lg:left-12 z-10">
          <Link to="/blog" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 lg:px-8 pb-20 lg:pb-28 text-center">
          <span className="inline-block px-4 py-1.5 bg-[#c4935f] text-white text-sm font-medium rounded-xl mb-6">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-light mb-6 leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
            {title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/90 text-sm">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.author}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Footage Section */}
        {post.footageUrl && (
          <div className="mb-12">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-100 dark:bg-dark-green-900 mb-2 transition-colors">
              {post.footageType === 'youtube' ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={`${post.footageUrl}${post.footageUrl.includes('?') ? '&' : '?'}rel=0`}
                    title="YouTube video player"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              ) : post.footageType === 'video' ? (
                <div className="aspect-video bg-black">
                  <video src={post.footageUrl} className="w-full h-full object-cover" controls muted autoPlay loop playsInline />
                </div>
              ) : (
                <div className="relative">
                  <img src={post.footageUrl} alt="Location footage" className="w-full h-auto object-cover" />
                </div>
              )}
              <div className="bg-gray-100 dark:bg-dark-green-900 px-6 py-3 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                {language === 'id' ? 'Footage suasana di lokasi' : 'Footage of the location'}
              </div>
            </div>
            {post.footageCredit && (
              <div className="text-right">
                <span className="text-[11px] text-gray-400">Source: {post.footageCredit}</span>
              </div>
            )}
          </div>
        )}

        <div className="blog-content text-gray-700 dark:text-gray-300 text-lg transition-colors" dangerouslySetInnerHTML={{ __html: content }} />

        {/* TikTok Embed Section */}
        {post.tiktokEmbeds?.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white dark:text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-.99.01-1.49.18-3.33 2.76-6.15 6.06-6.55.9-.13 1.82-.02 2.7.25v4.03c-.5-.17-1.04-.21-1.57-.14-1.13.09-2.14.9-2.43 2.05-.32 1.29.07 2.66 1.05 3.47.1.08.21.15.33.2.16.07.34.12.5.17.65.17 1.34.03 1.9-.22 1.11-.49 1.84-1.68 1.83-2.89l-.02-11.75z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{language === 'id' ? 'Apa Kata Mereka?' : 'What Travelers Say'}</h4>
            </div>
            <div className={`grid grid-cols-1 ${post.tiktokEmbeds.length > 1 ? 'lg:grid-cols-2' : ''} gap-6`}>
              {post.tiktokEmbeds.map((embedUrl, idx) => (
                <div key={idx} className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 flex justify-center h-full shadow-sm">
                  <blockquote className="tiktok-embed" cite={embedUrl} data-video-id={embedUrl.split('/').pop().split('?')[0]} data-theme="light" style={{ maxWidth: '605px', minWidth: '325px' }}> 
                    <section> <a target="_blank" title="TikTok Video" href={embedUrl} rel="noreferrer" className="text-[#1a4d3e]">{tr('Memuat...', 'Loading...')}</a> </section> 
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Box */}
        <div className="mt-16 p-8 bg-[#1a4d3e] rounded-2xl text-center text-white">
          <h3 className="text-2xl font-light mb-4" style={{ fontFamily: 'Fraunces, serif' }}>{language === 'id' ? 'Ingin Mengunjungi Tempat Ini?' : 'Want to Visit This Place?'}</h3>
          <a href={getWhatsAppLink(`Hi! I'm interested in "${title}" trip.`)} target="_blank" rel="noopener noreferrer" className="btn-3d btn-3d-bronze inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl">
            <span>{t('common.bookNow')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;