
import React, { useState, useEffect } from 'react';
import { Room, Booking, BookingStatus } from '../types';
import { StorageService } from '../services/storageService';

interface BookingModalProps {
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ room, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Details, 2: Payment, 3: Processing/Success
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    checkIn: '',
    checkOut: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [error, setError] = useState('');
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      setTotalDays(diff > 0 ? diff : 0);
    }
  }, [formData.checkIn, formData.checkOut]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      setError('Please fill in all booking details.');
      return;
    }
    if (totalDays <= 0) {
      setError('Check-out must be after check-in.');
      return;
    }
    
    // Check availability
    if (!StorageService.isRoomAvailable(room.id, formData.checkIn, formData.checkOut)) {
      setError('Sorry, this room is already booked for the selected dates.');
      return;
    }

    setError('');
    setStep(2);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardNumber.length < 16 || !formData.expiry || formData.cvv.length < 3) {
      setError('Please enter valid payment details.');
      return;
    }

    setStep(3);
    // Simulate API delay
    setTimeout(() => {
      const booking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        roomId: room.id,
        roomName: room.name,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        totalPrice: totalDays * room.pricePerNight,
        status: BookingStatus.CONFIRMED,
        createdAt: new Date().toISOString()
      };
      StorageService.saveBooking(booking);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            {step === 1 ? 'Booking Details' : step === 2 ? 'Secure Payment' : 'Confirming...'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleNext}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.guestName}
                  onChange={e => setFormData({...formData, guestName: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.guestEmail}
                  onChange={e => setFormData({...formData, guestEmail: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Check-in</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.checkIn}
                    onChange={e => setFormData({...formData, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Check-out</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.checkOut}
                    onChange={e => setFormData({...formData, checkOut: e.target.value})}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {totalDays > 0 && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-indigo-600">Stay Duration</span>
                    <span className="font-bold text-indigo-900">{totalDays} Nights</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-slate-800">Total Price</span>
                    <span className="text-indigo-600">${totalDays * room.pricePerNight}</span>
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                Proceed to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePayment}>
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Paying for <span className="font-bold text-slate-800">{room.name}</span></span>
                <span className="text-xl font-bold text-indigo-600">${totalDays * room.pricePerNight}</span>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    maxLength={16}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.cardNumber}
                    onChange={e => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
                    placeholder="4444 4444 4444 4444"
                  />
                  <div className="absolute right-3 top-2.5 text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV</label>
                  <input 
                    type="password" 
                    maxLength={3}
                    placeholder="123"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.cvv}
                    onChange={e => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                >
                  Back
                </button>
                <button type="submit" className="flex-[2] py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
                  Pay Now
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Simulating Payment...</h3>
              <p className="text-slate-500 px-8">Please do not refresh the page while we process your secure transaction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
