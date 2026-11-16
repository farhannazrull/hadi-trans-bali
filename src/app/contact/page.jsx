import Contact from '@/views/Contact';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Hubungi Kami',
  description: 'Hubungi Hadi Trans Bali via WhatsApp atau email untuk reservasi sewa mobil dan paket tour di Bali.',
  path: '/contact/',
});

export default function Page() {
  return <Contact />;
}
