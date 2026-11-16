import ContactReceived from '@/views/ContactReceived';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Terima Kasih',
  description: 'Kami telah menerima pesan Anda. Hadi akan segera menghubungi Anda melalui WhatsApp.',
  path: '/contact-received/',
});

export default function Page() {
  return <ContactReceived />;
}
