export const config = {
  companyName: "Hadi Trans Bali",
  tagline: "Your Journey, Our Passion",
  
  whatsapp: {
    number: "6281331970761",
    adminNumber: "6285179964917", // Nomor khusus untuk notifikasi booking
    defaultMessage: "Hello Hadi Trans Bali, I'd like to book a service.",
    bookingMessage: (service) => `Hello Hadi Trans Bali, I'm interested in: ${service}`,
  },
  
  contact: {
    email: "haditransbali@gmail.com",
    phone: "+62 813 3197 0761",
    phone2: "+62 851 5614 5982",
    location: "Bali, Indonesia",
    operatingHours: "24/7"
  },

  bankDetails: {
    bankName: "BCA",
    accountNumber: "2640718881",
    accountName: "IMRON ROSADI",
    qrisImage: "/image/qris.webp" // Pastikan Anda mengupload file qris.webp ke folder public/image/
  },

  payment: {
    enableEmail: false,
    downPaymentPercentage: 30,
  },

  social: {
    instagram: "https://instagram.com/haditransbali",
    tiktok: "https://tiktok.com/@haditrans.bali",
    tripadvisor: "https://tripadvisor.com/haditransbali"
  },
  
  stats: [
    { number: "200+", label: { id: "Tamu Puas", en: "Happy Guests" } },
    { number: "5+", label: { id: "Tahun Pengalaman", en: "Years Experience" } },
    { number: "20+", label: { id: "Destinasi", en: "Destinations" } },
    { number: "5.0", label: { id: "Rating", en: "Rating" } }
  ],
  
  features: [
    {
      id: 1,
      titleKey: "feature1Title",
      descKey: "feature1Desc",
      icon: "MapPinIcon"
    },
    {
      id: 2,
      titleKey: "feature2Title",
      descKey: "feature2Desc",
      icon: "ClockIcon"
    },
    {
      id: 3,
      titleKey: "feature3Title",
      descKey: "feature3Desc",
      icon: "ShieldCheckIcon"
    },
    {
      id: 4,
      titleKey: "feature4Title",
      descKey: "feature4Desc",
      icon: "ChatBubbleIcon"
    },
    {
      id: 5,
      titleKey: "feature5Title",
      descKey: "feature5Desc",
      icon: "UserGroupIcon"
    },
    {
      id: 6,
      titleKey: "feature6Title",
      descKey: "feature6Desc",
      icon: "SparklesIcon"
    }
  ],
  
  galleryImages: [
    "/gallery/photo-2026-01-24-19-01-44.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.44.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.47.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.48.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.49.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.50.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.51.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.56.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.58.webp",
    "/gallery/whatsapp-image-2026-01-24-at-19.01.46.webp"
  ]
};

export const getWhatsAppLink = (message = config.whatsapp.defaultMessage, targetNumber = config.whatsapp.number) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${targetNumber}?text=${encodedMessage}`;
};