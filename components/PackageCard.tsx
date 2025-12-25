import Link from 'next/link';
import { Package } from '@/data/packages';
import { formatPrice } from '@/data/vehicles';

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
        <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
        <div className="text-3xl font-bold">{formatPrice(pkg.basePrice)}</div>
        <p className="text-sm opacity-90 mt-1">per car / day</p>
      </div>
      
      <div className="p-6 flex-grow">
        <p className="text-gray-600 mb-4">{pkg.description}</p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Highlights:</h4>
          <ul className="space-y-2">
            {pkg.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link
          href={`/packages/${pkg.slug}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-green-600 text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
        >
          View Details & Book
        </Link>
      </div>
    </div>
  );
}
