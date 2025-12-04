import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  StarIcon,
  CalendarDaysIcon,
  TicketIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { ListFilterIcon, PlusIcon } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const sidebarRef = useRef(null);

  // Close sidebar on outside click (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('#sidebar-toggle-button')
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Members', href: '/admin/members', icon: StarIcon },
    { name: 'Events', href: '/admin/events', icon: CalendarDaysIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: TicketIcon },
    { name: 'New Spot Booking', href: '/admin/offline-booking/create', icon: PlusIcon},
    { name: 'List Spot Bookings', href: '/admin/offline-bookings', icon:  ListFilterIcon},
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black min-w-0">

      {/* Sidebar backdrop for mobile drawer */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full z-50 transform bg-black shadow-xl transition-transform md:relative md:translate-x-0  oveflow-auto ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:w-72'
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-gray-700">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-white leading-tight md:block hidden">Admin Panel</h2>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden p-2 rounded-md hover:bg-white/20"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {adminNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold
                  ${active
                    ? 'bg-white text-black shadow-lg border border-gray-300'
                    : 'text-gray-300 hover:bg-white hover:text-black hover:shadow-md border border-transparent'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-6 h-6 flex-shrink-0 ${active ? 'text-black' : 'text-gray-300'}`} />
                <span className={`${active ? 'font-bold' : ''} truncate`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/10">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md shrink-0">
              <span className="font-bold text-white text-sm">{user?.firstName?.[0] || 'A'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-300">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-gray-300 hover:bg-red-600 hover:text-white"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content and Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-black flex items-center justify-between p-4 shadow-md sticky top-0 z-30">
          <button 
            id="sidebar-toggle-button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-white/20 transition"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-bold select-none">Admin Panel</h1>
          <div className="w-6" /> {/* empty space for layout */}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white p-6 md:p-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="max-w-7xl mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
