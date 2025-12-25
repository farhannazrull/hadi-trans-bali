'use client';

import { useState, useMemo } from 'react';
import { packages } from '@/data/packages';
import { vehicles, calculateTotalPrice, formatPrice } from '@/data/vehicles';

interface BookingFormProps {
  selectedPackageSlug?: string;
}

export default function BookingForm({ selectedPackageSlug }: BookingFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(selectedPackageSlug || '');
  const [selectedVehicle, setSelectedVehicle] = useState('avanza');

  const totalPrice = useMemo(() => {
    if (selectedPackage) {
      const pkg = packages.find(p => p.slug === selectedPackage);
      if (pkg) {
        return calculateTotalPrice(pkg.basePrice, selectedVehicle);
      }
    }
    return 0;
  }, [selectedPackage, selectedVehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !date || !selectedPackage) {
      alert('Please fill in all required fields');
      return;
    }

    const pkg = packages.find(p => p.slug === selectedPackage);
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    
    if (!pkg || !vehicle) return;

    const message = `Hello Hadi Trans Bali! 🌴

I would like to book a tour with the following details:

📋 *Booking Details:*
• Name: ${name}
• Date: ${date}
• Package: ${pkg.title}
• Vehicle: ${vehicle.name}
• Total Price: ${formatPrice(totalPrice)}

Please confirm availability. Thank you! 🙏`;

    const whatsappUrl = `https://wa.me/6281331970761?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Book Your Tour</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your full name"
          />
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Tour Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Package Selection */}
        <div>
          <label htmlFor="package" className="block text-sm font-medium text-gray-700 mb-2">
            Select Package *
          </label>
          <select
            id="package"
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Choose a package...</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.slug}>
                {pkg.title} - {formatPrice(pkg.basePrice)}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
            Select Vehicle *
          </label>
          <select
            id="vehicle"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} - {vehicle.description}
              </option>
            ))}
          </select>
        </div>

        {/* Price Display */}
        {selectedPackage && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total Price:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              * Price includes all facilities: Comfortable car, Friendly driver, Fuel & parking, Up to 12 hours, Hotel pickup
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Book via WhatsApp
        </button>
      </form>
    </div>
  );
}
