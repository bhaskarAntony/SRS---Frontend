import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircleIcon, DocumentArrowDownIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import useCartStore from '../../store/cartStore';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const bookings = location.state?.bookings || [];

  useEffect(() => {
    if (bookings.length === 0) {
      navigate('/');
      return;
    }
    
    clearCart();
  }, [bookings, navigate, clearCart]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const totalAmount = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-12 h-12 text-success-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your booking has been successfully confirmed. You will receive a confirmation email shortly.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
          
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <div key={booking._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {booking.event?.title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                      <p><strong>Date:</strong> {formatDate(booking.event?.startDate)}</p>
                      <p><strong>Location:</strong> {booking.event?.location}</p>
                      <p><strong>Seats:</strong> {booking.seatCount}</p>
                      <p><strong>Booking Type:</strong> {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ₹{formatPrice(booking.totalAmount)}
                    </div>
                    <div className="text-sm text-success-600 font-medium">Confirmed</div>
                  </div>
                </div>

                {/* QR Code Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">QR Code Generated</h4>
                      <p className="text-sm text-gray-600">
                        One QR code for {booking.seatCount} seat{booking.seatCount !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        Scan limit: {booking.qrScanLimit} times
                      </p>
                    </div>
                    <QrCodeIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/booking/${booking._id}`}
                    className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <QrCodeIcon className="w-4 h-4 mr-2" />
                    View QR Code
                  </Link>
                  <Link
                    to={`/booking/${booking._id}/ticket`}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                    Download Ticket
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount Paid</span>
              <span className="text-xl font-bold text-primary-600">
                ₹{formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Please arrive at the venue 30 minutes before the event starts</li>
            <li>• Bring a valid ID for verification</li>
            <li>• Show your QR code at the entrance for entry</li>
            <li>• Each QR code can be scanned multiple times based on your seat count</li>
            <li>• Download your ticket for offline access</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/profile"
            className="btn-primary text-center py-3"
          >
            View All Bookings
          </Link>
          <Link
            to="/events"
            className="btn-outline text-center py-3"
          >
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;