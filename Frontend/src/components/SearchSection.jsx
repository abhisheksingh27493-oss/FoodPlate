import { MapPin, Search } from 'lucide-react';

export default function SearchSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Enter area or city" className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-red-300 transition-colors" />
            </div>
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search for dishes or places" className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-red-300 transition-colors" />
            </div>
            <button className="w-full md:w-auto px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}