import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_IMAGE } from './site';
import { config } from '@/data/config';

const absolute = (path = '/') => (path.startsWith('http') ? path : `${SITE_URL}${path}`);
const formatPrice = (value) => new Intl.NumberFormat('id-ID').format(value);

const ORG_ID = `${SITE_URL}/#organization`;

// Business identity. Kept free of aggregateRating on purpose: the rating only exists
// once there are real reviews (Google penalises invented ratings).
export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description: DEFAULT_DESCRIPTION,
  image: absolute(DEFAULT_IMAGE),
  logo: { '@type': 'ImageObject', url: absolute('/image/logo.webp') },
  telephone: `+${config.whatsapp.number}`,
  email: config.contact.email,
  priceRange: 'Rp250.000 - Rp1.500.000',
  currenciesAccepted: 'IDR',
  paymentAccepted: 'Tunai, Transfer Bank, QRIS',
  // Matches the Google Business Profile listing exactly (NAP consistency).
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Batu Bulan No.1, Benoa',
    addressLocality: 'Kuta Selatan',
    addressRegion: 'Bali',
    postalCode: '80361',
    addressCountry: 'ID',
  },
  areaServed: { '@type': 'AdministrativeArea', name: 'Bali' },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  sameAs: [config.social?.instagram, config.social?.tiktok].filter(Boolean),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'id-ID',
  publisher: { '@id': ORG_ID },
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absolute(item.path),
  })),
});

export const tourServiceSchema = (pkg) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: `${pkg.title.id} (${pkg.hours?.id || pkg.duration?.id || 'Full Day'})`,
  serviceType: 'Paket tour Bali dengan mobil dan driver',
  description: pkg.description.id,
  url: `${SITE_URL}/tour/${pkg.id}/`,
  image: absolute(pkg.image),
  provider: { '@id': ORG_ID },
  areaServed: { '@type': 'AdministrativeArea', name: 'Bali' },
  offers: {
    '@type': 'Offer',
    price: pkg.startingPrice,
    priceCurrency: 'IDR',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/booking/`,
  },
});

// FAQ answers are derived from the package data itself, so nothing here is invented.
export const tourFaq = (pkg) => [
  {
    question: `Berapa harga ${pkg.title.id}?`,
    answer: `Mulai dari Rp${formatPrice(pkg.startingPrice)} per mobil untuk ${
      pkg.pricing?.[0]?.car || 'kendaraan terkecil'
    }. Harga naik sesuai jenis kendaraan dan jumlah peserta.`,
  },
  {
    question: `Berapa lama durasi ${pkg.title.id}?`,
    answer: `Sekitar ${pkg.hours?.id || '10-12 jam'} termasuk penjemputan dan pengantaran kembali ke hotel.`,
  },
  {
    question: `Destinasi apa saja yang dikunjungi?`,
    answer: `${pkg.destinations?.join(', ') || ''}.`,
  },
  {
    question: 'Bagaimana cara memesan?',
    answer: `Isi formulir di halaman booking atau hubungi WhatsApp ${config.contact.phone}. Detail perjalanan dikonfirmasi lewat WhatsApp.`,
  },
];

export const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
});

export const blogPostingSchema = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title.id,
  description: post.excerpt.id,
  image: absolute(post.image),
  datePublished: post.date,
  dateModified: post.date,
  inLanguage: 'id-ID',
  author: { '@type': 'Person', name: post.author || SITE_NAME },
  publisher: { '@id': ORG_ID },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}/` },
});
