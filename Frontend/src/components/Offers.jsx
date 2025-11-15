import { Tag, TrendingDown, Clock } from 'lucide-react';

const offers = [
  { id: 1, title: 'First Order Discount', description: 'Flat 30% Off on your first order', icon: Tag, bgColor: 'bg-red-50', iconColor: 'text-red-500' },
  { id: 2, title: 'Weekend Special', description: 'Get 20% off on orders above $25', icon: TrendingDown, bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
  { id: 3, title: 'Quick Delivery', description: 'Free delivery on orders above $15', icon: Clock, bgColor: 'bg-amber-50', iconColor: 'text-amber-500' }
];

export default function Offers() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Special Offers</h2>
          <p className="text-gray-600">Save more with our exclusive deals</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className={`${offer.bgColor} rounded-2xl p-8 hover:shadow-lg transition-all`}>
              <div className={`w-14 h-14 ${offer.bgColor} rounded-full flex items-center justify-center mb-4 ring-2 ring-white shadow-sm`}>
                <offer.icon className={offer.iconColor} size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{offer.title}</h3>
              <p className="text-gray-600">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}