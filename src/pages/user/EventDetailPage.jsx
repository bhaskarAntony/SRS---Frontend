import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  ShareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import BookingCard from '../../components/UI/BookingCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { eventService } from '../../services/eventService';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (bookingDetails) => {
    if (!isAuthenticated) {
      toast.error('Please login to book events');
      navigate('/login');
      return;
    }
    
    navigate('/checkout', {
      state: {
        event,
        bookingDetails,
      },
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="btn-primary"
          >
            Browse Other Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            {}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="h-64 md:h-80 bg-gray-200">
                <img
                  src={event.bannerImage || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {event.category && (
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                        {event.category}
                      </span>
                    )}
                    {event.featured && (
                      <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <CalendarDaysIcon className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">{formatDate(event.startDate)}</p>
                      {event.endDate && event.startDate !== event.endDate && (
                        <p className="text-sm">to {formatDate(event.endDate)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">{formatTime(event.startDate)}</p>
                      <p className="text-sm">{event.duration}</p>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">{event.location}</p>
                        {event.venue && (
                          <p className="text-sm">{event.venue}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">
                        {event.maxCapacity - (event.bookedSeats || 0)} seats available
                      </p>
                      <p className="text-sm">of {event.maxCapacity} total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                {event.longDescription && (
                  <div>
                    <div className={`text-gray-600 ${showFullDescription ? '' : 'line-clamp-4'}`}>
                      {event.longDescription}
                    </div>
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-primary-600 hover:text-primary-700 font-medium flex items-center"
                    >
                      {showFullDescription ? (
                        <>
                          Show Less <ChevronUpIcon className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Show More <ChevronDownIcon className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {}
            {event.highlights && event.highlights.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Highlights</h2>
                <ul className="space-y-2">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-success-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {}
            {event.gallery && event.gallery.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${event.title} gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {event.organizer && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Organizer</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">
                      {event.organizer.name?.charAt(0) || 'O'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.organizer.name}</h3>
                    {event.organizer.email && (
                      <p className="text-gray-600">{event.organizer.email}</p>
                    )}
                    {event.organizer.phone && (
                      <p className="text-gray-600">{event.organizer.phone}</p>
                    )}
                  </div>
                </div>
                {event.organizer.description && (
                  <p className="mt-4 text-gray-600">{event.organizer.description}</p>
                )}
              </div>
            )}

            {}
            {event.faqs && event.faqs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {event.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        {expandedFAQ === index ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <p className="mt-2 text-gray-600">{faq.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {}
          <div className="lg:col-span-1">
            <BookingCard event={event} onBookNow={handleBookNow} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
