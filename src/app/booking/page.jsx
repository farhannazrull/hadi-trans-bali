import Booking from '@/views/Booking';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Booking',
  description: 'Pesan antar jemput bandara, sewa mobil dengan driver, dan paket tour Bali dalam beberapa langkah. Konfirmasi lewat WhatsApp.',
  path: '/booking/',
});

export default function Page() {
  return <Booking />;
}
