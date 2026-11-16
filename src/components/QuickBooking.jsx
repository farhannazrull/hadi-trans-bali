'use client';

import { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { getCurrentLocation } from '../utils/location';

const QuickBooking = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { updateBooking, resetBooking } = useBooking();
  const [activeTab, setActiveTab] = useState('car'); // car, tour, airport
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const tabs = [
    { 
      id: 'car', 
      label: language === 'id' ? 'Sewa Mobil' : 'Rent Car', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ) 
    },
    { 
      id: 'tour', 
      label: language === 'id' ? 'Paket Tour' : 'Tour Package', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      ) 
    },
    { 
      id: 'airport', 
      label: language === 'id' ? 'Antar Jemput' : 'Transfer', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ) 
    },
  ];

  const handleUseLocation = async () => {
    setIsLocating(true);
    try {
      const { address } = await getCurrentLocation();
      setLocation(address);
    } catch (error) {
      alert(language === 'id' ? 'Gagal mendapatkan lokasi: ' + error.message : 'Failed to get location: ' + error.message);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSearch = () => {
    resetBooking();
    
    let serviceType = 'private-car';
    if (activeTab === 'tour') serviceType = 'tour-package';
    if (activeTab === 'airport') serviceType = 'airport-transfer';

    updateBooking({
      serviceType,
      pickupLocation: location,
      pickupDate: date,
    });

    navigate('/booking');
  };

  return (
    <div className="absolute bottom-24 md:bottom-20 inset-x-0 z-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="bg-white dark:bg-dark-green-900 rounded-2xl shadow-xl p-1 md:p-1.5 border border-gray-100 dark:border-dark-green-700 transition-colors">
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-dark-green-800 rounded-xl mb-1.5 md:mb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-2.5 md:py-2 px-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-dark-green-700 text-[#1a4d3e] dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-[#1a4d3e] dark:text-[#4ade80] hidden sm:block' : 'hidden sm:block text-gray-400 dark:text-gray-500 transition-colors'}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3 px-2 md:px-3 pb-1.5 md:pb-4">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 ml-1">
              {language === 'id' ? 'Lokasi Jemput' : 'Pick-up Location'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={language === 'id' ? 'Hotel, Bandara, dll...' : 'Hotel, Airport, etc...'}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-dark-green-950 border-none rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#c4935f] transition-all"
              />
              <button
                onClick={handleUseLocation}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a4d3e] dark:hover:text-[#4ade80] transition-colors"
                title={language === 'id' ? 'Gunakan lokasi saat ini' : 'Use current location'}
              >
                {isLocating ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 ml-1">
              {language === 'id' ? 'Tanggal' : 'Date'}
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-dark-green-950 border-none rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#c4935f] transition-all"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="flex items-end mt-1 md:mt-0">
            <button
              onClick={handleSearch}
              className="btn-3d btn-3d-bronze w-full py-2.5 px-6 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {language === 'id' ? 'Cek Ketersediaan' : 'Check Availability'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default QuickBooking;
