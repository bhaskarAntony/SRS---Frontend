// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const [currentTab, setCurrentTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      
      const redirectTo = user?.role === 'admin' ? '/admin/dashboard' : '/';
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (!formData.agreeToTerms) {
      toast.error('Please agree to terms');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, agreeToTerms, ...userData } = formData;
      await register(userData);
      toast.success('Account created! Welcome to SRS Events');
      setCurrentTab('login');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isLoginTab = currentTab === 'login';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-black rounded-2xl flex items-center justify-center">
            <img src={logo} alt="SRS" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-[11px] text-gray-600">Sign in or create your SRS Events account</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-gray-200 p-1 mb-6">
          <div className="flex bg-gray-50 rounded-2xl p-1">
            <button
              onClick={() => setCurrentTab('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                isLoginTab
                  ? 'bg-white text-gray-900 shadow-sm border border-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentTab('register')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                !isLoginTab
                  ? 'bg-white text-gray-900 shadow-sm border border-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 space-y-4">
          <form onSubmit={isLoginTab ? handleLogin : handleRegister}>
            {/* Login Fields */}
            {isLoginTab ? (
              <>
                <div className="space-y-3">
                  <div className="relative">
                    <EnvelopeIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full pl-11 pr-12 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:bg-white transition-all"
                    />
                  </div>

                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-11 pr-12 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 p-1 hover:bg-gray-100 rounded-xl"
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px] mt-5">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black mr-2" />
                    <span className="text-gray-700 font-medium">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-gray-600 hover:text-black font-semibold">
                    Forgot?
                  </Link>
                </div>
              </>
            ) : (
              /* Register Fields */
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <EnvelopeIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full pl-11 pr-12 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="relative">
                    <PhoneIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full pl-11 pr-12 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-11 pr-12 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 p-1 hover:bg-gray-100 rounded-xl"
                    >
                      {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full pl-11 pr-12 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-3.5 p-1 hover:bg-gray-100 rounded-xl"
                    >
                      {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="flex items-center text-[12px] mt-5">
                  <input 
                    type="checkbox" 
                    name="agreeToTerms" 
                    checked={formData.agreeToTerms} 
                    onChange={handleChange} 
                    className="w-4 h-4 rounded border-gray-300 text-black mr-3 focus:ring-black" 
                  />
                  <span className="text-gray-700 font-medium">Terms & Privacy</span>
                </p>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-sm font-bold py-4 px-6 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all shadow-lg border border-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
            >
              {loading ? <LoadingSpinner size="small" /> : isLoginTab ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Switch Tab Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-[12px] text-gray-600">
              {isLoginTab 
                ? "Don't have an account?" 
                : "Already have an account?"
              }
              <button
                onClick={() => setCurrentTab(isLoginTab ? 'register' : 'login')}
                className="ml-1 text-black font-semibold hover:underline text-sm"
              >
                {isLoginTab ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <Link to="/forgot-password" className="block text-[12px] text-gray-600 hover:text-black font-semibold">
            Forgot Password?
          </Link>
          <Link to="/terms" className="block text-[11px] text-gray-500 hover:text-gray-700">
            Terms of Service • Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
