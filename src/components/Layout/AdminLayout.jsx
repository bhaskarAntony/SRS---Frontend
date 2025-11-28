
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon, UsersIcon, StarIcon, CalendarDaysIcon,
  TicketIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, XMarkIcon, Bars3Icon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Members', href: '/admin/members', icon: StarIcon },
    { name: 'Events', href: '/admin/events', icon: CalendarDaysIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: TicketIcon },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-20'} transition-all duration-300 bg-blue-900 text-white overflow-hidden`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-primary-600">
            <h2 className={`font-bold text-2xl ${sidebarOpen ? 'block' : 'hidden md:block'}`}>Admin</h2>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {adminNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    active ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-primary-600">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold">{user?.firstName?.[0]}</span>
              </div>
              {sidebarOpen && (
                <div className="text-sm">
                  <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-primary-200">Administrator</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-white/10 rounded-lg">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {}
      <div className="flex-1 flex flex-col">
        {}
        <header className="bg-white shadow-sm border-b border-gray-200 md:hidden">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
              {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <div className="w-10" />
          </div>
        </header>

        {}
        <header className="hidden md:flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
