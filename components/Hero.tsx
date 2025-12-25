export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 text-white py-20 md:py-32">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Hadi Trans Bali
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-semibold">
            Private Tour Bali 2025
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Experience the magic of Bali with our personalized private tours. 
            Explore stunning temples, pristine beaches, lush rice terraces, and authentic Balinese culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#packages"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Explore Packages
            </a>
            <a
              href="https://wa.me/6281331970761?text=Hello%20Hadi%20Trans%20Bali%2C%20I%20would%20like%20to%20inquire%20about%20your%20tour%20packages"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-white"
            >
              Book via WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
