
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  HeartIcon,
  UserIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  CalendarDaysIcon as CalendarSolid,
  HeartIcon as HeartSolid,
  UserIcon as UserSolid,
} from '@heroicons/react/24/solid';
import useCartStore from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';

const UserMobileLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon, activeIcon: HomeSolid },
    { name: 'Events', path: '/events', icon: CalendarDaysIcon, activeIcon: CalendarSolid },
    { name: 'Favorites', path: '/favorites', icon: HeartIcon, activeIcon: HeartSolid, requireAuth: true },
    { name: 'Profile', path: '/profile', icon: UserIcon, activeIcon: UserSolid, requireAuth: true },
  ].filter(item => !item.requireAuth || isAuthenticated);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">

      {}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          {}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SRS Events</span>
          </Link>

          {}
          <div className="flex items-center space-x-3">
            {}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
              >
                Admin Panel
              </Link>
            )}

            {}
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                {}
                <Link to="/cart" className="relative">
                  <ShoppingCartIcon className="w-7 h-7 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {}
                <Link to="/profile" className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shadow-md">
                  <UserCircleIcon className="w-8 h-8 text-primary-600" />
                </Link>
              </>
            )}

            {}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-primary-600 font-medium text-sm">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {}
      {isAuthenticated && user?.role !== 'admin' && cartCount > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-24 right-4 z-40 bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-bounce"
        >
          <ShoppingCartIcon className="w-7 h-7" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cartCount}
          </span>
        </Link>
      )}

      {}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-2xl">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = active ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  active
                    ? 'text-primary-600 scale-110'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default UserMobileLayout;
