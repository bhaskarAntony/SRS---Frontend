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
} from "@heroicons/react/24/outline";
import QRCode from "qrcode.react";
import { Download, Smartphone, X } from "lucide-react";

const SuccessModal = ({ booking, onClose }) => {

    console.log(booking);
  if (!booking) return null;

  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${booking.qrCode}`;

  const message = `*Your Event Booking:* https://thesrsevents.com/events/${booking.event} \n\n Hello *${booking.memberName}*!\n\n✅ Your SRS Events ticket is confirmed!\n\n🔢 *Booking ID:* #${booking.bookingId}\n👤 *Member:* ${booking.memberName} (${booking.memberIdInput})\n🎪 *Event:* ${booking.eventName || 'N/A'}\n🎫 *Tickets:* M:${booking.memberTicketCount} G:${booking.guestTicketCount} K:${booking.kidTicketCount}\n🍽️ *Meals:* Veg:${booking.memberVegCount + booking.guestVegCount + booking.kidVegCount} | Non-Veg:${booking.memberNonVegCount + booking.guestNonVegCount + booking.kidNonVegCount}\n💰 *Amount:* ₹${booking.finalAmount}\n📊 *Status:* ${booking.paymentStatus.toUpperCase()}\n🆔 *UTR:* ${booking.utrNumber || booking.paymentDetails?.utrNumber || 'Pending'}\n\n📱 *Show this QR at entrance*\n\nSRS Events Team 🚀`;

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
          <p><strong>Event:</strong> {booking.eventName || 'N/A'}</p>
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
    const kidPrice =  850;

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
      const res = await axios.post("https://srs-backend-7ch1.onrender.com/api/admin/offline-bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewBooking(res.data.data);
      toast.success("Booking created successfully!");
      setShowSuccessModal(true);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8 space-y-10 overflow-auto">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">Offline Booking</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-700">
                <CalendarIcon className="w-4 h-4" /> Select Event
              </label>
              <select {...register("eventId", { required: true })} className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">-- Select Event --</option>
                {events.map((e) => (
                  <option key={e._id} value={e._id}>{e.title}</option>
                ))}
              </select>
              {errors.eventId && <p className="text-xs text-red-600 mt-1">Event is required.</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-700">
                <UserIcon className="w-4 h-4" /> Member ID
              </label>
              <input type="text" {...register("memberId", { required: true })} onBlur={(e) => fetchMember(e.target.value)} placeholder="Enter Member ID" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.memberId && <p className="text-xs text-red-600 mt-1">Member ID is required.</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-700">
                <UserIcon className="w-4 h-4" /> Member Name
              </label>
              <input type="text" {...register("memberName")} readOnly placeholder="Auto-filled Member Name" className="w-full border border-gray-200 bg-gray-100 rounded-lg p-3 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-700">
                <PhoneIcon className="w-4 h-4" /> Contact Number
              </label>
              <input type="tel" {...register("contactNumber")} placeholder="Contact Number" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1 text-gray-700">
                <UserIcon className="w-4 h-4" /> Notes (optional)
              </label>
              <textarea {...register("notes")} rows={3} placeholder="Additional notes" className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
          </section>

          {}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {}
            <div className="bg-indigo-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-indigo-700 font-bold text-lg flex items-center gap-2"><UserIcon className="w-5 h-5" /> Member Tickets (₹1500)</h3>
              <input type="number" min={0} max={4} {...register("memberTicketCount", { valueAsNumber: true })} className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-400" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" min={0} {...register("memberVegCount", { valueAsNumber: true })} placeholder="Veg" className="p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-400" />
                <input type="number" min={0} {...register("memberNonVegCount", { valueAsNumber: true })} placeholder="Non-Veg" className="p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-400" />
              </div>
              {fields.slice(0, memberTicketCount).map((field, index) => (
                <input key={field.id} {...register(`attendeeNamesJson.${index}.name`)} placeholder={`Member ${index + 1} Name (optional)`} className="w-full p-2 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-400 mt-1" />
              ))}
            </div>

            {}
            <div className="bg-green-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-green-700 font-bold text-lg flex items-center gap-2"><TicketIcon className="w-5 h-5" /> Guest Tickets (₹2100)</h3>
              <input type="number" min={0} max={10} {...register("guestTicketCount", { valueAsNumber: true })} className="w-full p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-400" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" min={0} {...register("guestVegCount", { valueAsNumber: true })} placeholder="Veg" className="p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-400" />
                <input type="number" min={0} {...register("guestNonVegCount", { valueAsNumber: true })} placeholder="Non-Veg" className="p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-400" />
              </div>
              {fields.slice(memberTicketCount, memberTicketCount + guestTicketCount).map((field, index) => (
                <input key={field.id} {...register(`attendeeNamesJson.${memberTicketCount + index}.name`)} placeholder={`Guest ${index + 1} Name (optional)`} className="w-full p-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-400 mt-1" />
              ))}
            </div>

            {}
            <div className="bg-purple-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-purple-700 font-bold text-lg flex items-center gap-2"><UserIcon className="w-5 h-5" /> Kid Tickets (₹850)</h3>
              <input type="number" min={0} {...register("kidTicketCount", { valueAsNumber: true })} className="w-full p-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-400" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" min={0} {...register("kidVegCount", { valueAsNumber: true })} placeholder="Veg" className="p-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-400" />
                <input type="number" min={0} {...register("kidNonVegCount", { valueAsNumber: true })} placeholder="Non-Veg" className="p-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-400" />
              </div>
            </div>
          </section>

          {}
          <section className="bg-yellow-50 rounded-3xl p-6 border border-yellow-300 mt-8 space-y-4">
            <h2 className="text-yellow-800 text-2xl font-bold">Pricing & Discount</h2>
            <input
              {...register("discountCode")}
              placeholder="Enter discount code (e.g., Discount152026)"
              className="block mx-auto w-full max-w-sm text-center rounded-lg border border-yellow-400 p-3 font-mono font-semibold focus:outline-none focus:ring-4 focus:ring-yellow-300"
            />
            <div className="bg-yellow-100 rounded-3xl p-6 text-center font-black text-3xl tracking-wide">
              <p>Gross Amount: ₹{gross.toLocaleString()}</p>
              <p className="text-red-600 my-2">Discount ({discountPercent}%): -₹{discount.toLocaleString()}</p>
              <p className="text-green-700 text-4xl mt-4">Final Amount: ₹{finalAmount.toLocaleString()}</p>
            </div>
          </section>

          {}
          <section className="bg-purple-50 rounded-3xl p-6 border border-purple-300 mt-8 space-y-4">
            <h2 className="text-purple-800 text-2xl font-bold">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select {...register("paymentStatus")} className="rounded-lg border border-purple-300 p-3 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
              <input
                type="number"
                {...register("amountPaid")}
                readOnly={watch("paymentStatus") === "paid"}
                placeholder="Amount Paid (auto-filled)"
                className="rounded-lg border border-purple-300 p-3 text-lg text-right bg-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
              <input
                {...register("utrNumber")}
                placeholder="UTR / Reference Number *"
                className="rounded-lg border border-purple-300 p-3 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
              <select {...register("paymentMode")} className="rounded-lg border border-purple-300 p-3 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300">
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="other">Other</option>
              </select>
            </div>
          </section>

          {}
          <div className="flex justify-between items-center mt-10">
            <div className="text-2xl font-bold">
              Total Seats: <span className="text-green-600">{totalTickets}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-gray-900 text-white rounded-3xl shadow-lg px-10 py-4 flex items-center gap-4 font-extrabold text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <svg className="animate-spin w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <CheckCircleIcon className="w-8 h-8" />
              )}
              <span>Complete Booking</span>
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
