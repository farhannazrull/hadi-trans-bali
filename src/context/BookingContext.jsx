'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from './LanguageContext';
import { useNavigate } from '../lib/router';

const BookingContext = createContext(null);

const STORAGE_KEY = 'htb_booking_draft';

const initialBookingState = {
  // Step 1: Service Selection
  serviceType: '', // 'airport-transfer', 'private-car', 'tour-package', 'custom'
  selectedPackage: null,
  rentalDuration: 10, // Default 10 hours for private car
  tripArea: 'standard', // 'standard', 'out-of-town',

  // Step 2: Trip Details
  tripType: 'one-way', // 'one-way', 'round-trip' (for airport)
  pickupLocation: '',
  pickupCoords: null, // {lat, lng}
  dropoffLocation: '',
  dropoffCoords: null, // {lat, lng}
  pickupDate: '',
  pickupTime: '',
  returnDate: '',
  returnTime: '',
  flightNumber: '',

  // Step 3: Passengers & Vehicle
  passengers: 1,
  vehicleCount: 1,
  luggage: 'small', // legacy
  luggageCounts: {
    small: 0,
    medium: 0,
    large: 0
  },
  childSeat: false,
  childSeatCount: 0,
  selectedVehicle: null,
  specialRequests: '',

  // Step 4: Contact Information
  fullName: '',
  email: '',
  phone: '',
  whatsapp: '',
  preferredContact: 'whatsapp', // 'whatsapp', 'email', 'phone'

  // Pricing
  estimatedPrice: 0,
  currency: 'IDR',
};

