import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/ticket/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
