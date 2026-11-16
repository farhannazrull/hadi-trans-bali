import About from '@/views/About';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Tentang Kami',
  description: 'Kenali Hadi Trans Bali, penyedia jasa transportasi dan tour pribadi terpercaya di Bali dengan driver berpengalaman.',
  path: '/about/',
});

export default function Page() {
  return <About />;
}
