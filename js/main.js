/**
 * Hadi Trans Bali - Main JavaScript
 * Complete functionality for the tourism website
 */

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    whatsappNumber: '6281234567890',
    companyName: 'Hadi Trans Bali'
};

// ========================================
// PRICING DATA
// ========================================
const PRICES_IDR = {
    packages: {
        SouthBali: 650000,
        Ubud: 650000,
        Bangli: 750000,
        Bedugul: 700000,
        NorthBali: 800000,
        EastBali: 750000
    },
    vehicles: {
        Avanza: 0,
        Innova: 150000,
        Brio: -50000
    },
    addons: {
        guide: 250000,
        wifi: 50000,
        carseat: 50000
    },
    guest_threshold: 4,
    per_extra_guest: 50000
};

// ========================================
// TOUR PACKAGES DATA
// ========================================
const tourPackages = [
    {
        id: 'SouthBali',
        name: { en: 'South Bali Beach Tour', id: 'Tur Pantai Bali Selatan' },
        description: { 
            en: 'Visit stunning beaches including Kuta, Seminyak, and Uluwatu Temple', 
            id: 'Kunjungi pantai-pantai menakjubkan termasuk Kuta, Seminyak, dan Pura Uluwatu' 
        },
        duration: '8-10 hours',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        highlights: ['Kuta Beach', 'Seminyak', 'Uluwatu Temple', 'Sunset View']
    },
    {
        id: 'Ubud',
        name: { en: 'Ubud Cultural Tour', id: 'Tur Budaya Ubud' },
        description: { 
            en: 'Experience Balinese culture with rice terraces, temples, and art villages', 
            id: 'Nikmati budaya Bali dengan sawah terasering, pura, dan desa seni' 
        },
        duration: '8-10 hours',
        image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
        highlights: ['Tegalalang Rice Terrace', 'Monkey Forest', 'Art Villages', 'Tirta Empul']
    },
    {
        id: 'Bangli',
        name: { en: 'Bangli Highland Tour', id: 'Tur Dataran Tinggi Bangli' },
        description: { 
            en: 'Explore the highlands with Mount Batur views and coffee plantations', 
            id: 'Jelajahi dataran tinggi dengan pemandangan Gunung Batur dan perkebunan kopi' 
        },
        duration: '10-12 hours',
        image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80',
        highlights: ['Mount Batur', 'Coffee Plantation', 'Hot Spring', 'Kintamani']
    },
    {
        id: 'Bedugul',
        name: { en: 'Bedugul Lake Tour', id: 'Tur Danau Bedugul' },
        description: { 
            en: 'Visit beautiful lakes, the iconic Ulun Danu Temple, and botanical garden', 
            id: 'Kunjungi danau indah, Pura Ulun Danu yang ikonik, dan kebun raya' 
        },
        duration: '8-10 hours',
        image: 'https://images.unsplash.com/photo-1592364395653-83e648b20cc2?auto=format&fit=crop&w=800&q=80',
        highlights: ['Ulun Danu Temple', 'Lake Bratan', 'Botanical Garden', 'Strawberry Farm']
    },
    {
        id: 'NorthBali',
        name: { en: 'North Bali Adventure', id: 'Petualangan Bali Utara' },
        description: { 
            en: 'Discover hidden waterfalls, hot springs, and untouched beaches', 
            id: 'Temukan air terjun tersembunyi, sumber air panas, dan pantai yang masih alami' 
        },
        duration: '10-12 hours',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        highlights: ['Gitgit Waterfall', 'Lovina Beach', 'Dolphin Watching', 'Buddhist Temple']
    },
    {
        id: 'EastBali',
        name: { en: 'East Bali Explorer', id: 'Eksplorasi Bali Timur' },
        description: { 
            en: 'Explore ancient temples, water palaces, and scenic rice fields', 
            id: 'Jelajahi pura kuno, istana air, dan sawah yang indah' 
        },
        duration: '10-12 hours',
        image: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?auto=format&fit=crop&w=800&q=80',
        highlights: ['Tirta Gangga', 'Besakih Temple', 'Tenganan Village', 'Candidasa']
    }
];

