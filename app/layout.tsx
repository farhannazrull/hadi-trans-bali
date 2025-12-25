import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Hadi Trans Bali - Private Tour Bali 2025",
  description: "Experience the magic of Bali with our personalized private tours. Explore stunning temples, pristine beaches, lush rice terraces, and authentic Balinese culture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
