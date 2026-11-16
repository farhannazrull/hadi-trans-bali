import SeedPage from '@/views/admin/Seed';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({ title: 'Seed', path: '/admin/seed/', noindex: true });

export default function Page() {
  return <SeedPage />;
}
