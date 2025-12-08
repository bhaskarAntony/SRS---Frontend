import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  TicketIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import QRCode from "qrcode.react";
import { Download, Smartphone, X, ArrowLeft } from "lucide-react";

const SuccessModal = ({ booking, onClose }) => {
 if (!booking) return null;
 console.log(booking)
const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${booking.qrCode}`;
  const vegTotal = booking.memberVegCount + booking.guestVegCount + booking.kidVegCount;
  const nonVegTotal = booking.memberNonVegCount + booking.guestNonVegCount + booking.kidNonVegCount;

  const ticketUrl = `https://thesrsevents.com/ticket?bid=${booking.bookingId}&qr=${booking.qrCode}&name=${encodeURIComponent(booking.memberName)}&mid=${booking.memberIdInput}&event=${encodeURIComponent(booking.eventName || 'Event')}&m=${booking.memberTicketCount}&g=${booking.guestTicketCount}&k=${booking.kidTicketCount}&veg=${vegTotal}&nonveg=${nonVegTotal}&amt=${booking.finalAmount}&status=${booking.paymentStatus.toUpperCase()}&utr=${encodeURIComponent(booking.utrNumber || 'Pending')}`;

  const message = `Hello ${booking.memberName}!

✅ Booking Confirmed! You are all set for ${booking.eventName || 'the event'}.

🔢 Booking ID: #${booking.bookingId}
👤 Member: ${booking.memberName}
🎪 Event: ${booking.eventName || 'N/A'}
🎫 Tickets: M:${booking.memberTicketCount} G:${booking.guestTicketCount} K:${booking.kidTicketCount}
🍽  Meals: Veg:${vegTotal} | Non-Veg:${nonVegTotal}
💰 Amount: ₹${booking.finalAmount}
📊 Payment Status: ${booking.paymentStatus.toUpperCase()}

📍 Location: ${booking.location}
Date: 31st Dec | Time: 7:30 PM Onwards

👇 Please show this QR code at the entrance:

${ticketUrl}

See you there!  
Team golden eventz 🥂


📞 Need help? COntact us or Visit: http://www.goldeneventz.co.in`;

  const sendViaWhatsApp = () => {
   const phone = booking.contactNumber?.replace(/\D/g, '');
    const num = phone.startsWith("91") ? phone : `91${phone || "9606729320"}`;
    const waUrl = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    toast.success("WhatsApp opened!");
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrImageSrc;
    link.download = `SRS_Ticket_${booking.bookingId}.png`;
    link.click();
    toast.success('QR Downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-2">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-auto p-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800">Ticket #{booking.bookingId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-center mb-3">
          <img src={qrImageSrc} alt="Ticket QR" className="w-32 h-32 rounded shadow-sm object-contain" />
        </div>
        <div className="space-y-1 text-xs text-gray-700 leading-tight">
          <p><span className="font-bold">Member:</span> {booking.memberName} ({booking.memberIdInput})</p>
          <p><span className="font-bold">Event:</span> {booking.eventName || 'N/A'}</p>
          <p><span className="font-bold">Tickets:</span> M:{booking.memberTicketCount} G:{booking.guestTicketCount} K:{booking.kidTicketCount}</p>
          <p><span className="font-bold">Meals:</span> Veg:{booking.memberVegCount + booking.guestVegCount + booking.kidVegCount} Non:{booking.memberNonVegCount + booking.guestNonVegCount + booking.kidNonVegCount}</p>
          <p><span className="font-bold">Amount:</span> ₹{booking.finalAmount}</p>
          <p><span className="font-bold">Status:</span> <span className={`font-bold ${booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>{booking.paymentStatus.toUpperCase()}</span></p>
          <p><span className="font-bold">UTR:</span> {booking.utrNumber || booking.paymentDetails?.utrNumber || 'Pending'}</p>
        </div>
        <div className="flex gap-2 mt-4 pt-2 border-t">
          <button onClick={sendViaWhatsApp} className="flex-1 bg-black text-white text-xs rounded-lg py-2 px-3 font-medium hover:bg-gray-800 flex items-center justify-center gap-1">
            <Smartphone className="w-3 h-3" /> WhatsApp
          </button>
          <button onClick={downloadQR} className="flex-1 bg-black text-white text-xs rounded-lg py-2 px-3 font-medium hover:bg-gray-800 flex items-center justify-center gap-1">
            <Download className="w-3 h-3" /> QR
          </button>
        </div>
      </div>
    </div>
  );
};

const OfflineCreatePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newBooking, setNewBooking] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventId: "",
      memberId: "",
      memberName: "",
      contactNumber: "",
      notes: "",
      memberTicketCount: 0,
      guestTicketCount: 0,
      kidTicketCount: 0,
      memberVegCount: 0,
      memberNonVegCount: 0,
      guestVegCount: 0,
      guestNonVegCount: 0,
      kidVegCount: 0,
      kidNonVegCount: 0,
      attendeeNamesJson: [],
      discountCode: "",
      paymentStatus: "paid",
      amountPaid: 0,
      utrNumber: "",
      paymentMode: "upi",
    },
  });

  const memberTicketCount = Number(watch("memberTicketCount") || 0);
  const guestTicketCount = Number(watch("guestTicketCount") || 0);
  const kidTicketCount = Number(watch("kidTicketCount") || 0);
  const totalTickets = memberTicketCount + guestTicketCount + kidTicketCount;
  const watchDiscountCode = watch("discountCode");
  const watchPaymentStatus = watch("paymentStatus");

  const { fields, replace } = useFieldArray({
    control,
    name: "attendeeNamesJson",
  });

  useEffect(() => {
    const needed = memberTicketCount + guestTicketCount;
    const current = fields.length;
    if (needed > current) replace([...fields, ...Array(needed - current).fill({ name: "" })]);
    else if (needed < current) replace(fields.slice(0, needed));
  }, [memberTicketCount, guestTicketCount, replace, fields.length]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://srs-backend-7ch1.onrender.com/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.data || []);
      } catch {
        toast.error("Failed to load events");
      }
    };
    fetchEvents();
  }, []);

  async function fetchMember(memberId) {
    if (!memberId?.trim()) {
      setValue("memberName", "");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://srs-backend-7ch1.onrender.com/api/admin/members/${memberId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setValue("memberName", res.data.data.fullName || "Member");
      toast.success("Member found!");
    } catch {
      toast.error("Invalid Member ID");
      setValue("memberName", "");
    }
  }

  const calculateTotals = () => {
    const data = getValues();
    const event = events.find((e) => e._id === data.eventId);
    if (!event) return { gross: 0, discount: 0, finalAmount: 0, discountPercent: 0 };

    const memberPrice = 1500;
    const guestPrice = 2100;
    const kidPrice = 850;

    const gross =
      memberTicketCount * memberPrice +
      guestTicketCount * guestPrice +
      kidTicketCount * kidPrice;

    const validCodes = {
      Discount52026: 5,
      Discount102026: 10,
      Discount152026: 15,
    };

    const code = (watchDiscountCode || "").trim();
    const discountPercent = validCodes[code] || 0;
    const discount = Math.round((gross * discountPercent) / 100);
    const finalAmount = gross - discount;

    return { gross, discount, finalAmount, discountPercent };
  };

  const { gross, discount, finalAmount, discountPercent } = calculateTotals();

  useEffect(() => {
    if (watchPaymentStatus === "paid") {
      setValue("amountPaid", finalAmount);
    } else {
      setValue("amountPaid", 0);
    }
  }, [finalAmount, watchPaymentStatus, setValue]);

  const onSubmit = async (data) => {
    if (!data.eventId) return toast.error("Please select an event");
    if (!data.memberId.trim()) return toast.error("Member ID is required");
    if (memberTicketCount > 4) return toast.error("Max 4 member tickets allowed");
    if (guestTicketCount > 10) return toast.error("Max 10 guest tickets allowed");

    const totalMeals =
      (Number(data.memberVegCount || 0)) +
      (Number(data.memberNonVegCount || 0)) +
      (Number(data.guestVegCount || 0)) +
      (Number(data.guestNonVegCount || 0)) +
      (Number(data.kidVegCount || 0)) +
      (Number(data.kidNonVegCount || 0));

    if (totalMeals !== totalTickets) return toast.error(`Meal count (${totalMeals}) must equal total tickets (${totalTickets})`);

    if (data.paymentStatus === "paid" && !data.utrNumber.trim()) return toast.error("UTR required for Paid status");

    const payload = {
      ...data,
      memberTicketCount,
      guestTicketCount,
      kidTicketCount,
      grossAmount: gross,
      discountPercent,
      discountAmount: discount,
      finalAmount,
      totalAmount: finalAmount,
      amountPaid: data.paymentStatus === "paid" ? finalAmount : 0,
      seatCount: totalTickets,
      payment_datetime: new Date().toISOString(),
    };

   try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://srs-backend-7ch1.onrender.com/api/admin/offline-bookings",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const booking = res.data.data;
      // Add event name for display
      const event = events.find(e => e._id === data.eventId);
      booking.eventName = event?.title || "Event";
      booking.location = event?.mapsUrl || "not location"
booking.memberIdInput = 
      setNewBooking(booking);
      setShowSuccessModal(true);
      toast.success("Booking created & ticket ready!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }

    
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto">
        {}
        <div className="flex items-center gap-3 mb-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border">
          <button 
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-1 text-xs font-medium text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Offline Booking</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-gray-200">
          
          {}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-600">
                <CalendarIcon className="w-3 h-3" /> Event
              </label>
              <select {...register("eventId", { required: true })} className="w-full text-xs p-2 border border-gray-200 rounded focus:ring-1 focus:ring-indigo-400 bg-white">
                <option value="">Select Event</option>
                {events.map((e) => (
                  <option key={e._id} value={e._id}>{e.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-600">
                <UserIcon className="w-3 h-3" /> Member ID
              </label>
              <input 
                type="text" 
                {...register("memberId", { required: true })} 
                onBlur={(e) => fetchMember(e.target.value)} 
                className="w-full text-xs p-2 border border-gray-200 rounded focus:ring-1 focus:ring-indigo-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-600">
                <UserIcon className="w-3 h-3" /> Name
              </label>
              <input type="text" {...register("memberName")} readOnly className="w-full text-xs p-2 border border-gray-200 bg-gray-50 rounded" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-600">
                <PhoneIcon className="w-3 h-3" /> Phone
              </label>
              <input type="tel" {...register("contactNumber")} className="w-full text-xs p-2 border border-gray-200 rounded focus:ring-1 focus:ring-indigo-400" />
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-indigo-50/80 p-3 rounded-lg border border-indigo-100">
              <h3 className="text-indigo-700 text-xs font-bold mb-2 flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> Member (₹1500)
              </h3>
              <input type="number" min={0} max={4} {...register("memberTicketCount", { valueAsNumber: true })} className="w-full text-xs p-1.5 border border-indigo-200 rounded mb-2" />
              <div className="grid grid-cols-2 gap-1 text-xs">
                <input type="number" min={0} {...register("memberVegCount", { valueAsNumber: true })} placeholder="V" className="text-xs p-1 border border-indigo-200 rounded" />
                <input type="number" min={0} {...register("memberNonVegCount", { valueAsNumber: true })} placeholder="NV" className="text-xs p-1 border border-indigo-200 rounded" />
              </div>
            </div>

            <div className="bg-green-50/80 p-3 rounded-lg border border-green-100">
              <h3 className="text-green-700 text-xs font-bold mb-2 flex items-center gap-1">
                <TicketIcon className="w-3 h-3" /> Guest (₹2100)
              </h3>
              <input type="number" min={0} max={10} {...register("guestTicketCount", { valueAsNumber: true })} className="w-full text-xs p-1.5 border border-green-200 rounded mb-2" />
              <div className="grid grid-cols-2 gap-1 text-xs">
                <input type="number" min={0} {...register("guestVegCount", { valueAsNumber: true })} placeholder="V" className="text-xs p-1 border border-green-200 rounded" />
                <input type="number" min={0} {...register("guestNonVegCount", { valueAsNumber: true })} placeholder="NV" className="text-xs p-1 border border-green-200 rounded" />
              </div>
            </div>

            <div className="bg-purple-50/80 p-3 rounded-lg border border-purple-100">
              <h3 className="text-purple-700 text-xs font-bold mb-2 flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> Kid (₹850)
              </h3>
              <input type="number" min={0} {...register("kidTicketCount", { valueAsNumber: true })} className="w-full text-xs p-1.5 border border-purple-200 rounded mb-2" />
              <div className="grid grid-cols-2 gap-1 text-xs">
                <input type="number" min={0} {...register("kidVegCount", { valueAsNumber: true })} placeholder="V" className="text-xs p-1 border border-purple-200 rounded" />
                <input type="number" min={0} {...register("kidNonVegCount", { valueAsNumber: true })} placeholder="NV" className="text-xs p-1 border border-purple-200 rounded" />
              </div>
            </div>
          </div>

          {}
          <div className="space-y-1 max-h-20 overflow-auto bg-gray-50 p-2 rounded border">
            {fields.slice(0, memberTicketCount + guestTicketCount).map((field, index) => (
              <input 
                key={field.id} 
                {...register(`attendeeNamesJson.${index}.name`)} 
                placeholder={`Attendee ${index + 1}`} 
                className="w-full text-xs p-1.5 border border-gray-200 rounded text-xs" 
              />
            ))}
          </div>

          {}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border">
            <div className="flex gap-2 mb-2">
              <input
                {...register("discountCode")}
                placeholder="Discount Code"
                className="flex-1 text-xs p-2 border border-yellow-200 rounded font-mono bg-yellow-100 focus:ring-1"
              />
            </div>
            <div className="text-xs space-y-1 bg-white p-2 rounded text-center">
              <p>Gross: ₹{gross.toLocaleString()}</p>
              <p className="text-red-600">Disc {discountPercent}%: -₹{discount.toLocaleString()}</p>
              <p className="font-bold text-green-700 text-sm">Final: ₹{finalAmount.toLocaleString()}</p>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border">
            <div>
              <label className="text-xs font-semibold mb-1 block text-gray-600">Status</label>
              <select {...register("paymentStatus")} className="w-full text-xs p-2 border border-purple-200 rounded">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block text-gray-600">Amount</label>
              <input type="number" {...register("amountPaid")} readOnly={watch("paymentStatus") === "paid"} className="w-full text-xs p-2 border border-purple-200 rounded bg-purple-50" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block text-gray-600">UTR *</label>
              <input {...register("utrNumber")} className="w-full text-xs p-2 border border-purple-200 rounded" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block text-gray-600">Mode</label>
              <select {...register("paymentMode")} className="w-full text-xs p-2 border border-purple-200 rounded">
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>

          {}
          <div>
            <label className="text-xs font-semibold mb-1 block text-gray-600 flex items-center gap-1">
              <UserIcon className="w-3 h-3" /> Notes
            </label>
            <textarea {...register("notes")} rows={2} className="w-full text-xs p-2 border border-gray-200 rounded resize-none" />
          </div>

          {}
          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="text-sm font-bold text-gray-700">
              Total: <span className="text-green-600 font-black">{totalTickets}</span> seats
            </div>
            <button
              type="submit"
              disabled={loading}
              className="ml-auto bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <CheckCircleIcon className="w-4 h-4" />
              )}
              Complete
            </button>
          </div>
        </form>

        {showSuccessModal && (
          <SuccessModal
            booking={newBooking}
            onClose={() => {
              setShowSuccessModal(false);
              setNewBooking(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OfflineCreatePage;
