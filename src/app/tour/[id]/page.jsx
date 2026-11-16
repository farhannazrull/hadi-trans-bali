import TourDetail from '@/views/TourDetail';
import JsonLd from '@/components/JsonLd';
import { packages, getPackageById } from '@/data/packages';
import { buildMetadata } from '@/lib/site';
import { tourServiceSchema, tourFaq, faqSchema, breadcrumbSchema } from '@/lib/schema';

// "_" is a placeholder shell: Firebase Hosting serves it for packages that only exist in Firestore.
export const generateStaticParams = () => [...packages.map((p) => ({ id: String(p.id) })), { id: '_' }];
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pkg = id === '_' ? null : getPackageById(id);
  if (!pkg) return buildMetadata({ title: 'Paket Tour', path: '/services/' });
  return buildMetadata({
    title: pkg.title.id || pkg.title.en,
    description: pkg.description.id || pkg.description.en,
    path: `/tour/${pkg.id}/`,
    image: pkg.image,
  });
}

export default async function Page({ params }) {
  const { id } = await params;
  const pkg = id === '_' ? null : getPackageById(id);

  return (
    <>
      {pkg && (
        <JsonLd
          data={[
            tourServiceSchema(pkg),
            faqSchema(tourFaq(pkg)),
            breadcrumbSchema([
              { name: 'Beranda', path: '/' },
              { name: 'Layanan', path: '/services/' },
              { name: pkg.title.id, path: `/tour/${pkg.id}/` },
            ]),
          ]}
        />
      )}
      <TourDetail />
    </>
  );
}
