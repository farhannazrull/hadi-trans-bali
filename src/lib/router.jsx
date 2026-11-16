'use client';

// Thin compatibility layer so existing components keep their react-router style API on top of Next.js.
import NextLink from 'next/link';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const Link = ({ to, href, ...props }) => <NextLink href={to ?? href} {...props} />;

export const useNavigate = () => {
  const router = useRouter();
  return (to, options = {}) => (options.replace ? router.replace(to) : router.push(to));
};

export const useLocation = () => {
  const pathname = usePathname() || '/';
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  return { pathname, hash };
};

export const Navigate = ({ to }) => {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return null;
};

// Reads the last path segment from the real URL. Needed because static export serves a placeholder
// page (`/tour/_/`) for ids not known at build time, so Next's own params would say "_".
export const useLastSegment = () => {
  const pathname = usePathname() || '';
  const parts = pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || '';
  if (last !== '_') return decodeURIComponent(last);
  if (typeof window === 'undefined') return last;
  const real = window.location.pathname.split('/').filter(Boolean);
  return decodeURIComponent(real[real.length - 1] || last);
};
