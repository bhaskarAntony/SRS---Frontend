
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';

const UserDesktopLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const cartCount = getTotalItems();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" style={{borderBottom:"5px solid #0046FF"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {}
            <Link to="/" className="flex items-center space-x-3">
            <div style={{padding:"10px", borderRadius:"100px", backgroundColor:"#fff", boxShadow:"0px 0px 1px #ccc", transform:"translateY(20px)", borderBottom:"5px solid #0046FF"}}>
             <img src={logo} alt="srs event booking paltform" width={60}/>
            </div>
            </Link>

            {}
            <nav className="hidden md:flex items-center space-x-10">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/events"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Events
              </Link>
              <Link
                to="/about us"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                About us
              </Link>
              <Link
                to="/contact-us"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Contact us
              </Link>
              <Link
                to="/privacy"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Privacy
              </Link>
              <Link
                to="/faqs"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                FAQ's
              </Link>
              <Link
                to="/sitemap"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Sitemap
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/favorites"
                    className="text-gray-700 hover:text-primary-600 font-medium transition"
                  >
                    Favorites
                  </Link>
                </>
              )}
            </nav>

            {}
            <div className="flex items-center space-x-6">

              {}
              {isAuthenticated && user?.role !== 'admin' && (
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 font-medium transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition shadow-md"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  {}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}

                  {}
                  {user?.role !== 'admin' && (
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-8 h-8 text-primary-600" />
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 transition ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                  {}
                  {profileOpen && user?.role !== 'admin' && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                      >
                        <UserCircleIcon className="w-5 h-5 mr-3 text-gray-600" />
                        My Profile
                      </Link>
                      <Link
                        to="/bookings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                      >
                        <TicketIcon className="w-5 h-5 mr-3 text-gray-600" />
                        My Bookings
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 hover:bg-red-50 text-red-600 transition"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default UserDesktopLayout;
