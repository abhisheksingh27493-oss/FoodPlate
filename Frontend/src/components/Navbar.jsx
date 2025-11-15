import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, User, MapPin, Star, Tag, TrendingDown, Clock, Plus, Smartphone, Mail, Phone, MapPinned, Send, Eye, EyeOff } from 'lucide-react';

// Navbar Component
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">FP</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">Food Plate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-red-500 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-red-500 transition-colors">Contact</Link>
          </div>

          <Link to="/login" className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
            <User size={18} />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}































