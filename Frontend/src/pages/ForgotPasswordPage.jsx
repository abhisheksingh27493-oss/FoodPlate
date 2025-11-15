// Forgot Password Page
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔒</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-gray-600 mt-2">No worries, we'll send you reset instructions</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-300"
                placeholder="your@email.com"
                required
              />
            </div>

            <button type="submit" className="w-full px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium">
              Send Reset Link
            </button>

            <Link to="/login" className="block text-center text-gray-600 hover:text-red-500">
              ← Back to Login
            </Link>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Check your email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to<br />
              <span className="font-medium text-gray-800">{email}</span>
            </p>
            <Link to="/login" className="inline-block px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}