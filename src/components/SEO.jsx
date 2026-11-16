'use client';

import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { config } from '../data/config';

// Static metadata for crawlers comes from each route's `generateMetadata`.
// This component keeps the tab title, description and <html lang> in sync on the client
// (e.g. after the visitor switches language or Firestore data replaces the static defaults).
const setMeta = (selector, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, key, val] = selector.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/) || [];
    if (key) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const SEO = ({ title, description, image, url, type = 'website' }) => {
  const { language } = useLanguage();

  useEffect(() => {
    const siteTitle = config.companyName;
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = language === 'id'
      ? 'Jasa transportasi dan tour terpercaya di Bali. Sewa mobil dengan driver profesional untuk perjalanan wisata Anda.'
      : 'Trusted transport and tour service in Bali. Rent a car with professional drivers for your holiday.';
    const metaDescription = description || defaultDescription;
    const metaUrl = url ? `${window.location.origin}${url}` : window.location.origin;
    const metaImage = image || '/backgrounds/hero-bali-1.webp';

    document.title = fullTitle;
    document.documentElement.lang = language;
    setMeta('meta[name="description"]', 'content', metaDescription);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:url"]', 'content', metaUrl);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', metaDescription);
    setMeta('meta[property="og:image"]', 'content', metaImage);
  }, [title, description, image, url, type, language]);

  return null;
};

export default SEO;
