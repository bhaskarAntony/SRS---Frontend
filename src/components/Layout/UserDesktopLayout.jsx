// components/Layout/UserDesktopLayout.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  UserCircleIcon, 
  ChevronDownIcon, 
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';

const UserDesktopLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCartStore();        
  const navigate = useNavigate();
  const cartCount = getTotalItems();               

  const [moreOpen, setMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const publicPages = [
    { name: 'About', path: '/about-us' },
    { name: 'Contact', path: '/contact-us' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'FAQs', path: '/faqs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
                <img src={logo} alt="SRS" className="w-10 h-10 object-contain" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-[12px] font-semibold text-gray-700 hover:text-black uppercase tracking-wide transition">Home</Link>
              <Link to="/events" className="text-[12px] font-semibold text-gray-700 hover:text-black uppercase tracking-wide transition">Events</Link>
              {isAuthenticated && (
                <>
                  <Link to="/favorites" className="text-[12px] font-semibold text-gray-700 hover:text-black uppercase tracking-wide transition flex items-center gap-1">
                    <HeartIcon className="w-4 h-4" />
                    Favorites
                  </Link>
                  <Link to="/profile" className="text-[12px] font-semibold text-gray-700 hover:text-black uppercase tracking-wide transition">Profile</Link>
                </>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user?.role !== 'admin' && cartCount > 0 && (
                <Link to="/cart" className="relative p-1.5 rounded-xl hover:bg-gray-50">
                  <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
              )}

              {!isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-3">
                  <Link to="/login" className="text-[12px] font-semibold text-gray-700 hover:text-black">Login</Link>
                  <Link to="/register" className="bg-black text-white text-[12px] font-semibold px-4 py-2 rounded-2xl hover:bg-gray-900 transition">Join</Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1">
                      <Cog6ToothIcon className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition"
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <UserCircleIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user?.firstName}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-3 text-[12px] text-gray-700 hover:bg-gray-50 rounded-2xl mx-1 my-1 font-semibold">Profile</Link>
                        <Link to="/bookings" onClick={() => setProfileOpen(false)} className="block px-4 py-3 text-[12px] text-gray-700 hover:bg-gray-50 rounded-2xl mx-1 my-1 font-semibold">Bookings</Link>
                        <hr className="border-gray-100 mx-3" />
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[12px] text-rose-600 hover:bg-rose-50 rounded-2xl mx-1 font-semibold flex items-center gap-2">
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default UserDesktopLayout;
