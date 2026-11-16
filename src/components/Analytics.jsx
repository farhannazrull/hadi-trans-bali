'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

// Set NEXT_PUBLIC_GA_ID (G-XXXXXXX) to activate. Without it this renders nothing.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// Optional second tag from the Google Ads account's conversion linking setup; gtag.js supports
// configuring multiple destinations from one loader, so every track() call reaches both.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

const Analytics = () => {
  const loaderId = GA_ID || GOOGLE_ADS_ID;
  if (!loaderId) return null;

  const configCalls = [GA_ID, GOOGLE_ADS_ID]
    .filter(Boolean)
    .map((id) => `gtag('config','${id}',{send_page_view:false});`)
    .join('');

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${configCalls}`,
        }}
      />
    </>
  );
};

// Hooks must run unconditionally, so tracking lives in a separate component that is
// only mounted when a measurement ID exists.
export const AnalyticsTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID && !GOOGLE_ADS_ID) return;
    track('page_view', {
      page_path: pathname + window.location.search,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    if (!GA_ID && !GOOGLE_ADS_ID) return;

    const handleClick = (event) => {
      const element = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!element) return;

      const href = element.getAttribute('href') || '';
      const payload = { link_url: href, page_path: window.location.pathname };

      // Every booking CTA ends in a WhatsApp deep link, so this is the real conversion signal.
      if (/(?:wa\.me|api\.whatsapp\.com|whatsapp:)/i.test(href)) {
        track('whatsapp_click', payload);
      } else if (/^tel:/i.test(href)) {
        track('phone_click', payload);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
};

export default Analytics;
