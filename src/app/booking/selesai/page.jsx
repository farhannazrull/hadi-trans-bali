import BookingSelesai from '@/views/BookingSelesai';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Booking Terkirim',
  description: 'Terima kasih, booking Anda telah kami terima dan akan segera kami konfirmasi lewat WhatsApp.',
  path: '/booking/selesai/',
  noindex: true,
});

export default function Page() {
  return <BookingSelesai />;
}
