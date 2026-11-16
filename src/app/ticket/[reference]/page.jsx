import Ticket from '@/views/Ticket';
import { buildMetadata } from '@/lib/site';

// References are created at runtime, so only the placeholder shell is built; Firebase Hosting rewrites every /ticket/* to it.
export const generateStaticParams = () => [{ reference: '_' }];
export const dynamicParams = false;
export const metadata = buildMetadata({ title: 'Tiket', path: '/ticket/', noindex: true });

export default function Page() {
  return <Ticket />;
}
