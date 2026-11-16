import Services from '@/views/Services';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Layanan & Paket Tour Bali',
  description: 'Pilih paket tour Bali dan sewa mobil dengan driver profesional: Uluwatu, Ubud, Nusa Penida, Lovina, dan lainnya.',
  path: '/services/',
});

export default function Page() {
  return <Services />;
}
