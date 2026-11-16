import BlogPost from '@/views/BlogPost';
import JsonLd from '@/components/JsonLd';
import { posts } from '@/data/posts';
import { buildMetadata } from '@/lib/site';
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schema';

// "_" is a placeholder shell: Firebase Hosting serves it for posts that only exist in Firestore.
export const generateStaticParams = () => [...posts.map((p) => ({ slug: p.slug })), { slug: '_' }];
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return buildMetadata({ title: 'Blog', path: '/blog/' });
  return buildMetadata({
    title: post.title.id || post.title.en,
    description: post.excerpt.id || post.excerpt.en,
    path: `/blog/${post.slug}/`,
    image: post.image,
    type: 'article',
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  return (
    <>
      {post && (
        <JsonLd
          data={[
            blogPostingSchema(post),
            breadcrumbSchema([
              { name: 'Beranda', path: '/' },
              { name: 'Blog', path: '/blog/' },
              { name: post.title.id, path: `/blog/${post.slug}/` },
            ]),
          ]}
        />
      )}
      <BlogPost />
    </>
  );
}
