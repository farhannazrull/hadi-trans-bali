import Blog from '@/views/Blog';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Blog & Tips Wisata Bali',
  description: 'Panduan, tips, dan inspirasi perjalanan di Bali dari tim Hadi Trans Bali.',
  path: '/blog/',
});

export default function Page() {
  return <Blog />;
}
