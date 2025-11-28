import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, removeItem, updateItemCount, clearCart, getTotalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (eventId, bookingType, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(eventId, bookingType);
      return;
    }
    updateItemCount(eventId, bookingType, newQuantity);
  };

  const handleRemoveItem = (eventId, bookingType) => {
    removeItem(eventId, bookingType);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">
              Add some events to your cart to get started!
            </p>
            <Link to="/events" className="btn-primary">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-auto">
        {}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-error-600 hover:text-error-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={`${item.eventId}-${item.bookingType}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="md:flex md:items-start space-x-4">
                  <img
                    src={item.event.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
                    alt={item.event.title}
                    className="w-full h-58 object-cover rounded-lg md:w-24"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.event.title}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p>Date: {formatDate(item.event.startDate)}</p>
                      <p>Location: {item.event.location}</p>
                      <p>Booking Type: {item.bookingType.charAt(0).toUpperCase() + item.bookingType.slice(1)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.eventId, item.bookingType, item.seatCount - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="font-medium">{item.seatCount}</span>
                        <button
                          onClick={() => handleQuantityChange(item.eventId, item.bookingType, item.seatCount + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">₹{formatPrice(item.event.userPrice)} each</p>
                          <p className="font-semibold text-gray-900">
                            ₹{formatPrice(item.event.userPrice * item.seatCount)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.eventId, item.bookingType)}
                          className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-full"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.eventId}-${item.bookingType}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.event.title} ({item.seatCount}x)
                    </span>
                    <span className="font-medium">
                      ₹{formatPrice(item.event.userPrice * item.seatCount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-primary-600">
                    ₹{formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center"
              >
                {loading ? <LoadingSpinner size="small" className="mr-2" /> : null}
                Proceed to Checkout
              </button>

              <Link
                to="/events"
                className="block w-full text-center btn-outline mt-3 py-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
