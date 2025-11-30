import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ShareIcon,
  ArrowLeftIcon,
  CheckIcon,
  HeartIcon as HeartOutline,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  WifiIcon,
  TruckIcon,
  CakeIcon,
  TagIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  StarIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  LinkIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  TicketIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { eventService } from '../../services/eventService';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await eventService.getEventById(id);
      setEvent(res.data);
    } catch (err) {
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: event?.title, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><LoadingSpinner size="large" /></div>;
  if (!event) return null;

  const seatsLeft = event.availableSeats || (event.maxCapacity - (event.bookedSeats || 0));
  const isSoldOut = seatsLeft <= 0;
  const userPrice = Number(event.userPrice) || 0;
  const memberPrice = Number(event.memberPrice) || 0;
  const guestPrice = Number(event.guestPrice) || 0;
  const totalAmount = qty * userPrice;

  const maxAllowed = Math.min(seatsLeft, event.maxTicketsPerUser || 5);

  const increaseQty = () => {
    if (qty < maxAllowed) setQty(qty + 1);
    else toast.error(`Max ${maxAllowed} tickets allowed`);
  };

  const decreaseQty = () => qty > 1 && setQty(qty - 1);

  const handleaddItem = () => {
    const cartItem = {
      eventId: event._id,
      title: event.title,
      price: userPrice,
      qty,
      bannerImage: event.bannerImage,
      date: event.startDate,
      venue: event.venue || event.location,
    };
    addItem(event, qty, event.bookingType);
    toast.success('Added to cart!', { icon: 'Cart', style: { background: '#1a1a1a', color: '#fff' } });
  };

  const handleBuyNow = () => {
    const cartItem = { ...cartItem, qty };
    addItem(cartItem, true);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-500">Events</span>
            <span className="text-gray-500">›</span>
            <span className="text-gray-400">{event.category}</span>
            <span className="text-gray-500">›</span>
            <span className="text-white truncate max-w-xs">{event.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 hover:bg-white/10 rounded-lg transition">
              {isFavorite ? <HeartSolid className="w-5 h-5 text-red-500" /> : <HeartOutline className="w-5 h-5" />}
            </button>
            <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-lg transition">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2 space-y-8">

            {}
            <div className="bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {event.featured && <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold rounded-full">Bestseller</span>}
                {isSoldOut && <span className="px-3 py-1 bg-red-600 text-xs font-bold rounded-full">Sold Out</span>}
                {!isSoldOut && seatsLeft < 100 && <span className="px-3 py-1 bg-orange-600 text-xs font-bold rounded-full">Only {seatsLeft} left</span>}
              </div>

              <h1 className="text-2xl md:text-3xl font-black leading-tight mb-3">{event.title}</h1>
              <p className="text-base md:text-lg text-gray-300 mb-5">{event.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2"><StarIcon className="w-5 h-5 text-yellow-500" /><span className="font-bold text-white">4.8</span> (Featured)</div>
                <div className="flex items-center gap-2"><UsersIcon className="w-5 h-5" /><span>{(event.viewCount || 0).toLocaleString()} views</span></div>
                <div className="flex items-center gap-2"><HeartOutline className="w-5 h-5" /><span>{event.favoriteCount || 0} favorites</span></div>
              </div>

              <div className="mt-5 text-sm text-gray-500">
                Organized by <span className="text-purple-400 font-bold">{event.organizer.name}</span>
              </div>
            </div>

            {}
            {event.longDescription && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold mb-4">About this Event</h2>
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">{event.longDescription}</div>
              </div>
            )}

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4"><CalendarDaysIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-lg">{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
                    <p className="text-sm text-gray-400">{event.duration}</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4"><MapPinIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-lg">{event.venue || 'TBD'}</p>
                    <p className="text-sm text-gray-400">{event.location}</p>
                    {event.address?.city && <p className="text-xs text-gray-500">{event.address.city}, {event.address.state}</p>}
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4"><ClockIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-lg">{formatTime(event.startDate)}</p>
                    <p className="text-sm text-gray-400">Registration from {formatDate(event.registrationStartDate)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="flex gap-4"><UsersIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-lg">{seatsLeft} seats left</p>
                    <p className="text-sm text-gray-400">of {event.maxCapacity} total</p>
                  </div>
                </div>
              </div>
            </div>

            {}
            {event.tags?.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-900/50 rounded-full text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {}
            {event.highlights?.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-5">What You'll Get</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <CheckIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <span className="text-gray-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-5">Amenities & Rules</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {event.hasRefreshments && <div className="flex items-center gap-2"><CakeIcon className="w-5 h-5 text-orange-400" /> Refreshments</div>}
                {event.hasParking && <div className="flex items-center gap-2"><TruckIcon className="w-5 h-5 text-blue-400" /> Parking</div>}
                {event.hasWifi && <div className="flex items-center gap-2"><WifiIcon className="w-5 h-5 text-purple-400" /> WiFi</div>}
                {event.isWheelchairAccessible && <div className="col-span-2 text-emerald-400 font-bold">Wheelchair Accessible</div>}
                {event.ageRestriction !== 'All Ages' && <div className="flex items-center gap-2 col-span-2"><ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" /> Age: {event.ageRestriction}</div>}
                {event.dresscode && <div className="flex items-center gap-2 col-span-2"><TagIcon className="w-5 h-5 text-pink-400" /> Dress Code: {event.dresscode}</div>}
                {event.seatingType && <div className="flex items-center gap-2 col-span-2"><TicketIcon className="w-5 h-5 text-cyan-400" /> Seating: {event.seatingType}</div>}
              </div>
            </div>

            {}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-5">Organizer</h3>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                  {event.organizer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black">{event.organizer.name}</h4>
                  {event.organizer.description && <p className="text-gray-400 mt-2">{event.organizer.description}</p>}
                  <div className="mt-4 space-y-2 text-sm">
                    {event.organizer.email && <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4" /> {event.organizer.email}</div>}
                    {event.organizer.phone && <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> {event.organizer.phone}</div>}
                    {event.organizer.website && <a href={event.organizer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-400"><LinkIcon className="w-4 h-4" /> Website</a>}
                  </div>
                  {}
                  {(event.socialMedia?.facebook || event.socialMedia?.instagram || event.socialMedia?.twitter || event.socialMedia?.linkedin) && (
                    <div className="flex gap-3 mt-4">
                      {event.socialMedia.facebook && <a href={event.socialMedia.facebook} className="text-blue-500 hover:text-blue-400">FB</a>}
                      {event.socialMedia.instagram && <a href={event.socialMedia.instagram} className="text-pink-500 hover:text-pink-400">IG</a>}
                      {event.socialMedia.twitter && <a href={event.socialMedia.twitter} className="text-sky-500 hover:text-sky-400">TW</a>}
                      {event.socialMedia.linkedin && <a href={event.socialMedia.linkedin} className="text-blue-700 hover:text-blue-600">LI</a>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {}
            {event.gallery?.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-5">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {event.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`Gallery ${i + 1}`} className="w-full h-40 object-cover rounded-xl hover:scale-105 transition" />
                  ))}
                </div>
              </div>
            )}

            {}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10 space-y-6">
              <h3 className="text-xl font-bold">Important Information</h3>
              {event.specialNotes && (
                <div className="flex gap-3"><InformationCircleIcon className="w-5 h-5 text-blue-400" />
                  <p className="text-gray-300 whitespace-pre-line">{event.specialNotes}</p>
                </div>
              )}
              <div className="text-sm space-y-3 text-gray-400">
                <p><strong>Refund Policy:</strong> {event.refundPolicy}</p>
                <p><strong>Cancellation Policy:</strong> {event.cancellationPolicy || 'Not specified'}</p>
                <p><strong>Terms & Conditions:</strong> {event.terms || 'Standard terms apply'}</p>
              </div>
            </div>

            {}
            {event.faqs?.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-5">Frequently Asked Questions</h3>
                {event.faqs.map((faq, i) => (
                  <details key={i} className="group py-4 border-b border-white/10 last:border-0">
                    <summary className="flex justify-between items-center cursor-pointer list-none text-sm">
                      <span className="font-medium pr-6">{faq.question}</span>
                      <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500 group-open:rotate-180 transition" />
                    </summary>
                    <p className="mt-3 text-sm text-gray-400 pl-1">{faq.answer}</p>
                  </details>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="relative h-48">
                <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-black text-white line-clamp-2">{event.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-black">₹{userPrice.toLocaleString()}</p>
                  {memberPrice < userPrice && (
                    <p className="text-emerald-400 text-sm font-bold mt-1">Member Price: ₹{memberPrice.toLocaleString()}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">per ticket</p>
                </div>

                <div className="bg-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-5">
                    <button onClick={decreaseQty} disabled={qty === 1} className="w-10 h-10 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 flex items-center justify-center">
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-black w-12 text-center">{qty}</span>
                    <button onClick={increaseQty} disabled={qty >= maxAllowed} className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 flex items-center justify-center">
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Max {event.maxTicketsPerUser || 5} per user • {seatsLeft} left
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-5 border border-purple-600/50">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">Total</p>
                    <p className="text-3xl font-black">₹{totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={handleBuyNow} disabled={isSoldOut} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 font-bold py-4 rounded-xl transition">
                    Buy Now
                  </button>
                  <button onClick={handleaddItem} disabled={isSoldOut} className="w-full border border-white hover:bg-white hover:text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition">
                    <ShoppingCartIcon className="w-5 h-5" /> Add to Cart
                  </button>
                </div>

                <div className="text-center text-xs text-gray-400 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                    Instant QR Ticket • 100% Secure Payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
