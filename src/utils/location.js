// Utility to handle Geolocation and Reverse Geocoding

export const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await getAddressFromCoords(latitude, longitude);
          resolve({
            latitude,
            longitude,
            address: address || `${latitude}, ${longitude}`
          });
        } catch (error) {
          // If reverse geocoding fails, return coordinates
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude}, ${position.coords.longitude}`
          });
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('The request to get user location timed out'));
            break;
          default:
            reject(new Error('An unknown error occurred'));
            break;
        }
      }
    );
  });
};

export const getAddressFromCoords = async (lat, lon) => {
  try {
    // Using OpenStreetMap Nominatim API (Free, no key required for low volume)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'id-ID, en-US',
          'User-Agent': 'HadiTransBali/1.0'
        }
      }
    );
    const data = await response.json();
    
    if (!data.display_name) return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;

    // The display_name is usually the most complete, let's clean it up
    // Example: "Maya Sayang Villas, Jalan Taman Sari, Seminyak, Kuta, Badung, Bali, 80361, Indonesia"
    const rawParts = data.display_name.split(',').map(p => p.trim());
    
    // We want to remove the redundant parts at the end (Country, Postal Code, State)
    // But we want to keep everything else (Villas, Street, Village, District, City)
    
    // Filter out parts that are purely numbers (postal codes) or common country names
    const filteredParts = rawParts.filter((part, index) => {
      const isCountry = part.toLowerCase() === 'indonesia';
      const isPostalCode = /^\d+$/.test(part);
      const isProvince = part.toLowerCase() === 'bali' && index > rawParts.length - 4; // Only remove Bali if it's at the end
      
      return !isCountry && !isPostalCode && !isProvince;
    });

    // Join the remaining parts - this will be MUCH more detailed
    let detailedAddress = filteredParts.join(', ');

    // If for some reason it's still too short, just return the first 6 parts of display_name
    if (filteredParts.length < 2) {
      detailedAddress = rawParts.slice(0, 6).join(', ');
    }

    return detailedAddress;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};
