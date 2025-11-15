import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">Food Plate</span>
            </div>

            <div className="flex items-center space-x-8">
              <Link to="/about" className="text-gray-600 hover:text-red-500 transition-colors text-sm">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-red-500 transition-colors text-sm">Contact</Link>
              <a href="#terms" className="text-gray-600 hover:text-red-500 transition-colors text-sm">Terms</a>
              <a href="#privacy" className="text-gray-600 hover:text-red-500 transition-colors text-sm">Privacy</a>
            </div>
          </div>

          <div className="text-center mt-8 text-gray-500 text-sm">
            © 2025 Food Plate. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}