export const BookingProvider = ({ children }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // The site is prerendered, so the saved draft is loaded after mount (not during the initial render).
  const [bookingData, setBookingData] = useState(initialBookingState);
  const [currentStep, setCurrentStep] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [resumedDraft, setResumedDraft] = useState(false);

  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          // Merge with initial state to ensure new keys (like luggageCounts) exist
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setBookingData({
            ...initialBookingState,
            ...parsed.data,
            luggageCounts: parsed.data.luggageCounts || initialBookingState.luggageCounts
          });
        }
        // Only restore step if it's not the last step (Success)
        if (parsed.step) setCurrentStep(parsed.step < 5 ? parsed.step : 1);
        if (parsed.step > 1 && parsed.step < 5) setResumedDraft(true);
      }
    } catch {
      // Ignore broken drafts
    }
    setHydrated(true);
  }, []);

  // Save to localStorage whenever data or step changes
  useEffect(() => {
    if (!hydrated || isBookingComplete) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data: bookingData,
      step: currentStep,
      updatedAt: Date.now()
    }));
  }, [bookingData, currentStep, isBookingComplete, hydrated]);

  const updateBooking = useCallback((updates) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const calculatePrice = useCallback(() => {
    // For custom service, if we already have an estimatedPrice (from Calculator), use it.
    if (bookingData.serviceType === 'custom' && bookingData.estimatedPrice > 0) {
      return bookingData.estimatedPrice;
    }

    let basePrice = 0;

    // Base prices by service type (fallbacks)
    const basePrices = {
      'airport-transfer': 250000,
      'private-car': 500000,
      'tour-package': 600000,
      'custom': 500000,
    };

    // Use selected car tier price and capacity if available
    if (bookingData.selectedCarTier) {
      basePrice = bookingData.selectedCarTier.price;

    } else if (bookingData.selectedPackage) {
      basePrice = bookingData.selectedPackage.startingPrice;
    } else {
      basePrice = basePrices[bookingData.serviceType] || 0;
    }

    // Multiply base price by number of vehicles
    const vehicleCount = bookingData.vehicleCount || 1;
    basePrice *= vehicleCount;

    // Specific logic for Private Car & Driver surcharges
    if (bookingData.serviceType === 'private-car') {
      // Duration surcharge (e.g., 12 hours is +100,000 on top of base)
      if (bookingData.rentalDuration === 12) {
        basePrice += 100000;
      }
      // Area surcharge (Out of town is +150,000)
      if (bookingData.tripArea === 'out-of-town') {
        basePrice += 150000;
      }
    }

    // Round trip multiplier for airport transfer
    if (bookingData.serviceType === 'airport-transfer' && bookingData.tripType === 'round-trip') {
      basePrice *= 1.8;
    }

    // Child seat
    if (bookingData.childSeat) {
      basePrice += (bookingData.childSeatCount || 0) * 50000;
    }

    // Large luggage surcharge
    if (bookingData.luggage === 'large') {
      basePrice += 100000;
    }

    return Math.round(basePrice);
  }, [bookingData]);

  const generateBookingReference = useCallback(() => {
    const prefix = 'HTB';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }, []);

  const submitBooking = useCallback(async (user = null, options = {}) => {
    // Cooldown check (Prevent spam)
    const lastSubmission = localStorage.getItem('last_booking_time');
    const now = Date.now();
    if (lastSubmission && now - parseInt(lastSubmission) < 2 * 60 * 1000) { // 2 menit cooldown
      const remainingSecs = Math.ceil((2 * 60 * 1000 - (now - parseInt(lastSubmission))) / 1000);
      throw new Error(language === 'id'
        ? `Mohon tunggu ${remainingSecs} detik sebelum membuat pesanan baru.`
        : `Please wait ${remainingSecs} seconds before making another booking.`);
    }

    const reference = generateBookingReference();
    const estimatedPrice = calculatePrice();
    const submittedAt = new Date().toISOString();
    const paymentMethod = options.paymentMethod || 'manual';

    const bookingRecord = {
      reference,
      ...bookingData,
      estimatedPrice,
      submittedAt,
      status: 'pending',
      createdAt: submittedAt,
      paymentMethod,
      paymentStatus: 'unpaid',
    };

    try {
      // 1. Attempt Save to Firestore
      const bookingRef = doc(db, 'bookings', reference);
      const finalBookingData = {
        ...bookingRecord,
        userId: user ? user.uid : 'guest',
        userEmail: user ? user.email : bookingData.email,
        createdAt: serverTimestamp(),
      };


      try {
        // Use a shorter 5s timeout for the Firestore attempt to fail fast and trigger fallback
        const firestorePromise = setDoc(bookingRef, finalBookingData);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 5000)
        );

        await Promise.race([firestorePromise, timeoutPromise]);
      } catch (fsError) {
        console.warn('Firestore save failed or timed out, proceeding with local only + WhatsApp fallback', fsError);
        // We continue anyway so the user isn't stuck
      }

      // 2. Local fallback storage
      try {
        const existingGuestBookings = JSON.parse(localStorage.getItem('guestBookings') || '[]');
        const newBookingForLocal = {
          ...bookingRecord,
          id: reference,
          userId: user ? user.uid : 'guest',
          createdAt: submittedAt
        };
        localStorage.setItem('guestBookings', JSON.stringify([newBookingForLocal, ...existingGuestBookings]));
      } catch (e) {
        console.error('Error saving to local storage:', e);
      }

      localStorage.setItem('last_booking_time', Date.now().toString());
      setBookingReference(reference);
      setIsBookingComplete(true);
      localStorage.removeItem(STORAGE_KEY);
      // A real route change (not just a URL tweak) so ad platforms' conversion tags, which only
      // fire on an actual page load, can detect it. BookingContext stays mounted across this
      // client-side navigation, so bookingReference/bookingData are still there on the new page.
      navigate('/booking/selesai/');

      return reference;

    } catch (error) {
      console.error('CRITICAL ERROR during booking:', error);
      alert(language === 'id'
        ? 'Terjadi kesalahan saat menyimpan pesanan: ' + error.message
        : 'An error occurred while saving your booking: ' + error.message);
      throw error;
    }
  }, [bookingData, calculatePrice, generateBookingReference, language, navigate]);

  const processPayment = useCallback(async (bookingRef, amount, customerDetails) => {
    try {
      // This requires a backend function (Firebase Function) to generate the token
      // Since we are client-side only for this demo, we will simulate the call

      console.log('Requesting payment token for:', bookingRef, amount, 'Customer:', customerDetails.email);

      // Simulate server response delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, message: "Payment initiated (Simulation)" };
    } catch (error) {
      console.error("Payment Error:", error);
      return { success: false, error: error.message };
    }
  }, []);

  const resetBooking = useCallback(() => {
    setBookingData(initialBookingState);
    setCurrentStep(1);
    setResumedDraft(false);
    setIsBookingComplete(false);
    setBookingReference('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    bookingData,
    currentStep,
    isBookingComplete,
    bookingReference,
    showTermsModal,
    setShowTermsModal,
    updateBooking,
    nextStep,
    prevStep,
    goToStep,
    calculatePrice,
    submitBooking,
    processPayment,
    resetBooking,
    resumedDraft,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
