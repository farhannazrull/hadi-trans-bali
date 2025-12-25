export interface Package {
  id: string;
  slug: string;
  title: string;
  basePrice: number;
  description: string;
  highlights: string[];
  itinerary: {
    time?: string;
    activity: string;
    description?: string;
  }[];
  facilities: string[];
}

export const globalFacilities = [
  "Comfortable car",
  "Friendly Driver (photo/video help)",
  "Fuel & Parking",
  "Up to 12 hours",
  "Hotel Pickup"
];

export const packages: Package[] = [
  {
    id: "1",
    slug: "uluwatu-tour",
    title: "Uluwatu Tour",
    basePrice: 600000,
    description: "Experience the stunning beauty of South Bali with visits to iconic temples, pristine beaches, and cultural performances.",
    highlights: [
      "GWK Cultural Park",
      "Pantai Pandawa & Tanah Barak",
      "Pantai Melasti",
      "Pura Uluwatu & Tari Kecak"
    ],
    itinerary: [
      {
        time: "08:00 AM",
        activity: "Hotel Pickup",
        description: "Our friendly driver will pick you up from your hotel"
      },
      {
        time: "09:00 AM",
        activity: "GWK Cultural Park",
        description: "Visit the iconic Garuda Wisnu Kencana statue and cultural park"
      },
      {
        time: "11:00 AM",
        activity: "Pantai Pandawa & Tanah Barak",
        description: "Explore the beautiful white sandy beaches"
      },
      {
        time: "01:00 PM",
        activity: "Lunch Break",
        description: "Enjoy local Indonesian cuisine (at your own expense)"
      },
      {
        time: "02:30 PM",
        activity: "Pantai Melasti",
        description: "Visit the stunning cliff-side beach"
      },
      {
        time: "04:00 PM",
        activity: "Pura Uluwatu",
        description: "Explore the majestic clifftop temple"
      },
      {
        time: "06:00 PM",
        activity: "Kecak Fire Dance",
        description: "Watch the traditional Balinese Kecak dance performance at sunset"
      },
      {
        time: "08:00 PM",
        activity: "Return to Hotel",
        description: "Safe return to your accommodation"
      }
    ],
    facilities: globalFacilities
  },
  {
    id: "2",
    slug: "benoa-tour",
    title: "Benoa Tour",
    basePrice: 600000,
    description: "Combine water sports adventure with beautiful beach visits and cultural temple experiences.",
    highlights: [
      "Water Sport Tanjung Benoa",
      "Pantai Melasti",
      "Pantai Padang-Padang",
      "Pura Uluwatu & Tari Kecak"
    ],
    itinerary: [
      {
        time: "08:00 AM",
        activity: "Hotel Pickup",
        description: "Our friendly driver will pick you up from your hotel"
      },
      {
        time: "09:00 AM",
        activity: "Tanjung Benoa Water Sports",
        description: "Enjoy exciting water sports activities (at your own expense)"
      },
      {
        time: "12:00 PM",
        activity: "Lunch Break",
        description: "Enjoy fresh seafood and local cuisine"
      },
      {
        time: "02:00 PM",
        activity: "Pantai Melasti",
        description: "Visit the stunning cliff-side beach"
      },
      {
        time: "03:30 PM",
        activity: "Pantai Padang-Padang",
        description: "Relax at this famous surfing beach"
      },
      {
        time: "04:30 PM",
        activity: "Pura Uluwatu",
        description: "Explore the majestic clifftop temple"
      },
      {
        time: "06:00 PM",
        activity: "Kecak Fire Dance",
        description: "Watch the traditional Balinese Kecak dance performance at sunset"
      },
      {
        time: "08:00 PM",
        activity: "Return to Hotel",
        description: "Safe return to your accommodation"
      }
    ],
    facilities: globalFacilities
  },
  {
    id: "3",
    slug: "ubud-tour",
    title: "Ubud Tour",
    basePrice: 700000,
    description: "Immerse yourself in Ubud's natural beauty and cultural heritage with adventure activities and sacred temples.",
    highlights: [
      "ATV/Rafting Adventure",
      "Sacred Monkey Forest",
      "Uma Ceking Rice Terrace",
      "Tirta Empul Temple"
    ],
    itinerary: [
      {
        time: "08:00 AM",
        activity: "Hotel Pickup",
        description: "Our friendly driver will pick you up from your hotel"
      },
      {
        time: "09:00 AM",
        activity: "ATV/Rafting Adventure",
        description: "Choose between ATV ride or white water rafting (at your own expense)"
      },
      {
        time: "12:00 PM",
        activity: "Lunch Break",
        description: "Enjoy traditional Balinese cuisine with rice terrace views"
      },
      {
        time: "01:30 PM",
        activity: "Sacred Monkey Forest",
        description: "Walk through the forest sanctuary and meet playful monkeys"
      },
      {
        time: "03:00 PM",
        activity: "Uma Ceking Rice Terrace",
        description: "Marvel at the stunning terraced rice fields"
      },
      {
        time: "04:30 PM",
        activity: "Tirta Empul Temple",
        description: "Visit the holy spring water temple"
      },
      {
        time: "06:00 PM",
        activity: "Return to Hotel",
        description: "Safe return to your accommodation"
      }
    ],
    facilities: globalFacilities
  },
  {
    id: "4",
    slug: "kintamani-tour",
    title: "Kintamani Tour",
    basePrice: 800000,
    description: "Discover the natural beauty of Bali's highlands with volcano views, traditional villages, and scenic rice terraces.",
    highlights: [
      "Desa Penglipuran Traditional Village",
      "Kintamani Volcano View",
      "Uma Ceking Rice Terrace",
      "Sari Timbul Coffee Plantation"
    ],
    itinerary: [
      {
        time: "07:00 AM",
        activity: "Hotel Pickup",
        description: "Early morning pickup for a full day adventure"
      },
      {
        time: "09:00 AM",
        activity: "Desa Penglipuran",
        description: "Explore one of Bali's most traditional and cleanest villages"
      },
      {
        time: "11:00 AM",
        activity: "Kintamani Volcano View",
        description: "Enjoy breathtaking views of Mount Batur and Lake Batur"
      },
      {
        time: "12:30 PM",
        activity: "Lunch Break",
        description: "Buffet lunch with volcano views"
      },
      {
        time: "02:00 PM",
        activity: "Uma Ceking Rice Terrace",
        description: "Marvel at the stunning terraced rice fields"
      },
      {
        time: "03:30 PM",
        activity: "Sari Timbul Coffee Plantation",
        description: "Learn about Luwak coffee and taste various local teas and coffees"
      },
      {
        time: "05:00 PM",
        activity: "Return to Hotel",
        description: "Safe return to your accommodation"
      }
    ],
    facilities: globalFacilities
  },
  {
    id: "5",
    slug: "bedugul-tour",
    title: "Bedugul Tour",
    basePrice: 800000,
    description: "Experience the cool mountain air of Bedugul with beautiful gardens, iconic lake temples, and scenic farmlands.",
    highlights: [
      "Blooms Garden",
      "Ulun Danu Beratan Temple",
      "Strawberry Farm",
      "Tanah Lot Temple"
    ],
    itinerary: [
      {
        time: "07:00 AM",
        activity: "Hotel Pickup",
        description: "Early morning pickup to avoid crowds"
      },
      {
        time: "09:00 AM",
        activity: "Blooms Garden",
        description: "Explore the beautiful botanical gardens with colorful flowers"
      },
      {
        time: "10:30 AM",
        activity: "Ulun Danu Beratan Temple",
        description: "Visit the iconic water temple on Lake Beratan"
      },
      {
        time: "12:00 PM",
        activity: "Lunch Break",
        description: "Enjoy local cuisine in the mountain area"
      },
      {
        time: "01:30 PM",
        activity: "Strawberry Farm",
        description: "Pick fresh strawberries and enjoy the cool mountain climate"
      },
      {
        time: "03:00 PM",
        activity: "Scenic Drive",
        description: "Enjoy the beautiful journey to the coast"
      },
      {
        time: "05:00 PM",
        activity: "Tanah Lot Temple",
        description: "Visit the famous sea temple and enjoy sunset views"
      },
      {
        time: "07:00 PM",
        activity: "Return to Hotel",
        description: "Safe return to your accommodation"
      }
    ],
    facilities: globalFacilities
  },
  {
    id: "6",
    slug: "lempuyang-tour",
    title: "Lempuyang Tour",
    basePrice: 900000,
    description: "Visit East Bali's most stunning attractions including the iconic Gates of Heaven and beautiful water palaces.",
    highlights: [
      "Pura Lempuyang (Gates of Heaven)",
      "Tirta Gangga Water Palace",
      "Taman Ujung Water Palace",
      "Virgin Beach"
    ],
    itinerary: [
      {
        time: "05:00 AM",
        activity: "Hotel Pickup",
        description: "Very early pickup to catch sunrise at Lempuyang"
      },
      {
        time: "07:30 AM",
        activity: "Pura Lempuyang",
        description: "Visit the iconic Gates of Heaven with Mount Agung backdrop"
      },
      {
        time: "10:00 AM",
        activity: "Breakfast Break",
        description: "Enjoy local breakfast after temple visit"
      },
      {
        time: "11:00 AM",
        activity: "Tirta Gangga Water Palace",
        description: "Explore the beautiful water palace with ornate pools and fountains"
      },
      {
        time: "01:00 PM",
        activity: "Lunch Break",
        description: "Enjoy fresh local cuisine"
      },
      {
        time: "02:30 PM",
        activity: "Taman Ujung Water Palace",
        description: "Visit the stunning former royal palace"
      },
      {
        time: "04:00 PM",
        activity: "Virgin Beach",
        description: "Relax at the pristine white sand beach"
      },
      {
        time: "06:00 PM",
        activity: "Return to Hotel",
        description: "Long but scenic drive back to your accommodation"
      }
    ],
    facilities: globalFacilities
  },
  {
    id: "7",
    slug: "lovina-tour",
    title: "Lovina Tour",
    basePrice: 900000,
    description: "Experience North Bali's unique charm with dolphin watching, iconic photo spots, and serene lake temples.",
    highlights: [
      "Dolphin Watching Tour",
      "Handara Gate",
      "Ulun Danu Beratan Temple"
    ],
    itinerary: [
      {
        time: "04:00 AM",
        activity: "Hotel Pickup",
        description: "Very early pickup for dolphin watching"
      },
      {
        time: "06:00 AM",
        activity: "Dolphin Watching",
        description: "Traditional boat ride to see wild dolphins at sunrise"
      },
      {
        time: "08:00 AM",
        activity: "Breakfast Break",
        description: "Enjoy breakfast by the beach"
      },
      {
        time: "09:30 AM",
        activity: "Drive to Bedugul",
        description: "Scenic mountain drive with photo stops"
      },
      {
        time: "11:00 AM",
        activity: "Handara Gate",
        description: "Photo session at the iconic Balinese gate"
      },
      {
        time: "12:30 PM",
        activity: "Lunch Break",
        description: "Enjoy local mountain cuisine"
      },
      {
        time: "02:00 PM",
        activity: "Ulun Danu Beratan Temple",
        description: "Visit the iconic water temple on Lake Beratan"
      },
      {
        time: "04:00 PM",
        activity: "Return to Hotel",
        description: "Safe return to your accommodation"
      }
    ],
    facilities: globalFacilities
  }
];
