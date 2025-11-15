import { Star } from 'lucide-react';

const restaurants = [
  { 
    id: 1, 
    name: 'Bella Italia', 
    cuisine: 'Italian', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'
  },
  { 
    id: 2, 
    name: 'Spice Garden', 
    cuisine: 'Indian', 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
  },
  { 
    id: 3, 
    name: 'Green Bowl', 
    cuisine: 'Healthy', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop'
  },
  { 
    id: 4, 
    name: 'Burger House', 
    cuisine: 'American', 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop'
  },
  { 
    id: 5, 
    name: 'Sushi Master', 
    cuisine: 'Japanese', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=300&fit=crop'
  },
  { 
    id: 6, 
    name: 'Taco Fiesta', 
    cuisine: 'Mexican', 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop'
  }
];

export default function FeaturedRestaurants() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Featured Restaurants</h2>
          <p className="text-gray-600">Discover the best restaurants near you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={18} />
                    <span className="font-medium text-gray-700">{restaurant.rating}</span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity px-6 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}