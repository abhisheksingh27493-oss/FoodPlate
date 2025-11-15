import { Star } from 'lucide-react';

const reviews = [
  { id: 1, name: 'Sarah Johnson', review: 'Amazing service! The food arrived hot and fresh. Definitely ordering again.', rating: 5, avatar: '👩' },
  { id: 2, name: 'Michael Chen', review: 'Best food delivery app I have used. Great variety of restaurants to choose from.', rating: 5, avatar: '👨' },
  { id: 3, name: 'Emma Wilson', review: 'Quick delivery and excellent customer support. Highly recommended!', rating: 5, avatar: '👩‍🦰' },
  { id: 4, name: 'James Brown', review: 'Love the user-friendly interface. Makes ordering food so easy and convenient.', rating: 5, avatar: '👨‍🦱' }
];

export default function Reviews() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">What Our Customers Say</h2>
          <p className="text-gray-600">Real experiences from real people</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mr-3">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{review.name}</h4>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="fill-yellow-400 text-yellow-400" size={14} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
