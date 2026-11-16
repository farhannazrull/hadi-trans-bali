export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://haditransbali.my.id').replace(/\/$/, '');
export const SITE_NAME = 'Hadi Trans Bali';
export const DEFAULT_DESCRIPTION =
  'Jasa transportasi dan tour terpercaya di Bali. Sewa mobil dengan driver profesional untuk perjalanan wisata Anda.';
export const DEFAULT_IMAGE = '/backgrounds/hero-bali-1.webp';

// Builds a metadata object (Indonesian default, since that is the site's default language).
export const buildMetadata = ({ title, description = DEFAULT_DESCRIPTION, path = '/', image = DEFAULT_IMAGE, type = 'website', noindex = false }) => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: title || SITE_NAME, description, url: path, siteName: SITE_NAME, type, images: [image] },
  twitter: { card: 'summary_large_image', title: title || SITE_NAME, description, images: [image] },
  ...(noindex ? { robots: { index: false, follow: false } } : {}),
});
