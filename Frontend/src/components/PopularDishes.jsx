import { Plus } from 'lucide-react';

const dishes = [
  { 
    id: 1, 
    name: 'Margherita Pizza', 
    price: 12.99, 
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop'
  },
  { 
    id: 2, 
    name: 'Chicken Biryani', 
    price: 14.99, 
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop'
  },
  { 
    id: 3, 
    name: 'Caesar Salad', 
    price: 9.99, 
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'
  },
  { 
    id: 4, 
    name: 'Classic Burger', 
    price: 11.99, 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
  },
  { 
    id: 5, 
    name: 'Pad Thai', 
    price: 13.99, 
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop'
  },
  { 
    id: 6, 
    name: 'Salmon Sushi', 
    price: 16.99, 
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop'
  },
  { 
    id: 7, 
    name: 'Tacos al Pastor', 
    price: 10.99, 
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop'
  },
  { 
    id: 8, 
    name: 'Chicken Wings', 
    price: 8.99, 
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop'
  }
];

export default function PopularDishes() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Popular Dishes</h2>
          <p className="text-gray-600">Quick add your favorites</p>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {dishes.map((dish) => (
            <div key={dish.id} className="flex-shrink-0 w-64 bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
              <div className="w-full h-40 bg-white overflow-hidden">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">{dish.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-red-500">₹{dish.price}</span>
                  <button className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <Plus size={18} />
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