// ========================================
// FLEET DATA
// ========================================
const fleetVehicles = [
    {
        id: 'Avanza',
        name: 'Toyota Avanza',
        capacity: '4-6 passengers',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
        features: ['AC', 'Comfortable Seats', 'Luggage Space'],
        priceAdjust: 0
    },
    {
        id: 'Innova',
        name: 'Toyota Innova',
        capacity: '6-7 passengers',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
        features: ['AC', 'Premium Seats', 'Extra Luggage Space', 'USB Charging'],
        priceAdjust: 150000
    },
    {
        id: 'Brio',
        name: 'Honda Brio',
        capacity: '2-4 passengers',
        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
        features: ['AC', 'Compact', 'Fuel Efficient'],
        priceAdjust: -50000
    }
];

// ========================================
// GALLERY IMAGES
// ========================================
const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', alt: 'Bali Rice Terrace' },
    { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80', alt: 'Bali Beach' },
    { url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80', alt: 'Ubud Monkey Forest' },
    { url: 'https://images.unsplash.com/photo-1592364395653-83e648b20cc2?auto=format&fit=crop&w=600&q=80', alt: 'Ulun Danu Temple' },
    { url: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=600&q=80', alt: 'Mount Batur' },
    { url: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?auto=format&fit=crop&w=600&q=80', alt: 'Tirta Gangga' },
    { url: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=600&q=80', alt: 'Bali Sunset' },
    { url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=600&q=80', alt: 'Bali Temple' }
];

// ========================================
// TESTIMONIALS DATA
// ========================================
const testimonials = [
    {
        name: 'John Smith',
        country: 'United States',
        rating: 5,
        text: { 
            en: 'Amazing experience with Hadi Trans Bali! Our driver was knowledgeable and friendly. Highly recommended!', 
            id: 'Pengalaman luar biasa dengan Hadi Trans Bali! Sopir kami berpengetahuan dan ramah. Sangat direkomendasikan!' 
        },
        image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
        name: 'Emma Wilson',
        country: 'Australia',
        rating: 5,
        text: { 
            en: 'Best tour service in Bali! The vehicle was clean and comfortable. Will definitely book again.', 
            id: 'Layanan tur terbaik di Bali! Kendaraannya bersih dan nyaman. Pasti akan memesan lagi.' 
        },
        image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
        name: 'Takeshi Yamamoto',
        country: 'Japan',
        rating: 5,
        text: { 
            en: 'Professional service and great value for money. Our Ubud tour was unforgettable!', 
            id: 'Layanan profesional dan nilai yang bagus. Tur Ubud kami tak terlupakan!' 
        },
        image: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
        name: 'Sophie Chen',
        country: 'Singapore',
        rating: 5,
        text: { 
            en: 'Friendly driver, flexible itinerary, and amazing hidden spots. Thank you Hadi Trans Bali!', 
            id: 'Sopir ramah, jadwal fleksibel, dan tempat tersembunyi yang menakjubkan. Terima kasih Hadi Trans Bali!' 
        },
        image: 'https://randomuser.me/api/portraits/women/4.jpg'
    }
];

// ========================================
// STATE MANAGEMENT
// ========================================
let currentLanguage = 'en';
let selectedPackage = null;
let selectedVehicle = 'Avanza';
let testimonialIndex = 0;
let testimonialIntervalId = null;

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function getText(obj) {
    if (typeof obj === 'string') return obj;
    return obj[currentLanguage] || obj.en;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('show');
        
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
}

// ========================================
// LANGUAGE TOGGLE
// ========================================
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    
    langToggle.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'id' : 'en';
        langToggle.textContent = currentLanguage === 'en' ? 'EN/ID' : 'ID/EN';
        updateLanguage();
    });
}

function updateLanguage() {
    // Update all elements with data-en and data-id attributes
    document.querySelectorAll('[data-en][data-id]').forEach(el => {
        const text = el.getAttribute(`data-${currentLanguage}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                // Preserve icons
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = '';
                    el.appendChild(icon.cloneNode(true));
                    el.appendChild(document.createTextNode(text));
                } else {
                    el.textContent = text;
                }
            }
        }
    });
    
    // Update placeholder attributes
    document.querySelectorAll('[data-en-placeholder][data-id-placeholder]').forEach(el => {
        el.placeholder = el.getAttribute(`data-${currentLanguage}-placeholder`);
    });
    
    // Re-render dynamic content
    renderPackages();
    renderFleet();
    renderTestimonials();
    renderBookings();
}

// ========================================
// PACKAGES SECTION
// ========================================
function renderPackages() {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;
    
    grid.innerHTML = tourPackages.map(pkg => `
        <div class="package-card bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="relative h-48 overflow-hidden">
                <img src="${pkg.image}" alt="${getText(pkg.name)}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                <div class="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    ${pkg.duration}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-primary mb-2">${getText(pkg.name)}</h3>
                <p class="text-gray-600 text-sm mb-4">${getText(pkg.description)}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${pkg.highlights.map(h => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${h}</span>`).join('')}
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">${currentLanguage === 'en' ? 'Starting from' : 'Mulai dari'}</p>
                        <p class="text-xl font-bold text-primary">${formatCurrency(PRICES_IDR.packages[pkg.id])}</p>
                    </div>
                    <button onclick="openBookingModal('${pkg.id}')" class="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium">
                        ${currentLanguage === 'en' ? 'Book Now' : 'Pesan'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// FLEET SECTION
// ========================================
function renderFleet() {
    const grid = document.getElementById('fleetGrid');
    if (!grid) return;
    
    grid.innerHTML = fleetVehicles.map(vehicle => `
        <div class="fleet-card bg-white rounded-xl shadow-lg overflow-hidden border-2 ${selectedVehicle === vehicle.id ? 'border-primary' : 'border-transparent'}" data-vehicle="${vehicle.id}">
            <div class="relative h-48 overflow-hidden">
                <img src="${vehicle.image}" alt="${vehicle.name}" class="w-full h-full object-cover">
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-primary mb-2">${vehicle.name}</h3>
                <p class="text-gray-600 mb-3">
                    <i class="fas fa-users mr-2"></i>${vehicle.capacity}
                </p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${vehicle.features.map(f => `<span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">${f}</span>`).join('')}
                </div>
                <div class="flex items-center justify-between">
                    <p class="text-sm ${vehicle.priceAdjust > 0 ? 'text-red-500' : vehicle.priceAdjust < 0 ? 'text-green-500' : 'text-gray-500'}">
                        ${vehicle.priceAdjust > 0 ? '+' : ''}${vehicle.priceAdjust !== 0 ? formatCurrency(vehicle.priceAdjust) : (currentLanguage === 'en' ? 'Base price' : 'Harga dasar')}
                    </p>
                    <button onclick="selectVehicle('${vehicle.id}')" class="px-4 py-2 ${selectedVehicle === vehicle.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} rounded-xl hover:bg-primary hover:text-white transition-colors font-medium">
                        ${selectedVehicle === vehicle.id ? (currentLanguage === 'en' ? 'Selected' : 'Terpilih') : (currentLanguage === 'en' ? 'Select' : 'Pilih')}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function selectVehicle(vehicleId) {
    selectedVehicle = vehicleId;
    renderFleet();
    updateTotalPrice();
    showToast(currentLanguage === 'en' ? 'Vehicle selected!' : 'Kendaraan dipilih!');
}

// ========================================
// GALLERY SECTION
// ========================================
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    grid.innerHTML = galleryImages.map(img => `
        <div class="gallery-item aspect-square">
            <img src="${img.url}" alt="${img.alt}" class="w-full h-full object-cover" loading="lazy">
        </div>
    `).join('');
}

// ========================================
// TESTIMONIALS CAROUSEL
// ========================================
function renderTestimonials() {
    const slider = document.getElementById('testimonialSlider');
    const dots = document.getElementById('testimonialDots');
    if (!slider || !dots) return;
    
    slider.innerHTML = testimonials.map(t => `
        <div class="testimonial-card flex-shrink-0 w-full">
            <div class="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div class="flex items-center mb-4">
                    <img src="${t.image}" alt="${t.name}" class="w-14 h-14 rounded-full object-cover mr-4">
                    <div>
                        <h4 class="font-semibold text-gray-800">${t.name}</h4>
                        <p class="text-sm text-gray-500">${t.country}</p>
                    </div>
                    <div class="ml-auto flex text-accent">
                        ${Array(t.rating).fill('<i class="fas fa-star"></i>').join('')}
                    </div>
                </div>
                <p class="text-gray-600 italic">"${getText(t.text)}"</p>
            </div>
        </div>
    `).join('');
    
    dots.innerHTML = testimonials.map((_, i) => `
        <button class="testimonial-dot w-3 h-3 rounded-full ${i === testimonialIndex ? 'bg-primary' : 'bg-gray-300'} transition-colors" data-index="${i}"></button>
    `).join('');
    
    updateTestimonialPosition();
}

function updateTestimonialPosition() {
    const slider = document.getElementById('testimonialSlider');
    if (slider) {
        slider.style.transform = `translateX(-${testimonialIndex * 100}%)`;
    }
    
    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
        dot.classList.toggle('bg-primary', i === testimonialIndex);
        dot.classList.toggle('bg-gray-300', i !== testimonialIndex);
    });
}

function initTestimonialCarousel() {
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dots = document.getElementById('testimonialDots');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonialPosition();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            testimonialIndex = (testimonialIndex + 1) % testimonials.length;
            updateTestimonialPosition();
        });
    }
    
    if (dots) {
        dots.addEventListener('click', (e) => {
            if (e.target.classList.contains('testimonial-dot')) {
                testimonialIndex = parseInt(e.target.dataset.index);
                updateTestimonialPosition();
            }
        });
    }
    
    // Auto-rotate testimonials (clear previous interval if exists)
    if (testimonialIntervalId) {
        clearInterval(testimonialIntervalId);
    }
    testimonialIntervalId = setInterval(() => {
        testimonialIndex = (testimonialIndex + 1) % testimonials.length;
        updateTestimonialPosition();
    }, 5000);
}

// ========================================
// BOOKINGS MANAGEMENT (localStorage)
// ========================================
function getBookings() {
    try {
        const bookings = localStorage.getItem('hadiTransBookings');
        return bookings ? JSON.parse(bookings) : [];
    } catch (e) {
        // If JSON is invalid, return empty array
        return [];
    }
}

function saveBooking(booking) {
    const bookings = getBookings();
    booking.id = Date.now();
    booking.createdAt = new Date().toISOString();
    bookings.push(booking);
    localStorage.setItem('hadiTransBookings', JSON.stringify(bookings));
}

function deleteBooking(bookingId) {
    const bookings = getBookings().filter(b => b.id !== bookingId);
    localStorage.setItem('hadiTransBookings', JSON.stringify(bookings));
    renderBookings();
    showToast(currentLanguage === 'en' ? 'Booking deleted' : 'Pemesanan dihapus');
}

function renderBookings() {
    const container = document.getElementById('bookingsContainer');
    const noBookings = document.getElementById('noBookings');
    const bookingsList = document.getElementById('bookingsList');
    
    if (!container) return;
    
    const bookings = getBookings();
    
    if (bookings.length === 0) {
        noBookings.classList.remove('hidden');
        bookingsList.classList.add('hidden');
    } else {
        noBookings.classList.add('hidden');
        bookingsList.classList.remove('hidden');
        
        bookingsList.innerHTML = bookings.map(booking => {
            const pkg = tourPackages.find(p => p.id === booking.packageId);
            return `
                <div class="booking-card bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div class="flex-1">
                        <h4 class="font-semibold text-primary text-lg">${pkg ? getText(pkg.name) : booking.packageId}</h4>
                        <p class="text-gray-600">
                            <i class="fas fa-calendar mr-2"></i>${new Date(booking.date).toLocaleDateString()}
                            <span class="mx-2">|</span>
                            <i class="fas fa-car mr-2"></i>${booking.vehicle}
                            <span class="mx-2">|</span>
                            <i class="fas fa-users mr-2"></i>${booking.guests} ${currentLanguage === 'en' ? 'guests' : 'tamu'}
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                            <i class="fas fa-user mr-2"></i>${booking.customerName}
                        </p>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="text-xl font-bold text-primary">${formatCurrency(booking.totalPrice)}</span>
                        <button onclick="deleteBooking(${booking.id})" class="text-red-500 hover:text-red-700 transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ========================================
// BOOKING MODAL
// ========================================
function openBookingModal(packageId) {
    const modal = document.getElementById('bookingModal');
    const pkg = tourPackages.find(p => p.id === packageId);
    
    if (!pkg) return;
    
    selectedPackage = pkg;
    
    // Update modal content
    document.getElementById('selectedPackageName').textContent = getText(pkg.name);
    document.getElementById('selectedPackagePrice').textContent = formatCurrency(PRICES_IDR.packages[packageId]);
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tourDate').min = today;
    document.getElementById('tourDate').value = today;
    
    // Reset form
    document.getElementById('vehicleSelect').value = selectedVehicle;
    document.getElementById('guestCount').value = 2;
    document.getElementById('addonGuide').checked = false;
    document.getElementById('addonWifi').checked = false;
    document.getElementById('addonCarseat').checked = false;
    
    updateTotalPrice();
    
    modal.classList.remove('hidden');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function calculateTotalPrice() {
    if (!selectedPackage) return 0;
    
    let total = PRICES_IDR.packages[selectedPackage.id];
    
    // Vehicle adjustment
    const vehicleSelect = document.getElementById('vehicleSelect');
    if (vehicleSelect) {
        total += PRICES_IDR.vehicles[vehicleSelect.value] || 0;
    }
    
    // Guest count adjustment
    const guestCount = parseInt(document.getElementById('guestCount')?.value || 2);
    if (guestCount > PRICES_IDR.guest_threshold) {
        total += (guestCount - PRICES_IDR.guest_threshold) * PRICES_IDR.per_extra_guest;
    }
    
    // Add-ons
    if (document.getElementById('addonGuide')?.checked) {
        total += PRICES_IDR.addons.guide;
    }
    if (document.getElementById('addonWifi')?.checked) {
        total += PRICES_IDR.addons.wifi;
    }
    if (document.getElementById('addonCarseat')?.checked) {
        total += PRICES_IDR.addons.carseat;
    }
    
    return total;
}

function updateTotalPrice() {
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.textContent = formatCurrency(calculateTotalPrice());
    }
}

function initBookingModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.getElementById('closeModal');
    const overlay = document.getElementById('modalOverlay');
    const bookingForm = document.getElementById('bookingForm');
    
    // Close modal handlers
    closeBtn?.addEventListener('click', closeBookingModal);
    overlay?.addEventListener('click', closeBookingModal);
    
    // Price update handlers
    document.getElementById('vehicleSelect')?.addEventListener('change', updateTotalPrice);
    document.getElementById('guestCount')?.addEventListener('input', updateTotalPrice);
    document.getElementById('addonGuide')?.addEventListener('change', updateTotalPrice);
    document.getElementById('addonWifi')?.addEventListener('change', updateTotalPrice);
    document.getElementById('addonCarseat')?.addEventListener('change', updateTotalPrice);
    
    // Form submission
    bookingForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const booking = {
            packageId: selectedPackage.id,
            packageName: getText(selectedPackage.name),
            vehicle: document.getElementById('vehicleSelect').value,
            guests: parseInt(document.getElementById('guestCount').value),
            date: document.getElementById('tourDate').value,
            addons: {
                guide: document.getElementById('addonGuide').checked,
                wifi: document.getElementById('addonWifi').checked,
                carseat: document.getElementById('addonCarseat').checked
            },
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            totalPrice: calculateTotalPrice()
        };
        
        // Save to localStorage
        saveBooking(booking);
        
        // Generate WhatsApp message
        const message = generateWhatsAppMessage(booking);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        closeBookingModal();
        renderBookings();
        showToast(currentLanguage === 'en' ? 'Booking created! Opening WhatsApp...' : 'Pemesanan dibuat! Membuka WhatsApp...');
    });
}

function generateWhatsAppMessage(booking) {
    const addons = [];
    if (booking.addons.guide) addons.push(currentLanguage === 'en' ? 'English Guide' : 'Pemandu Bahasa Inggris');
    if (booking.addons.wifi) addons.push(currentLanguage === 'en' ? 'Portable WiFi' : 'WiFi Portabel');
    if (booking.addons.carseat) addons.push(currentLanguage === 'en' ? 'Child Car Seat' : 'Kursi Mobil Anak');
    
    if (currentLanguage === 'en') {
        return `🌴 *HADI TRANS BALI BOOKING*

Hello! I would like to book a tour:

📍 *Package:* ${booking.packageName}
📅 *Date:* ${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
🚗 *Vehicle:* ${booking.vehicle}
👥 *Guests:* ${booking.guests}
${addons.length > 0 ? `✨ *Add-ons:* ${addons.join(', ')}` : ''}

💰 *Total Price:* ${formatCurrency(booking.totalPrice)}

👤 *Name:* ${booking.customerName}
📱 *Phone:* ${booking.customerPhone}

Please confirm my booking. Thank you! 🙏`;
    } else {
        return `🌴 *PEMESANAN HADI TRANS BALI*

Halo! Saya ingin memesan tur:

📍 *Paket:* ${booking.packageName}
📅 *Tanggal:* ${new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
🚗 *Kendaraan:* ${booking.vehicle}
👥 *Tamu:* ${booking.guests}
${addons.length > 0 ? `✨ *Tambahan:* ${addons.join(', ')}` : ''}

💰 *Total Harga:* ${formatCurrency(booking.totalPrice)}

👤 *Nama:* ${booking.customerName}
📱 *Telepon:* ${booking.customerPhone}

Mohon konfirmasi pemesanan saya. Terima kasih! 🙏`;
    }
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const whatsapp = document.getElementById('contactWhatsApp').value;
        const message = document.getElementById('contactMessage').value;
        
        let whatsappMessage;
        if (currentLanguage === 'en') {
            whatsappMessage = `🌴 *HADI TRANS BALI INQUIRY*

Hello! I have a question/inquiry:

👤 *Name:* ${name}
📧 *Email:* ${email}
📱 *WhatsApp:* ${whatsapp}

💬 *Message:*
${message}

Looking forward to your response! 🙏`;
        } else {
            whatsappMessage = `🌴 *PERTANYAAN HADI TRANS BALI*

Halo! Saya punya pertanyaan:

👤 *Nama:* ${name}
📧 *Email:* ${email}
📱 *WhatsApp:* ${whatsapp}

💬 *Pesan:*
${message}

Menunggu balasan Anda! 🙏`;
        }
        
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        form.reset();
        showToast(currentLanguage === 'en' ? 'Opening WhatsApp...' : 'Membuka WhatsApp...');
    });
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// INITIALIZE APP
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initLanguageToggle();
    initSmoothScroll();
    initCounters();
    initTestimonialCarousel();
    initBookingModal();
    initContactForm();
    
    // Render dynamic content
    renderPackages();
    renderFleet();
    renderGallery();
    renderTestimonials();
    renderBookings();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Make functions available globally
window.openBookingModal = openBookingModal;
window.selectVehicle = selectVehicle;
window.deleteBooking = deleteBooking;
