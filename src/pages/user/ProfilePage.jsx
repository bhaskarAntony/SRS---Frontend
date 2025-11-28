// src/pages/user/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShoppingCartIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  QrCodeIcon,
  DocumentArrowDownIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

// USE CONTEXT — NO ZUSTAND
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore'; // Only cart uses Zustand (fine)
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth(); // ← FROM CONTEXT
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Safe check for member
  const isMember = () => {
    return user?.role === 'member' || user?.membershipTier;
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to view profile');
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [isAuthenticated, user, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, favoritesRes] = await Promise.all([
        bookingService.getUserBookings(),
        userService.getFavorites(),
      ]);

      // SAFE DATA — NEVER CRASH
      setBookings(Array.isArray(bookingsRes?.data) ? bookingsRes.data : []);
      setFavorites(Array.isArray(favoritesRes?.data) ? favoritesRes.data : []);
    } catch (error) {
      console.error('Failed to load profile data:', error);
      toast.error('Failed to load your profile data');
      setBookings([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const downloadTicket = async (bookingId) => {
    try {
      const response = await bookingService.downloadTicket(bookingId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${bookingId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Ticket downloaded!');
    } catch (error) {
      toast.error('Failed to download ticket');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* USER INFO CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-lg text-gray-600">{user?.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  {isMember() && (
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-bold rounded-full flex items-center shadow">
                      <StarIcon className="w-5 h-5 mr-2" />
                      {user?.membershipTier || 'Premium Member'}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-medium"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              Logout
            </button>
          </div>

          {/* MEMBER STATS */}
          {isMember() && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <div className="text-4xl font-bold text-primary-600">
                    {user?.loyaltyPoints || 0}
                  </div>
                  <p className="text-gray-600 mt-2">Loyalty Points</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl">
                  <div className="text-4xl font-bold text-secondary-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <p className="text-gray-600 mt-2">Events Attended</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl">
                  <div className="text-4xl font-bold text-success-600">
                    ₹{bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0).toLocaleString('en-IN')}
                  </div>
                  <p className="text-gray-600 mt-2">Total Spent</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-10 px-8">
              {[
                { id: 'profile', name: 'Profile', icon: UserIcon },
                { id: 'bookings', name: 'My Bookings', icon: CalendarDaysIcon },
                { id: 'favorites', name: 'Favorites', icon: HeartIcon },
                { id: 'cart', name: `Cart (${getTotalItems()})`, icon: ShoppingCartIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 py-5 px-2 border-b-4 font-semibold text-lg transition-all ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-6 h-6" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['First Name', 'Last Name', 'Email', 'Phone'].map((label) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <input
                      type="text"
                      value={
                        label === 'First Name' ? user?.firstName :
                        label === 'Last Name' ? user?.lastName :
                        label === 'Email' ? user?.email :
                        user?.phone || ''
                      }
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                ))}
                <div className="md:col-span-2 flex justify-end">
                  <Link to="/settings" className="flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium">
                    <CogIcon className="w-6 h-6" />
                    Edit Profile Settings
                  </Link>
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-20">
                    <CalendarDaysIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No Bookings Yet</h3>
                    <p className="text-gray-600 mb-8">Start exploring events and book your first one!</p>
                    <Link to="/events" className="px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-bold">
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {booking.event?.title || 'Event Deleted'}
                          </h3>
                          <div className="mt-3 space-y-2 text-gray-600">
                            <p><strong>ID:</strong> {booking.bookingId}</p>
                            <p><strong>Date:</strong> {formatDate(booking.event?.startDate)}</p>
                            <p><strong>Location:</strong> {booking.event?.location || 'N/A'}</p>
                            <p><strong>Seats:</strong> {booking.seatCount} × ₹{booking.unitPrice}</p>
                            <p><strong>Total:</strong> ₹{booking.totalAmount?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(booking.status)}`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                          {booking.status === 'confirmed' && (
                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={() => downloadTicket(booking._id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                              >
                                <DocumentArrowDownIcon className="w-5 h-5" />
                                Download
                              </button>
                              <Link
                                to={`/booking/${booking._id}/qr`}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                              >
                                <QrCodeIcon className="w-5 h-5" />
                                QR
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      {booking.qrScanCount > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            QR Scanned: <strong>{booking.qrScanCount}</strong> / {booking.qrScanLimit} times
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

           {}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-6">Save events you're interested in to view them later!</p>
                    <Link to="/events" className="btn-primary">
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((event) => (
                      <div key={event._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{formatDate(event.startDate)}</p>
                          <p className="text-sm text-gray-600 mb-4">{event.location}</p>
                          <Link
                            to={`/events/${event._id}`}
                            className="btn-primary w-full text-center"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {}
            {activeTab === 'cart' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
                  <Link to="/cart" className="text-primary-600 hover:text-primary-700 font-medium">
                    View Full Cart
                  </Link>
                </div>
                <p className="text-gray-600">
                  You have {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart.
                </p>
                <Link to="/cart" className="btn-primary">
                  Go to Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;