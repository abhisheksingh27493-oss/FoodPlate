import { useState, useEffect } from 'react';
import { Star, Clock, ShoppingBag } from 'lucide-react';
import foodService from '../api/foodService';
import { Link } from 'react-router-dom';

export default function FeaturedRestaurants() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await foodService.getAllFoods();
        setFoods(data.data || []);
      } catch (err) {
        console.error("Failed to fetch foods", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  if (loading) {
      return <div className="py-20 text-center">Loading yummy foods...</div>;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Menu</h2>
            <p className="text-xl text-gray-600">Delicious dishes added by our partners</p>
          </div>
          <a href="#" className="hidden md:flex items-center text-orange-600 font-bold hover:text-orange-700 transition">
            View All Dishes
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foods.map((food) => (
            <Link key={food._id} to={`/food/${food._id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"} 
                  alt={food.name} 
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-lg">
                  <Star className="w-4 h-4 text-orange-500 fill-current" />
                  <span className="ml-1 font-bold text-gray-900">{food.rating || '4.5'}</span>
                </div>
                {!food.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">Sold Out</span>
                    </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{food.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                       {food.category}
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
                    ₹{food.price}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>20-30 min</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    <span>Free Delivery</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {foods.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                  No food items available yet. check back later!
              </div>
          )}
        </div>
      </div>
    </section>
  );
}