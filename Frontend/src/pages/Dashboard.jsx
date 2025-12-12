import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have AuthContext, if not will use localStorage
import authApi from '../api/authApi';
import restaurantService from '../api/restaurantService';
import { User, ShoppingBag, Store, LogOut, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [restaurantStatus, setRestaurantStatus] = useState(null); // null, 'pending', 'approved', 'rejected'
    
    // If you don't have AuthContext, fallback to API
    useEffect(() => {
        const loadData = async () => {
             try {
                 const userData = await authApi.getMe();
                 setUser(userData.data); // data.data because authApi returns full response object logic check
                 
                 // Check restaurant application status
                 if(userData.data.role === 'user') {
                     const statusData = await restaurantService.getRestaurantStatus();
                     // If statusData is null, no application. Or check structure
                     if(statusData && statusData.data) {
                         setRestaurantStatus(statusData.data.status);
                     }
                 }
             } catch (error) {
                 console.error("Failed to load dashboard data", error);
             } finally {
                 setLoading(false);
             }
        };
        loadData();
    }, []);

    const handleLogout = () => {
        authApi.logout();
        navigate('/login');
    };

    const handleApplyRestaurant = async () => {
        const title = prompt("Enter your Restaurant Name:");
        const address = prompt("Enter Restaurant Address:");
        const phone = prompt("Enter Contact Phone:");
        
        if(title && address && phone) {
            try {
                await restaurantService.applyRestaurant({ title, address, phone });
                setRestaurantStatus('pending');
                alert("Application submitted successfully!");
            } catch (error) {
                alert(error.message || "Application failed");
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
             <div className="max-w-4xl mx-auto">
                 {/* Profile Card */}
                 <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
                     <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                         <User size={40} />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                         <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                         <p className="text-gray-500">{user?.email}</p>
                         <div className="mt-2 inline-flex px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium capitalize">
                             {user?.role}
                         </div>
                     </div>
                     <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition">
                         <LogOut size={18} /> Logout
                     </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* My Orders */}
                     <Link to="/myorders" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition group border border-transparent hover:border-orange-200">
                         <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                             <ShoppingBag />
                         </div>
                         <h3 className="text-lg font-bold text-gray-900 mb-2">My Orders</h3>
                         <p className="text-gray-500">View your order history and track active orders.</p>
                     </Link>

                     {/* Restaurant Partner / Dashboard */}
                     {user?.role === 'restaurant' || user?.role === 'admin' ? (
                          <Link to="/restaurant/dashboard" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition group border border-transparent hover:border-green-200">
                             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                 <Store />
                             </div>
                             <h3 className="text-lg font-bold text-gray-900 mb-2">Restaurant Dashboard</h3>
                             <p className="text-gray-500">Manage your menu, orders, and restaurant settings.</p>
                         </Link>
                     ) : (
                         <div className="bg-white p-6 rounded-xl shadow-sm">
                             <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                                 <Store />
                             </div>
                             <h3 className="text-lg font-bold text-gray-900 mb-2">Partner with us</h3>
                             
                             {restaurantStatus === 'pending' ? (
                                 <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                                     <Loader2 className="animate-spin" size={18} /> Application Pending Review
                                 </div>
                             ) : restaurantStatus === 'rejected' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                        <AlertTriangle size={18} /> Application Rejected
                                    </div>
                                    <button onClick={handleApplyRestaurant} className="text-orange-600 font-medium hover:underline">Re-apply</button>
                                </div>
                             ) : restaurantStatus === 'approved' ? (
                                 // Should ideally be covered by role check above, but purely defensive
                                 <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                                     <CheckCircle size={18} /> Approved! Please re-login to see changes.
                                 </div>
                             ) : (
                                 <div className="space-y-3">
                                    <p className="text-gray-500">List your restaurant on FootPlate and reach more customers.</p>
                                    <button onClick={handleApplyRestaurant} className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition">
                                        Apply Now
                                    </button>
                                 </div>
                             )}
                         </div>
                     )}

                     {/* Admin Dashboard Link */}
                     {user?.role === 'admin' && (
                         <Link to="/admin" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition group border border-transparent hover:border-purple-200">
                             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                 <User />
                             </div>
                             <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Panel</h3>
                             <p className="text-gray-500">Manage users, restaurants, and platform settings.</p>
                         </Link>
                     )}
                 </div>
             </div>
        </div>
    );
};

export default Dashboard;