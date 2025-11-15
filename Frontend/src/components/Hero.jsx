import { useState, useEffect } from 'react';

const foodImages = [
  { 
    name: 'Pizza', 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop'
  },
  { 
    name: 'Pasta', 
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop'
  },
  { 
    name: 'Thali', 
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop'
  },
  { 
    name: 'Salad', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop'
  },
  { 
    name: 'Burger', 
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop'
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % foodImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-80 h-80 mb-8">
            {foodImages.map((food, index) => (
              <div 
                key={food.name} 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                  index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
              >
                <div className="w-72 h-72 rounded-full overflow-hidden shadow-2xl">
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 max-w-3xl">
            Good food, made with effort — like you.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Order from your favorite restaurants, delivered fresh and fast.
          </p>

          <button className="px-10 py-4 bg-red-500 text-white text-lg font-medium rounded-full hover:bg-red-600 transition-all hover:scale-105 shadow-lg">
            Order Now
          </button>

          <div className="flex items-center space-x-2 mt-8">
            {foodImages.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentIndex(index)} 
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-red-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}