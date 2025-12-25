# Hadi Trans Bali 🌴

A professional tourism website for Hadi Trans Bali - Private Tour & Transportation services in Bali, Indonesia.

## Features

### 🎯 Complete Website Sections
- **Header/Navbar** - Sticky, transparent with blur effect on scroll
- **Hero Section** - Beautiful Bali background with CTAs
- **Packages** - 6 tour packages (South Bali, Ubud, Bangli, Bedugul, North Bali, East Bali)
- **Fleet** - Vehicle options (Toyota Avanza, Innova, Honda Brio)
- **Gallery** - Photo gallery with hover zoom effects
- **Documentation** - Customer testimonials carousel
- **Bookings** - Booking management with localStorage
- **About** - Company profile with animated counters
- **Contact** - Contact form with WhatsApp integration
- **Footer** - Professional footer with links

### 💰 Dynamic Pricing System
```javascript
PRICES_IDR = {
    packages: { SouthBali:650000, Ubud:650000, Bangli:750000, Bedugul:700000, NorthBali:800000, EastBali:750000 },
    vehicles: { Avanza:0, Innova:150000, Brio:-50000 },
    addons: { guide:250000, wifi:50000, carseat:50000 },
    guest_threshold: 4,
    per_extra_guest: 50000
}
```

### 🌐 Bilingual Support
- English (EN) and Indonesian (ID) language toggle
- All text elements support both languages

### 📱 Responsive Design
- Mobile-first approach
- Works on all devices and screen sizes

### 🛠 Technologies
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- Font Awesome icons
- Google Fonts (Poppins)

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. No build process required!

## Project Structure
```
hadi-trans-bali/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Custom styles
├── js/
│   └── main.js         # JavaScript functionality
├── images/             # Image assets (using Unsplash for demo)
└── README.md           # This file
```

## Customization

### Change WhatsApp Number
In `js/main.js`, update the phone number in WhatsApp URLs:
```javascript
const whatsappUrl = `https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(message)}`;
```

### Update Pricing
Modify the `PRICES_IDR` object in `js/main.js` to change tour prices.

### Add New Packages
Add new package objects to the `tourPackages` array in `js/main.js`.

## License

© 2025 Hadi Trans Bali. All rights reserved.