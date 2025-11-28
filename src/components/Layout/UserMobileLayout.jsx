// components/Layout/UserMobileLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarDaysIcon,
  HomeIcon as HomeSolid, 
  CalendarDaysIcon as CalendarSolid,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import useCartStore from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const UserMobileLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Public pages for sidebar
  const sidebarLinks = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Sitemap', path: '/sitemap' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col pb-16">

        {}
        <header className="bg-white shadow-md border-b-4 border-primary-600 sticky top-0 z-50">
          <div className="px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="SRS Events" className="w-14 h-14 object-contain"  />
            </Link>

            <div className="flex items-center gap-3">
              {}
              {isAuthenticated && user?.role !== 'admin' && (
                <Link to="/cart" className="relative">
                  <ShoppingCartIcon className="w-7 h-7 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Bars3Icon className="w-7 h-7 text-gray-700" />
              </button>
            </div>
          </div>
        </header>

        {}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {}
        {isAuthenticated && cartCount > 0 && user?.role !== 'admin' && (
          <Link
            to="/cart"
            className="fixed bottom-20 right-4 z-40 bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-bounce"
          >
            <ShoppingCartIcon className="w-7 h-7" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        )}

        {}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-primary-600 shadow-2xl z-50">
          <div className="grid grid-cols-2 h-16">
            {}
            <Link
              to="/"
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive('/') ? 'text-primary-600 scale-110' : 'text-gray-600'
              }`}
            >
              {isActive('/') ? <HomeSolid className="w-7 h-7" /> : <HomeIcon className="w-7 h-7" />}
              <span className="text-xs font-bold">Home</span>
            </Link>

            {}
            <Link
              to="/events"
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive('/events') ? 'text-primary-600 scale-110' : 'text-gray-600'
              }`}
            >
              {isActive('/events') ? <CalendarSolid className="w-7 h-7" /> : <CalendarDaysIcon className="w-7 h-7" />}
              <span className="text-xs font-bold">Events</span>
            </Link>
          </div>
        </nav>
      </div>

      {}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

          {}
          <div className="relative w-80 max-w-full bg-white shadow-2xl animate-slide-in">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {}
              {isAuthenticated && user?.role !== 'admin' && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              )}

              {}
              {sidebarLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-800 font-medium transition"
                >
                  {link.name}
                </Link>
              ))}

              {}
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setSidebarOpen(false)}
                      className="block px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-4 py-3 rounded-lg bg-primary-600 text-white font-bold text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-4 py-3 rounded-lg bg-gray-800 text-white font-bold text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default UserMobileLayout;
