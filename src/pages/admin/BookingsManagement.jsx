import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  QrCodeIcon,
  FunnelIcon,
  CalendarDaysIcon,
  UserIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';
import { bookingService } from '../../services/bookingService';
import { eventService } from '../../services/eventService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    eventId: '',
    paymentStatus: '',
    bookingType: '',
    dateRange: '',
  });

  const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  const paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
  const bookingTypes = ['user', 'member', 'guest'];

  useEffect(() => {
    fetchBookings();
    fetchEvents();
  }, [currentPage, searchTerm, filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        ...filters
      });
      setBookings(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents({ limit: 100 });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleCreateManualBooking = async (bookingData) => {
    try {
      await bookingService.createManualBooking(bookingData);
      toast.success('Manual booking created successfully');
      setShowCreateModal(false);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to create manual booking');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const downloadReceipt = async (bookingId) => {
    try {
      const response = await bookingService.downloadTicket(bookingId);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

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

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-2">Manage all event bookings and create manual bookings</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Manual Booking
        </button>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Payment Status</option>
            {paymentStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={filters.bookingType}
            onChange={(e) => handleFilterChange('bookingType', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            {bookingTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={filters.eventId}
            onChange={(e) => handleFilterChange('eventId', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Events</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
          
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="last-week">Last Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
          </select>
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{booking.bookingId}</div>
                          <div className="text-gray-500">
                            {booking.seatCount} seat{booking.seatCount !== 1 ? 's' : ''} • {booking.bookingType}
                          </div>
                          <div className="text-gray-500">{formatDate(booking.bookingDate)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {booking.event?.title}
                          </div>
                          <div className="text-gray-500">
                            {formatDate(booking.event?.startDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {booking.user?.firstName} {booking.user?.lastName}
                          </div>
                          <div className="text-gray-500">{booking.user?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{formatPrice(booking.totalAmount)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {booking.qrScanCount} / {booking.qrScanLimit}
                          </div>
                          <div className="text-gray-500">
                            {booking.remainingScans} remaining
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(booking.status)}`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowViewModal(true);
                            }}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadReceipt(booking._id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {}
            <div className="lg:hidden">
              {bookings.map((booking) => (
                <div key={booking._id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{booking.bookingId}</h3>
                      <p className="text-sm text-gray-600">{booking.event?.title}</p>
                      <p className="text-sm text-gray-500">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">₹{formatPrice(booking.totalAmount)}</div>
                      <div className="flex space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Seats:</span> {booking.seatCount}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {booking.bookingType}
                    </div>
                    <div>
                      <span className="font-medium">QR Scans:</span> {booking.qrScanCount}/{booking.qrScanLimit}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(booking.bookingDate)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowViewModal(true);
                      }}
                      className="flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => downloadReceipt(booking._id)}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {}
      {showCreateModal && (
        <CreateManualBookingModal
          events={events}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateManualBooking}
        />
      )}

      {}
      {showViewModal && selectedBooking && (
        <ViewBookingModal
          booking={selectedBooking}
          onClose={() => {
            setShowViewModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

// Create Manual Booking Modal Component
const CreateManualBookingModal = ({ events, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    eventId: '',
    userDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    seatCount: 1,
    bookingType: 'user',
    paymentMethod: 'cash',
    transactionId: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventChange = (eventId) => {
    const event = events.find(e => e._id === eventId);
    setSelectedEvent(event);
    setFormData({ ...formData, eventId });
  };

  const getPrice = () => {
    if (!selectedEvent) return 0;
    switch (formData.bookingType) {
      case 'member':
        return selectedEvent.memberPrice;
      case 'guest':
        return selectedEvent.guestPrice;
      default:
        return selectedEvent.userPrice;
    }
  };

  const getTotalAmount = () => {
    return getPrice() * formData.seatCount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        totalAmount: getTotalAmount(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Manual Booking</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Event *
            </label>
            <select
              required
              value={formData.eventId}
              onChange={(e) => handleEventChange(e.target.value)}
              className="input-field"
            >
              <option value="">Choose an event</option>
              {events.map(event => (
                <option key={event._id} value={event._id}>
                  {event.title} - {new Date(event.startDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Customer Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.userDetails.firstName}
                  onChange={(e) => setFormData({
                    ...formData,
                    userDetails: { ...formData.userDetails, firstName: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.userDetails.lastName}
                  onChange={(e) => setFormData({
                    ...formData,
                    userDetails: { ...formData.userDetails, lastName: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.userDetails.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    userDetails: { ...formData.userDetails, email: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.userDetails.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    userDetails: { ...formData.userDetails, phone: e.target.value }
                  })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Booking Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Type
                </label>
                <select
                  value={formData.bookingType}
                  onChange={(e) => setFormData({ ...formData, bookingType: e.target.value })}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="member">Member</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.seatCount}
                  onChange={(e) => setFormData({ ...formData, seatCount: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="input-field"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>
              {formData.paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="input-field"
                  />
                </div>
              )}
            </div>
          </div>

          {}
          {selectedEvent && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Unit Price ({formData.bookingType}):</span>
                <span className="font-medium">₹{getPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Seats:</span>
                <span className="font-medium">{formData.seatCount}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium text-gray-900">Total Amount:</span>
                <span className="font-bold text-primary-600">₹{getTotalAmount().toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedEvent}
              className="btn-primary flex items-center"
            >
              {loading && <LoadingSpinner size="small" className="mr-2" />}
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Booking Modal Component
const ViewBookingModal = ({ booking, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Booking Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Booking ID:</span>
                <p className="text-gray-900">{booking.bookingId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Booking Date:</span>
                <p className="text-gray-900">{formatDate(booking.bookingDate)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Seats:</span>
                <p className="text-gray-900">{booking.seatCount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <p className="text-gray-900 capitalize">{booking.bookingType}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className="text-gray-900 capitalize">{booking.status}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Payment Status:</span>
                <p className="text-gray-900 capitalize">{booking.paymentStatus}</p>
              </div>
            </div>
          </div>

          {}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Event Information</h4>
            <div className="flex items-start space-x-4">
              <img
                src={booking.event?.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
                alt={booking.event?.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{booking.event?.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{booking.event?.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p><CalendarDaysIcon className="w-4 h-4 inline mr-1" />{formatDate(booking.event?.startDate)}</p>
                  <p className="mt-1">{booking.event?.location}</p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <p className="text-gray-900">{booking.user?.firstName} {booking.user?.lastName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900">{booking.user?.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-900">{booking.user?.phone}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Role:</span>
                <p className="text-gray-900 capitalize">{booking.user?.role}</p>
              </div>
            </div>
          </div>

          {}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">QR Code Status</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Scan Progress</span>
                <span className="text-sm font-medium text-primary-600">
                  {booking.qrScanCount} / {booking.qrScanLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
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
          </div>

          {}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Unit Price:</span>
                <p className="text-gray-900">₹{formatPrice(booking.unitPrice)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Amount:</span>
                <p className="text-gray-900 font-semibold">₹{formatPrice(booking.totalAmount)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Payment Method:</span>
                <p className="text-gray-900 capitalize">{booking.paymentMethod}</p>
              </div>
              {booking.paymentDetails?.transactionId && (
                <div>
                  <span className="font-medium text-gray-700">Transaction ID:</span>
                  <p className="text-gray-900">{booking.paymentDetails.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          {}
          {booking.qrScans && booking.qrScans.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Scan History</h4>
              <div className="space-y-2">
                {booking.qrScans.map((scan, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Scan #{index + 1}</p>
                      <p className="text-xs text-gray-600">{formatDate(scan.scannedAt)}</p>
                    </div>
                    {scan.location && (
                      <p className="text-xs text-gray-600">{scan.location}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;
