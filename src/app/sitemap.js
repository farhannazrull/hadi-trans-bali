import { packages } from '@/data/packages';
import { posts } from '@/data/posts';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap() {
  const pages = ['/', '/services/', '/booking/', '/about/', '/contact/', '/blog/'].map((p) => ({ url: `${SITE_URL}${p}` }));
  const tours = packages.map((p) => ({ url: `${SITE_URL}/tour/${p.id}/` }));
  const blog = posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}/`, lastModified: p.date }));
  return [...pages, ...tours, ...blog];
}
