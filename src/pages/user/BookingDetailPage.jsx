import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  QrCodeIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { bookingService } from '../../services/bookingService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingById(id);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Booking not found');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async () => {
    try {
      const response = await bookingService.downloadTicket(booking._id);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${booking.bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Ticket downloaded successfully');
    } catch (error) {
      toast.error('Failed to download ticket');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-100 text-success-700';
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      case 'cancelled':
        return 'bg-error-100 text-error-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-700';
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      case 'failed':
        return 'bg-error-100 text-error-700';
      case 'refunded':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <button
            onClick={() => navigate('/profile')}
            className="btn-primary"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
          <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2 space-y-6">
            {}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Information</h2>
              
              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={booking.event.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
                  alt={booking.event.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {booking.event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {booking.event.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      {formatDate(booking.event.startDate)}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {formatTime(booking.event.startDate)}
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {booking.event.location}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Type:</span>
                      <span className="font-medium capitalize">{booking.bookingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seats:</span>
                      <span className="font-medium">{booking.seatCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit Price:</span>
                      <span className="font-medium">₹{formatPrice(booking.unitPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">₹{formatPrice(booking.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Booking Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            {booking.qrScans && booking.qrScans.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Scan History</h2>
                <div className="space-y-3">
                  {booking.qrScans.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Scan #{index + 1}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(scan.scannedAt).toLocaleString('en-IN')}
                        </p>
                        {scan.location && (
                          <p className="text-xs text-gray-600">Location: {scan.location}</p>
                        )}
                      </div>
                      <CheckCircleIcon className="w-5 h-5 text-success-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Entry QR Code</h3>
                
                <div className="text-center mb-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {showQR ? (
                      <img
                        src={booking.qrCodeImage}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCodeIcon className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="btn-primary w-full mb-3"
                  >
                    {showQR ? 'Hide QR Code' : 'Show QR Code'}
                  </button>
                </div>

                {}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Scan Status</span>
                    <span className={`text-sm font-medium ${
                      booking.qrScanCount >= booking.qrScanLimit ? 'text-success-600' : 'text-primary-600'
                    }`}>
                      {booking.qrScanCount} / {booking.qrScanLimit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        booking.qrScanCount >= booking.qrScanLimit ? 'bg-success-500' : 'bg-primary-500'
                      }`}
                      style={{
                        width: `${Math.min((booking.qrScanCount / booking.qrScanLimit) * 100, 100)}%`
                      }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-600">
                    {booking.remainingScans > 0 
                      ? `${booking.remainingScans} scan${booking.remainingScans !== 1 ? 's' : ''} remaining`
                      : 'All scans used'
                    }
                  </p>
                </div>

                {}
                <div className="flex items-center justify-center space-x-2 text-sm">
                  {booking.canBeScanned ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 text-success-500" />
                      <span className="text-success-600 font-medium">Ready to Scan</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {booking.qrScanCount >= booking.qrScanLimit ? 'Fully Used' : 'Not Available'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={downloadTicket}
                    className="w-full flex items-center justify-center btn-primary"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                    Download Ticket
                  </button>
                  
                  {booking.status === 'confirmed' && booking.paymentStatus === 'completed' && (
                    <div className="text-center">
                      <p className="text-xs text-gray-600">
                        Present this QR code at the venue entrance
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {}
              {booking.paymentDetails && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium capitalize">{booking.paymentMethod}</span>
                    </div>
                    
                    {booking.paymentDetails.razorpayPaymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-medium text-xs">
                          {booking.paymentDetails.razorpayPaymentId.slice(-8)}
                        </span>
                      </div>
                    )}
                    
                    {booking.paymentDetails.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium text-xs">
                          {booking.paymentDetails.transactionId}
                        </span>
                      </div>
                    )}
                    
                    {booking.paymentDetails.paymentDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="font-medium">
                          {new Date(booking.paymentDetails.paymentDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
