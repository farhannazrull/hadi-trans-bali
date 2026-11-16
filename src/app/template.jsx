'use client';

import PageTransition from '@/components/PageTransition';

// A template remounts on every navigation, so the page fades in each time.
export default function Template({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
