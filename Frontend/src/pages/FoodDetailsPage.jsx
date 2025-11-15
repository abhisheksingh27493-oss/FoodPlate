
import { useState } from 'react';
import { Star, Clock, Flame, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function FoodDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [isFavorite, setIsFavorite] = useState(false);

  const food = {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil on a crispy thin crust. Made with authentic ingredients imported from Italy.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop',
    rating: 4.8,
    reviews: 234,
    calories: 285,
    prepTime: '20-25 min',
    restaurant: 'Bella Italia',
    ingredients: ['Mozzarella Cheese', 'Fresh Tomatoes', 'Basil', 'Olive Oil', 'Pizza Dough', 'Sea Salt']
  };

  const sizes = [
    { name: 'small', label: 'Small (8")', price: 9.99 },
    { name: 'medium', label: 'Medium (12")', price: 12.99 },
    { name: 'large', label: 'Large (16")', price: 15.99 }
  ];

  const getCurrentPrice = () => {
    const size = sizes.find(s => s.name === selectedSize);
    return size ? size.price : food.price;
  };

  const getTotalPrice = () => {
    return (getCurrentPrice() * quantity).toFixed(2);
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-96 md:h-auto">
              <img 
                src={food.image} 
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Heart 
                  size={24} 
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-10">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{food.name}</h1>
                <p className="text-gray-500 text-lg">{food.restaurant}</p>
              </div>

              {/* Rating & Info */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                  <span className="font-semibold text-gray-800">{food.rating}</span>
                  <span className="text-gray-500">({food.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={18} />
                  <span>{food.prepTime}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Flame size={18} className="text-orange-500" />
                  <span>{food.calories} cal</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{food.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Select Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        selectedSize === size.name
                          ? 'border-red-500 bg-red-50 text-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium">{size.label}</div>
                      <div className="text-xs text-gray-500">${size.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {food.ingredients.map((ingredient, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Quantity</span>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors border border-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors border border-gray-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Price</div>
                  <div className="text-2xl font-bold text-red-500">${getTotalPrice()}</div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full py-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Similar Items Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Pepperoni Pizza', price: 13.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop' },
              { name: 'Veggie Pizza', price: 11.99, image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=300&h=200&fit=crop' },
              { name: 'BBQ Chicken Pizza', price: 14.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop' },
              { name: 'Hawaiian Pizza', price: 12.99, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300&h=200&fit=crop' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-red-500 font-bold">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}