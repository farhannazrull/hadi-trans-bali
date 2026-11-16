import Home from '@/views/Home';
import { buildMetadata, SITE_NAME } from '@/lib/site';

export const metadata = buildMetadata({
  title: { absolute: `${SITE_NAME} - Sewa Mobil & Tour Pribadi di Bali` },
  path: '/',
});

export default function Page() {
  return <Home />;
}
