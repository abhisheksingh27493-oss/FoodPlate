import React, { useState, useEffect } from 'react';
import restaurantService from '../api/restaurantService';
import authApi from '../api/authApi';
import { Check, X, Users, Store, Loader2 } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'users'
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
    // Implement Users fetch if needed
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getAllApplications();
      setApplications(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await restaurantService.updateRestaurantStatus(id, status);
      fetchApplications(); // Refresh list
    } catch (error) {
alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'applications'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Store size={20} /> Restaurant Applications
          </button>
          {/* Add Users Tab here later if needed */}
        </div>

        {/* Content */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100">
                 <h2 className="text-xl font-bold text-gray-800">Pending Applications</h2>
             </div>
             {loading ? (
                 <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>
             ) : applications.length === 0 ? (
                 <div className="p-8 text-center text-gray-500">No applications found.</div>
             ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="p-4">Restaurant Name</th>
                                <th className="p-4">Owner (User ID)</th>
                                <th className="p-4">Address</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{app.title}</td>
                                    <td className="p-4 text-sm text-gray-500 font-mono">{app.owner}</td>
                                    <td className="p-4 text-sm text-gray-600">{app.address}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                                            app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {app.status === 'pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                    className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition" 
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button 
                                                     onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition" 
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;