import './globals.css';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';
import Analytics, { AnalyticsTracker } from '@/components/Analytics';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from '@/lib/site';

const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - Premium Car Rental & Private Tours`, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  icons: { icon: '/image/logo.webp?v=2' },
  openGraph: { siteName: SITE_NAME, locale: 'id_ID', type: 'website' },
  ...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {}),
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
      </head>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <Analytics />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
