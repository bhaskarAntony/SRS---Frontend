import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import api from '../../services/api';
import {
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  ArrowPathIcon,
  BeakerIcon,
  CameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const QrScanPage = () => {
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('real');
  const [testQrCode, setTestQrCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [errorResult, setErrorResult] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [lastCode, setLastCode] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const safelyStopScanner = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (
          state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.REQUESTING_PERMISSION
        ) {
          await scannerRef.current.stop();
        }
      } catch {}
      scannerRef.current = null;
    }
  };

  const safelyStartScanner = async () => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    const scanner = new Html5Qrcode('qr-reader');
    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 }, 
          aspectRatio: 1,
        },
        (text) => handleScanSuccess(text),
        () => {}
      );
      scannerRef.current = scanner;
    } catch (err) {
      setErrorResult({ message: 'Camera not allowed', reason: 'Use Test tab' });
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (activeTab === 'real') safelyStartScanner();
    else safelyStopScanner();
    return () => safelyStopScanner();
  }, [activeTab]);

  const handleScanSuccess = async (code) => {
    code = code.trim();
    if (!code || isSending || code === lastCode) return;
    await processScan(code);
  };

  const handleTestScan = async () => {
    const code = testQrCode.trim();
    if (!code) return;
    await processScan(code);
    setTestQrCode('');
  };

  const processScan = async (qrCodeValue) => {
    setIsSending(true);
    setLastCode(qrCodeValue);
    setScanResult(null);
    setErrorResult(null);
    await safelyStopScanner();

    try {
      const res = await api.post('/bookings/scan-qr', {
        qrCode: qrCodeValue,
        location: location || undefined,
        notes: notes || undefined,
      });
      setScanResult(res.data);
    } catch (err) {
      setErrorResult({
        message: err.response?.data?.message || 'Invalid QR',
        reason: err.response?.data?.reason || null,
      });
    } finally {
      setIsSending(false);
      setShowPopup(true);
    }
  };

  const closeAndContinue = () => {
    setShowPopup(false);
    setScanResult(null);
    setErrorResult(null);
    setLastCode('');
    setNotes('');
    setLocation('');
    setTestQrCode('');
    if (activeTab === 'real') safelyStartScanner();
  };

  const booking = scanResult?.data?.booking;

  return (
    <>
      <div className="min-h-screen bg-black text-white flex flex-col">
        
        {}
        <header className="bg-black border-b border-zinc-800 px-4 py-3">
          <p className="text-[10px] uppercase text-zinc-500">QR Scanner</p>
          <h1 className="text-base font-bold">Entry Check</h1>
        </header>

        {}
        <div className="flex bg-zinc-900 text-[12px]">
          <button
            onClick={() => setActiveTab('real')}
            className={`flex-1 py-3 font-bold flex items-center justify-center gap-1 ${
              activeTab === 'real'
                ? 'text-white bg-zinc-800'
                : 'text-zinc-500'
            }`}
          >
            <CameraIcon className="w-4 h-4" /> Live
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 py-3 font-bold flex items-center justify-center gap-1 ${
              activeTab === 'test'
                ? 'text-white bg-zinc-800'
                : 'text-zinc-500'
            }`}
          >
            <BeakerIcon className="w-4 h-4" /> Test
          </button>
        </div>

        {}
        <main className="flex-1 flex flex-col items-center px-3 pt-4 pb-6 gap-4">
          
          {}
          <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            {activeTab === 'real' ? (
              <>
                <p className="text-center text-zinc-400 text-[10px] mb-3">
                  Position QR inside the frame
                </p>
                <div className="rounded-xl overflow-hidden border-2 border-zinc-700">
                  <div id="qr-reader" ref={containerRef} className="w-full aspect-square" />
                </div>
              </>
            ) : (
              <>
                <p className="text-[11px] text-zinc-400 mb-2">Enter QR code manually</p>
                <input
                  type="text"
                  value={testQrCode}
                  onChange={(e) => setTestQrCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTestScan()}
                  placeholder="Paste QR Code"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500"
                />
                <button
                  onClick={handleTestScan}
                  disabled={isSending || !testQrCode.trim()}
                  className="mt-3 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 font-bold py-2.5 rounded-lg text-sm"
                >
                  {isSending ? 'Checking...' : 'Test Scan'}
                </button>
              </>
            )}
          </div>

          {}
          <div className="w-full max-w-md space-y-3">
            <div>
              <label className="text-[10px] text-zinc-500">Gate / Location</label>
              <div className="mt-1 flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                <MapPinIcon className="w-4 h-4 text-zinc-500" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 text-[13px] bg-transparent outline-none"
                  placeholder="e.g. Gate A"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[13px] outline-none"
                placeholder="Optional notes..."
              />
            </div>
          </div>
        </main>
      </div>

     {showPopup && (scanResult || errorResult) && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={closeAndContinue}
    ></div>

    {}
    <div className="
      relative bg-zinc-900 text-white 
      rounded-2xl shadow-2xl border border-zinc-800
      w-[90%] max-w-sm 
      p-6 animate-in fade-in zoom-in duration-300
    ">
      {}
      <button onClick={closeAndContinue} className="absolute top-3 right-3">
        <XMarkIcon className="w-6 h-6 text-zinc-400 hover:text-white" />
      </button>

      {}
      {scanResult && booking && (
        <div className="text-center">
          <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-3" />

          <h2 className="text-2xl font-extrabold text-emerald-400">VALID</h2>
          <p className="text-xs text-zinc-400 mt-1">Booking ID: {booking.bookingId}</p>

          <div className="mt-5 bg-black/40 rounded-xl p-4 space-y-2 text-left text-sm">
            <p className="font-semibold text-white truncate">{booking.event?.title}</p>
            <div className="flex items-center gap-2 text-zinc-300">
              <CalendarDaysIcon className="w-4 h-4" />
              <span className="text-xs">
                {new Date(booking.event?.startDate).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs">
                {new Date(booking.event?.startDate).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-xs truncate">{booking.event?.venue}</span>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <UserIcon className="w-4 h-4" />
              <span className="text-xs">
                {booking.user?.firstName} {booking.user?.lastName}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-4xl font-black text-emerald-400">{booking.remainingScans}</p>
            <p className="text-xs text-zinc-500">entries remaining</p>
          </div>

          <button
            onClick={closeAndContinue}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-sm py-3 rounded-xl"
          >
            Scan Next
          </button>
        </div>
      )}

      {}
      {errorResult && (
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />

          <h2 className="text-2xl font-extrabold text-red-500">INVALID</h2>

          <p className="text-sm font-medium text-zinc-300 mt-1">{errorResult.message}</p>

          {errorResult.reason && (
            <p className="text-xs text-red-400 mt-2">{errorResult.reason}</p>
          )}

          <button
            onClick={closeAndContinue}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 font-bold text-sm py-3 rounded-xl"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  </div>
)}

    </>
  );
};

export default QrScanPage;
