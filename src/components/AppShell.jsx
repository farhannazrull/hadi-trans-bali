'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import AiPlanner from './AiPlanner';

export default function AppShell({ children }) {
  const pathname = usePathname() || '/';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfcfb]">
      {!isAdminPage && <Navbar />}
      <AiPlanner />
      <main className="flex-grow">{children}</main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppFloat />}
    </div>
  );
}
