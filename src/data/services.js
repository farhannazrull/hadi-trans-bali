// Tour Packages
export const tourPackages = [
  {
    id: 1,
    title: {
      id: "Paket 1 - Tour Bali Selatan",
      en: "Package 1 - South Bali Tour"
    },
    slug: "tour-bali-selatan",
    icon: "sun",
    destinations: {
      id: [
        "Water sport Tanjung Benoa",
        "Pantai Pandawa dan wisata tebing panjang",
        "Melasti Beach",
        "Pura Uluwatu",
        "Tari Kecak (Uluwatu atau Melasti)",
        "Jimbaran seafood",
        "Kembali ke hotel"
      ],
      en: [
        "Water sports at Tanjung Benoa",
        "Pandawa Beach and cliff sightseeing",
        "Melasti Beach",
        "Uluwatu Temple",
        "Kecak Dance (Uluwatu or Melasti)",
        "Jimbaran seafood dinner",
        "Return to hotel"
      ]
    },
    pricing: [
      { hours: 10, price: 600000 },
      { hours: 12, price: 700000 }
    ],
    image: "/tours/uluwatu.webp",
    color: "#1a4d3e"
  },
  {
    id: 2,
    title: {
      id: "Paket 2 - Tour Ubud",
      en: "Package 2 - Ubud Tour"
    },
    slug: "tour-ubud",
    icon: "leaf",
    destinations: {
      id: [
        "Rice terrace dan swing Tegalalang",
        "Kopi luwak / coffee plantation",
        "ATV dan rafting (opsional)",
        "Monkey Forest",
        "Ubud market dan Ubud palace"
      ],
      en: [
        "Tegalalang rice terrace and swing",
        "Luwak coffee / coffee plantation",
        "ATV and rafting (optional)",
        "Monkey Forest",
        "Ubud market and Ubud palace"
      ]
    },
    pricing: [
      { hours: 10, price: 600000 },
      { hours: 12, price: 700000 }
    ],
    image: "/tours/ubud.webp",
    color: "#c4935f"
  },
  {
    id: 3,
    title: {
      id: "Paket 3 - Tour Bangli",
      en: "Package 3 - Bangli Tour"
    },
    slug: "tour-bangli",
    icon: "mountain",
    destinations: {
      id: [
        "Desa adat Penglipuran",
        "Kintamani (Gunung Batur)",
        "Bali Zoo dan Safari Park (opsional)",
        "Kunjungan ke pengrajin silver dan gold, pembuat tas dan lukisan, atau pusat oleh-oleh Ubud (opsional)"
      ],
      en: [
        "Penglipuran traditional village",
        "Kintamani (Mount Batur)",
        "Bali Zoo and Safari Park (optional)",
        "Visit to silver and gold craftsmen, bag and painting makers, or Ubud souvenir center (optional)"
      ]
    },
    pricing: [
      { hours: 10, price: 700000 },
      { hours: 12, price: 800000 }
    ],
    image: "/tours/kintamani.webp",
    color: "#1a4d3e"
  },
  {
    id: 4,
    title: {
      id: "Paket 4 - Tour Bedugul Area",
      en: "Package 4 - Bedugul Area Tour"
    },
    slug: "tour-bedugul",
    icon: "building-library",
    destinations: {
      id: [
        "Bloom Garden",
        "Pura Ulun Danu Beratan",
        "Secret Garden (wisata edukasi)",
        "Pura Tanah Lot"
      ],
      en: [
        "Bloom Garden",
        "Ulun Danu Beratan Temple",
        "Secret Garden (educational tour)",
        "Tanah Lot Temple"
      ]
    },
    pricing: [
      { hours: 10, price: 700000 }
    ],
    image: "/tours/bedugul.webp",
    color: "#c4935f"
  }
];

// Fleet / Armada
export const fleet = [
  {
    id: 1,
    name: "Toyota Innova Reborn",
    capacity: "6-7 passengers",
    capacityId: "6-7 penumpang",
    image: "/fleet/innova-reborn.webp",
    pricing: [
      { hours: 10, price: 850000 },
      { hours: 12, price: 1000000 }
    ]
  },
  {
    id: 2,
    name: "Toyota Hiace Commuter",
    nameId: "Toyota Hiace Commuter",
    capacity: "12-15 passengers",
    capacityId: "12-15 penumpang",
    image: "/fleet/hiace-commuter.webp",
    pricing: [
      { hours: 10, price: 1000000 },
      { hours: 12, price: 1200000 }
    ]
  },
  {
    id: 3,
    name: "Toyota Hiace Premio",
    capacity: "10-12 passengers",
    capacityId: "10-12 penumpang",
    image: "/fleet/hiace-premio.webp",
    pricing: [
      { hours: 10, price: 1500000 },
      { hours: 12, price: 1600000 }
    ]
  },
  {
    id: 4,
    name: "Daihatsu All New Xenia",
    capacity: "5-6 passengers",
    capacityId: "5-6 penumpang",
    image: "/fleet/allnew-xenia.webp",
    pricing: [
      { hours: 10, price: 750000 },
      { hours: 12, price: 850000 }
    ]
  },
  {
    id: 5,
    name: "Toyota All New Avanza",
    capacity: "5-6 passengers",
    capacityId: "5-6 penumpang",
    image: "/fleet/allnew-avanza.webp",
    pricing: [
      { hours: 10, price: 750000 },
      { hours: 12, price: 850000 }
    ]
  },
  {
    id: 6,
    name: "Daihatsu Terios",
    capacity: "5-6 passengers",
    capacityId: "5-6 penumpang",
    image: "/fleet/terios.webp",
    pricing: [
      { hours: 10, price: 550000 },
      { hours: 12, price: 650000 }
    ]
  },
  {
    id: 7,
    name: "Daihatsu Sigra",
    nameId: "Daihatsu Sigra",
    nameEn: "Daihatsu Sigra",
    capacity: "4-5 passengers",
    capacityId: "4-5 penumpang",
    image: "/fleet/sigra.webp",
    pricing: [
      { hours: 10, price: 500000 },
      { hours: 12, price: 550000 }
    ]
  }
];

// Legacy services export for backward compatibility
export const services = tourPackages.map(pkg => ({
  id: pkg.id,
  title: pkg.title.en,
  titleId: pkg.title.id,
  slug: pkg.slug,
  icon: pkg.icon,
  destinations: pkg.destinations,
  pricing: pkg.pricing,
  image: pkg.image,
  color: pkg.color
}));

export const getServiceBySlug = (slug) => {
  return tourPackages.find(pkg => pkg.slug === slug);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
