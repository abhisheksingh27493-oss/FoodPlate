
import { useState, useEffect } from 'react';
import { Star, Clock, Flame, Heart, Minus, Plus, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import foodService from '../api/foodService';

export default function FoodDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [isFavorite, setIsFavorite] = useState(false);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch food details - if mock data is desired until backend is fully populated, 
  // we can fallback. For now trying to fetch.
  // Assuming backend doesn't have size/prepTime etc yet, merging with mock for display if needed.
  useEffect(() => {
    const fetchFood = async () => {
        try {
            const data = await foodService.getFoodById(id);
            // Backend returns { success: true, data: { ... } } or just data depending on service
            // foodService.getFoodById returns response.data which is likely { success: true, data: ... }
            if (data.success) {
                setFood(data.data);
            } else {
                setFood(data); // In case it returns direct object
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    fetchFood();
  }, [id]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!food) return <div className="pt-24 text-center">Food not found</div>;

  const sizes = [
    { name: 'small', label: 'Small (8")', price: food.price * 0.8 },
    { name: 'medium', label: 'Medium (12")', price: food.price },
    { name: 'large', label: 'Large (16")', price: food.price * 1.2 }
  ];

  const getCurrentPrice = () => {
    const size = sizes.find(s => s.name === selectedSize);
    return size ? size.price : food.price;
  };

  const getTotalPrice = () => {
    return (getCurrentPrice() * quantity).toFixed(2);
  };

  const handleAddToCart = () => {
      // Need to pass formatted food object
      // Using food._id for consistency with backend
      const itemToAdd = {
          ...food,
          price: getCurrentPrice() // Override base price with sized price
      };
      addToCart(itemToAdd, quantity);
      alert('Added to cart!');
  };

  const handleBuyNow = () => {
      if (!food || !food._id) {
          alert('Error: Food item ID is missing');
          return;
      }

      const itemToBuy = {
        food: {
            ...food,
            // Ensure ID is present
            _id: food._id 
        },
        quantity: quantity,
        price: getCurrentPrice()
      };

      navigate('/checkout', { 
          state: { 
              items: [itemToBuy]
              // type: 'direct' - Removed to prevent interference with orderType enum
          } 
      });
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
                <p className="text-gray-500 text-lg">{food.restaurant || 'FootPlate Kitchen'}</p>
              </div>

              {/* Rating & Info */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                  <span className="font-semibold text-gray-800">{food.rating || 4.5}</span>
                  <span className="text-gray-500">({food.reviews || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={18} />
                  <span>{food.prepTime || '15-20 min'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Flame size={18} className="text-orange-500" />
                  <span>{food.calories || 250} cal</span>
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
                      <div className="text-xs text-gray-500">₹{size.price.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {food.ingredients && food.ingredients.length > 0 ? (
                    food.ingredients.map((ingredient, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))
                  ) : (
                    <span className="text-gray-500 text-sm">Ingredients info not available</span>
                  )}
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
                  <div className="text-2xl font-bold text-red-500">₹{getTotalPrice()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-white border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                </button>
                <button 
                    onClick={handleBuyNow}
                    className="flex-1 py-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                    <ShoppingBag size={20} />
                    <span>Buy Now</span>
                </button>
              </div>
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
                  <p className="text-red-500 font-bold">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}