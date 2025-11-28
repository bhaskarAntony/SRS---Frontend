
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  UserCircleIcon, 
  ChevronDownIcon, 
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';

const UserDesktopLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCartStore();        
  const navigate = useNavigate();

  const cartCount = getTotalItems();               

  const [moreOpen, setMoreOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const publicPages = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Sitemap', path: '/sitemap' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b-4 border-primary-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {}
            <Link to="/" className="flex items-center">
              <div className="bg-white rounded-full shadow-lg border-4 border-primary-600" style={{transform:'translateY(50%)'}}>
                <img src={logo} alt="SRS Events" className="w-24 h-24 object-contain"  />
              </div>
            </Link>

            {}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-semibold transition">
                Home
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-primary-600 font-semibold transition">
                Events
              </Link>

              {}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setMoreOpen(!moreOpen)}
                    className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-semibold transition"
                  >
                    More
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {moreOpen && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      {publicPages.map(page => (
                        <Link
                          key={page.path}
                          to={page.path}
                          onClick={() => setMoreOpen(false)}
                          className="block px-5 py-3 text-gray-700 hover:bg-blue-50 transition"
                        >
                          {page.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {}
              {!isAuthenticated && publicPages.map(page => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="text-gray-700 hover:text-primary-600 font-semibold transition"
                >
                  {page.name}
                </Link>
              ))}
            </nav>

            {}
            <div className="flex items-center space-x-6">

              {}
              {isAuthenticated && user?.role !== 'admin' && (
                <Link to="/cart" className="relative">
                  <ShoppingCartIcon className="w-7 h-7 text-gray-700 hover:text-primary-600 transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {}
              {!isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 shadow-lg transition"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}

                  {}
                  {user?.role !== 'admin' && (
                    <div className="relative">
                      <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 hover:opacity-80 transition"
                      >
                        <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center shadow">
                          <UserCircleIcon className="w-9 h-9 text-primary-600" />
                        </div>
                        <div className="text-left hidden xl:block">
                          <p className="font-semibold text-gray-800">{user?.firstName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 transition ${profileOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {profileOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                          <div className="p-4 border-b">
                            <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                          <Link to="/profile" className="block px-4 py-3 hover:bg-gray-50">My Profile</Link>
                          <Link to="/bookings" className="block px-4 py-3 hover:bg-gray-50">My Bookings</Link>
                          <hr className="my-2" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium flex items-center gap-3"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default UserDesktopLayout;
