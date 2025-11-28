import React from "react";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950">
      {}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-blue-950/60" />

      {}
      <div className="absolute top-20 left-10 w-80 h-80 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 md:w-80 md:h-80 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-20 text-center">

        {}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-cyan-300 text-sm font-medium mb-6">
          <Sparkles className="w-5 h-5" />
          Trusted by 18,000+ College Clubs
        </div>

        {}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
          Sell Out Every Event
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 mt-2">
            In Record Time
          </span>
        </h1>

        {}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Guests get up to 70% off • Instant QR tickets • Zero queue entry
        </p>

        {}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
            Start Free Instantly
            <ArrowRight className="w-6 h-6" />
          </button>
          <button className="bg-white/10 backdrop-blur-lg border border-white/30 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all">
            <PlayCircle className="w-6 h-6" />
            Watch 60s Demo
          </button>
        </div>

        {}
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black text-cyan-300">2.4M+</div>
            <div className="text-blue-200">Tickets Sold</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-cyan-300">₹520Cr+</div>
            <div className="text-blue-200">Revenue</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-cyan-300">400+</div>
            <div className="text-blue-200">Colleges</div>
          </div>
        </div>

        {}
        <div className="mt-16 relative max-w-5xl mx-auto">
          {}
          <div className="absolute -top-8 -left-4 md:left-10 w-72 md:w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl -rotate-6 hover:rotate-0 transition-all duration-500 z-20 text-center">
            <img src="https://www.nicepng.com/png/detail/851-8518258_qr-code-png-images-qr-code.png" alt=""  width={150}/>
            <h4 className="text-white font-bold text-lg">Instant QR Ticket</h4>
            <p className="text-cyan-200 text-sm mt-1">Delivered in 5 seconds</p>
          </div>

          {}
          <div className="relative z-30 bg-white rounded-3xl shadow-2xl overflow-hidden ring-8 ring-cyan-400/40 mx-auto max-w-sm md:max-w-md transform hover:scale-105 transition-all duration-500">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white text-center">
              <h3 className="text-2xl font-bold">SRS Events Dashboard</h3>
              <p className="text-sm opacity-90 mt-1">Live • Technovation 2025</p>
            </div>
            <div className="p-8 bg-gray-50">
              <div className="flex justify-between items-center mb-5">
                <span className="text-gray-600 font-medium">Tickets Sold</span>
                <span className="text-3xl font-black text-green-600">1,842</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full w-[92%]" />
              </div>
            </div>
          </div>

          {}
          <div className="absolute -top-8 -right-4 md:right-10 w-72 md:w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl rotate-6 hover:rotate-0 transition-all duration-500 z-20">
                       <img src="https://www.nicepng.com/png/detail/851-8518258_qr-code-png-images-qr-code.png" alt=""  width={150} style={{float:"right"}}/>

            <h4 className="text-white font-bold text-lg">Referral Magic</h4>
            <p className="text-cyan-amber-200 text-sm mt-1">1,200+ guests saved today</p>
          </div>
        </div>

      </div>

      {}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-24 md:h-32" preserveAspectRatio="none">
          <path d="M0,120 L60,100 C180,70 360,40 540,45 C720,50 900,80 1080,85 C1260,90 1380,80 1440,75 L1440,120 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
