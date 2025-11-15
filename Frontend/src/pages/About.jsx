// About Page
export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">About Food Plate</h1>
        
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-12 mb-12">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Food Plate is your trusted partner in bringing delicious meals right to your doorstep. We connect food lovers with the best restaurants in town, ensuring fresh, hot, and tasty food delivery every time.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            Founded in 2023, we've served over 100,000 happy customers and partnered with 500+ restaurants across the city. Our mission is simple: good food, delivered fast, with a smile.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Average delivery time under 30 minutes</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Quality Food</h3>
            <p className="text-gray-600">Partnered with top-rated restaurants</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">💝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Customer First</h3>
            <p className="text-gray-600">24/7 support for all your needs</p>
          </div>
        </div>
      </div>
    </div>
  );
}