export interface Vehicle {
  id: string;
  name: string;
  priceModifier: number;
  capacity: number;
  description: string;
}

export const vehicles: Vehicle[] = [
  {
    id: "avanza",
    name: "Toyota Avanza",
    priceModifier: 0,
    capacity: 6,
    description: "Standard comfortable vehicle (Base Price)"
  },
  {
    id: "innova",
    name: "Toyota Innova",
    priceModifier: 150000,
    capacity: 6,
    description: "Premium spacious vehicle (+150,000 IDR)"
  },
  {
    id: "brio",
    name: "Honda Brio",
    priceModifier: -50000,
    capacity: 4,
    description: "Compact economical vehicle (-50,000 IDR)"
  }
];

export const calculateTotalPrice = (basePrice: number, vehicleId: string): number => {
  const vehicle = vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return basePrice;
  return basePrice + vehicle.priceModifier;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
