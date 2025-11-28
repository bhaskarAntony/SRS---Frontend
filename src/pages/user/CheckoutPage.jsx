import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';
import { bookingService } from '../../services/bookingService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); 
  const { items: cartItems, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod] = useState('razorpay');

  const cartItemsArray = Array.isArray(cartItems) ? cartItems : [];
  const locationItems = location.state?.items;
  const locationItemsArray = Array.isArray(locationItems) ? locationItems : [];

  const items = locationItemsArray.length > 0 ? locationItemsArray : cartItemsArray;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, user, items, navigate]);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.bookingType === 'member'
        ? item.event.memberPrice
        : item.bookingType === 'guest'
          ? item.event.guestPrice
          : item.event.userPrice;
      return total + (price * item.seatCount);
    }, 0);
  };

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const bookingPromises = items.map(item =>
        bookingService.createBooking({
          eventId: item.event._id || item.eventId,
          seatCount: item.seatCount,
          bookingType: item.bookingType,
          guestDetails: item.guestDetails,
          sponsoringMemberId: item.sponsoringMemberId,
        })
      );

      const bookings = await Promise.all(bookingPromises);
      const totalAmount = calculateTotal();
      alert(bookings[0].data._id);
      console.log(bookings);
      const paymentResponse = await bookingService.initiatePayment(bookings[0].data._id, totalAmount);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: paymentResponse.data.key,
          amount: paymentResponse.data.amount,
          currency: paymentResponse.data.currency,
          order_id: paymentResponse.data.orderId,
          name: 'SRS Events',
          description: 'Event Booking Payment',
          handler: async (response) => {
            try {
              await bookingService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookings[0]._id,
              });

              clearCart();
              toast.success('Payment successful! Tickets sent to your email.');
              navigate('/booking-success', { state: { bookings } });
            } catch (err) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`.trim() || 'Customer',
            email: user.email || '',
            contact: user.phone || '',
          },
          theme: { color: '#3B82F6' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        toast.error('Failed to load payment gateway');
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);
  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (items.length === 0) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex gap-6">
                  <img
                    src={item.event.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
                    alt={item.event.title}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{item.event.title}</h3>
                    <div className="mt-2 space-y-1 text-gray-600">
                      <p>{formatDate(item.event.startDate)} • {item.event.location}</p>
                      <p className="text-sm">{item.seatCount} × {item.bookingType.charAt(0).toUpperCase() + item.bookingType.slice(1)} Ticket</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        ₹{formatPrice(
                          (item.bookingType === 'member' ? item.event.memberPrice :
                           item.bookingType === 'guest' ? item.event.guestPrice :
                           item.event.userPrice) * item.seatCount
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total Amount</span>
                <span className="text-primary-600">₹{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-6">Secure Payment</h3>

              <div className="space-y-4">
                <div className="text-center">
                  <CreditCardIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                  <p className="text-lg font-medium">Pay with Razorpay</p>
                  <p className="text-sm text-gray-600 mt-2">UPI • Cards • Net Banking • Wallet</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>256-bit SSL Encrypted</span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full btn-primary py-5 text-lg font-bold rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <LoadingSpinner size="small" className="mr-3" />
                  ) : (
                    <CreditCardIcon className="w-6 h-6 mr-3" />
                  )}
                  {loading ? 'Processing...' : `Pay ₹${formatPrice(calculateTotal())}`}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Powered by <span className="font-semibold">Razorpay</span> • Trusted by 50M+ Indians
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
