import React from "react";
import { Calendar, Share2, Ticket, QrCode, Smartphone } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Calendar className="w-8 h-8" />
            </div>
            <p className="font-semibold text-gray-800">Create Event</p>
          </div>

          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Share2 className="w-8 h-8" />
            </div>
            <p className="font-semibold text-gray-800">Members Share</p>
          </div>

          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Ticket className="w-8 h-8" />
            </div>
            <p className="font-semibold text-gray-800">Guests Save Big</p>
          </div>

          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <QrCode className="w-8 h-8" />
            </div>
            <p className="font-semibold text-gray-800">Get QR Ticket</p>
          </div>

          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Smartphone className="w-8 h-8" />
            </div>
            <p className="font-semibold text-gray-800">Enter Instantly</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
