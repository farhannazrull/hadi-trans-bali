import AdminDashboard from '@/views/admin/Dashboard';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({ title: 'Admin', path: '/admin/', noindex: true });

export default function Page() {
  return <AdminDashboard />;
}
