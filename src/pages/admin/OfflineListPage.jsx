import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Filter, Download, X, QrCode, Smartphone, ChevronDownIcon, FunnelIcon 
} from 'lucide-react';

const QRModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${booking.qrCode}`;

  const message = `*Your Event Booking:* https://thesrsevents.com/events/${booking.event} \n\n Hello *${booking.memberName}*!\n\n✅ Your SRS Events ticket is confirmed!\n\n🔢 *Booking ID:* #${booking.bookingId}\n👤 *Member:* ${booking.memberName} \n🎪 *Event:* ${booking.eventName || 'N/A'}\n🎫 *Tickets:* M:${booking.memberTicketCount} G:${booking.guestTicketCount} K:${booking.kidTicketCount}\n🍽️ *Meals:* Veg:${booking.memberVegCount + booking.guestVegCount + booking.kidVegCount} | Non-Veg:${booking.memberNonVegCount + booking.guestNonVegCount + booking.kidNonVegCount}\n💰 *Amount:* ₹${booking.finalAmount}\n📊 *Status:* ${booking.paymentStatus.toUpperCase()}\n🆔 *UTR:* ${booking.utrNumber || booking.paymentDetails?.utrNumber || 'Pending'}\n\n📱 *Show this QR at entrance*\n\nSRS Events Team 🚀`;

   const sendViaWhatsApp = () => {
    const raw = booking.contactNumber?.replace(/[^0-9]/g, '') || '';
    const phoneWithCountry = raw.startsWith('91') ? raw : `91${raw || '9606729320'}`;
    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(
      message + `\n\n🖼️ QR Ticket:\n${qrImageSrc}`
    )}`;
    window.open(whatsappUrl, '_blank');
    toast.success('WhatsApp opened with QR link.');
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrImageSrc;
    link.download = `SRS_Ticket_${booking.bookingId}.png`;
    link.click();
    toast.success('QR Downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-auto p-6">
        {}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Ticket #{booking.bookingId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {}
        <div className="flex justify-center mb-4">
          <img src={qrImageSrc} alt="Ticket QR" className="w-48 h-48 rounded-lg shadow-md object-contain" />
        </div>

        {}
        <div className="space-y-2 text-gray-700 text-sm">
          <p><strong>Member:</strong> {booking.memberName} ({booking.memberIdInput})</p>
          <p><strong>Event:</strong> {booking.event?.title || 'N/A'}</p>
          <p><strong>Tickets:</strong> M:{booking.memberTicketCount} | G:{booking.guestTicketCount} | K:{booking.kidTicketCount}</p>
          <p><strong>Meals:</strong> Veg: {booking.memberVegCount + booking.guestVegCount + booking.kidVegCount} | Non-Veg: {booking.memberNonVegCount + booking.guestNonVegCount + booking.kidNonVegCount}</p>
          <p><strong>Amount Paid:</strong> ₹{booking.finalAmount}</p>
          <p><strong>Payment Status:</strong> <span className={`font-bold ${booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>{booking.paymentStatus.toUpperCase()}</span></p>
          <p><strong>UTR:</strong> {booking.utrNumber || booking.paymentDetails?.utrNumber || 'Pending'}</p>
        </div>

        {}
        <div className="flex gap-4 mt-6">
          <button onClick={sendViaWhatsApp} className="flex-1 bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition">
            <Smartphone className="inline w-5 h-5 mr-2" /> Send WhatsApp
          </button>
          <button onClick={downloadQR} className="flex-1 bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition">
            <Download className="inline w-5 h-5 mr-2" /> Download QR
          </button>
        </div>
      </div>
    </div>
  );
};

const OfflineListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState({
    startDate: '', endDate: '', eventId: '', memberId: '', utrNumber: '',
    paymentStatus: '', discountCode: '', search: ''
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchEvents();
      fetchBookings();
    } else {
      toast.error('Please login again');
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events', { headers: { Authorization: `Bearer ${token}` } });
      setEvents(res.data.data || []);
    } catch {
      toast.error('Failed to load events');
    }
  };

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/admin/offline-bookings', {
        params: filter,
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      toast.error('Failed to load bookings');
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/offline-bookings/export', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `offline-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    }
  };

  const openQRModal = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 max-w-7xl mx-auto">
      {}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Offline Bookings</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowFilterPopup(true)} 
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
          >
            <Filter className="w-5 h-5" /> Filters
          </button>
          <button 
            onClick={handleExport} 
            className="bg-black text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
          >
            <Download className="w-5 h-5 inline mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-start justify-center p-6 overflow-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
            <button onClick={() => setShowFilterPopup(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filters</h2>
            <div className="space-y-4 text-gray-700 text-sm">
              <label>
                Start Date
                <input type="date" value={filter.startDate} onChange={e => setFilter({ ...filter, startDate: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              </label>
              <label>
                End Date
                <input type="date" value={filter.endDate} onChange={e => setFilter({ ...filter, endDate: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              </label>
              <label>
                Event
                <select value={filter.eventId} onChange={e => setFilter({ ...filter, eventId: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">All Events</option>
                  {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                </select>
              </label>
              <label>
                Member ID
                <input placeholder="Member ID" value={filter.memberId} onChange={e => setFilter({ ...filter, memberId: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              </label>
              <label>
                UTR Number
                <input placeholder="UTR Number" value={filter.utrNumber} onChange={e => setFilter({ ...filter, utrNumber: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              </label>
              <label>
                Payment Status
                <select value={filter.paymentStatus} onChange={e => setFilter({ ...filter, paymentStatus: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label>
                Discount Code
                <input placeholder="Discount Code" value={filter.discountCode} onChange={e => setFilter({ ...filter, discountCode: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              </label>
              <button 
                onClick={() => { fetchBookings(); setShowFilterPopup(false); }} 
                className="w-full bg-black text-white py-3 rounded-xl font-semibold mt-4 hover:bg-gray-800 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <section className="overflow-auto bg-white rounded-xl shadow-lg p-4">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="border border-gray-300 p-3 text-left w-28">Booking ID</th>
                <th className="border border-gray-300 p-3 text-left w-40">Member</th>
                <th className="border border-gray-300 p-3 text-center w-28">Tickets</th>
                <th className="border border-gray-300 p-3 text-center w-28">Meals</th>
                <th className="border border-gray-300 p-3 text-right w-24">Gross</th>
                <th className="border border-gray-300 p-3 text-right w-24">Final</th>
                <th className="border border-gray-300 p-3 text-center w-28">Status</th>
                <th className="border border-gray-300 p-3 text-center w-32">UTR</th>
                <th className="border border-gray-300 p-3 text-center w-36">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-6 text-gray-500">No bookings found</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 font-mono truncate max-w-[90px]">{`#${b.bookingId}`}</td>
                    <td className="border border-gray-300 p-2 max-w-[140px] truncate min-w-0">
                      <div className="font-semibold truncate">{b.memberName}</div>
                      <div className="text-xs text-gray-500 font-mono truncate">{b.memberIdInput}</div>
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-mono truncate max-w-[90px]">M:{b.memberTicketCount} G:{b.guestTicketCount} K:{b.kidTicketCount}</td>
                    <td className="border border-gray-300 p-2 text-center font-mono truncate max-w-[90px]">V:{b.memberVegCount + b.guestVegCount + b.kidVegCount} NV:{b.memberNonVegCount + b.guestNonVegCount + b.kidNonVegCount}</td>
                    <td className="border border-gray-300 p-2 text-right font-mono truncate max-w-[70px]">₹{b.grossAmount}</td>
                    <td className="border border-gray-300 p-2 text-right font-bold text-green-600 font-mono truncate max-w-[70px]">₹{b.finalAmount}</td>
                    <td className="border border-gray-300 p-2 text-center truncate max-w-[90px]">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white whitespace-nowrap ${b.paymentStatus === 'completed' ? 'bg-green-600' : 'bg-orange-600'}`}>
                        {b.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 font-mono text-center truncate max-w-[100px]">{b.utrNumber || '-'}</td>
                    <td className="border border-gray-300 p-2 text-center whitespace-nowrap max-w-[130px]">
                      <button
                        onClick={() => openQRModal(b)}
                        className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition"
                      >
                        Send Again
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {}
      {showQRModal && <QRModal booking={selectedBooking} onClose={() => setShowQRModal(false)} />}
    </div>
  );
};

export default OfflineListPage;
