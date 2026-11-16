'use client';

import { Link, useNavigate } from '@/lib/router';
import { getWhatsAppLink, config } from '../data/config';
import { useBooking } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';

const ServiceCard = ({ service, index = 0, variant = 'default' }) => {
  const isEven = index % 2 === 0;
  const navigate = useNavigate();
  const { updateBooking, resetBooking } = useBooking();
  const { formatPrice } = useCurrency();
  const whatsappMessage = config.whatsapp.bookingMessage(service.title);

  const handleBookService = () => {
    resetBooking();
    const serviceTypeMap = {
      'airport-transfers': 'airport-transfer',
      'private-car-driver': 'private-car',
      'full-day-tours': 'tour-package',
      'half-day-tours': 'tour-package',
      'custom-trips': 'custom',
    };
    updateBooking({ serviceType: serviceTypeMap[service.slug] || 'custom' });
    navigate('/booking');
  };

  if (variant === 'detailed') {
    return (
      <div
        id={service.slug}
        className="scroll-mt-32"
      >
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
          {/* Image */}
          <div className={`relative ${!isEven ? 'lg:order-2' : ''}`}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 lg:bottom-8 lg:-right-8 bg-white dark:bg-dark-green-900 rounded-2xl shadow-xl p-4 lg:p-6 transition-colors">
              <div className="text-3xl lg:text-4xl mb-1">{service.icon}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors">from</div>
              <div className="text-lg lg:text-xl font-semibold text-[#1a4d3e] dark:text-[#4ade80] transition-colors">{formatPrice(service.priceFrom)}</div>
            </div>
            {/* Decorative Element */}
            <div 
              className={`absolute -z-10 w-full h-full rounded-2xl top-4 ${isEven ? '-right-4' : '-left-4'}`}
              style={{ backgroundColor: service.color, opacity: 0.1 }}
            />
          </div>

          {/* Content */}
          <div className={`${!isEven ? 'lg:order-1' : ''}`}>
            <span className="inline-block text-[#c4935f] text-sm mb-4">
              {service.tagline}
            </span>
            <h3
              className="text-3xl lg:text-4xl font-light mb-4 text-gray-900 dark:text-white transition-colors"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              {service.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 transition-colors">
              {service.description}
            </p>

            {/* Includes */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-4 transition-colors">What's Included</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#c4935f] rounded-full" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal For */}
            <div className="p-4 bg-[#f3ede6] dark:bg-dark-green-900 rounded-xl mb-8 transition-colors">
              <span className="text-sm text-gray-500 dark:text-gray-400">Perfect for: </span>
              <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{service.idealFor}</span>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleBookService}
                className="btn-3d btn-3d-green-adaptive group inline-flex items-center gap-3 px-8 py-4 text-white dark:text-gray-900 rounded-xl"
              >
                <span>Book This Service</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <a
                href={getWhatsAppLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 border-2 border-gray-200 dark:border-dark-green-700 text-gray-600 dark:text-gray-300 rounded-xl hover:border-[#25D366] hover:text-[#25D366] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300"
              >
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <Link to={`/services#${service.slug}`} className="block">
        <div className="relative bg-white dark:bg-dark-green-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500">
          <div className="aspect-[3/2] overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{service.icon}</span>
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
            </div>
            <p className="text-white/80 text-sm line-clamp-2">{service.shortDescription}</p>
          </div>
          <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-dark-green-950/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 text-gray-900 dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard;
