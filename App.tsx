
import React, { useState, useMemo } from 'react';
import { Room, RoomCategory, Booking, BookingStatus } from './types';
import { INITIAL_ROOMS } from './constants';
import { StorageService } from './services/storageService';
import RoomCard from './components/RoomCard';
import BookingModal from './components/BookingModal';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [view, setView] = useState<'rooms' | 'bookings'>('rooms');
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | 'All'>('All');
  const [priceRange, setPriceRange] = useState(600);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Sync bookings
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());

  const filteredRooms = useMemo(() => {
    return INITIAL_ROOMS.filter(room => {
      const categoryMatch = selectedCategory === 'All' || room.category === selectedCategory;
      const priceMatch = room.pricePerNight <= priceRange;
      return categoryMatch && priceMatch;
    });
  }, [selectedCategory, priceRange]);

  const handleBookingSuccess = () => {
    setBookingRoom(null);
    setBookings(StorageService.getBookings());
    showNotification('Booking confirmed successfully!', 'success');
    setView('bookings');
  };

  const handleCancelBooking = (id: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      StorageService.cancelBooking(id);
      setBookings(StorageService.getBookings());
      showNotification('Reservation cancelled.', 'info');
    }
  };

  const showNotification = (message: string, type: 'success' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar currentView={view} onViewChange={setView} />

      {/* Notifications */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {view === 'rooms' ? (
          <div>
            <div className="mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Find your perfect stay.</h1>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">Experience unmatched luxury and comfort in our meticulously curated selection of rooms and suites.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-auto flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {['All', RoomCategory.STANDARD, RoomCategory.DELUXE, RoomCategory.SUITE].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-64">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Max Price: <span className="text-indigo-600">${priceRange}</span></label>
                <input 
                  type="range" 
                  min="100" 
                  max="1000" 
                  step="50"
                  value={priceRange}
                  onChange={e => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map(room => (
                <RoomCard key={room.id} room={room} onBook={setBookingRoom} />
              ))}
              {filteredRooms.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">No rooms found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Your Reservations</h1>
              <p className="text-slate-500">Manage your current and upcoming stays.</p>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                 <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No bookings yet</h3>
                <p className="text-slate-500 mb-8">You haven't made any reservations. Explore our luxury rooms to get started.</p>
                <button 
                  onClick={() => setView('rooms')}
                  className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Explore Rooms
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(booking => (
                  <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto bg-slate-100 flex-shrink-0">
                      <img 
                        src={INITIAL_ROOMS.find(r => r.id === booking.roomId)?.imageUrl || 'https://picsum.photos/400/300'} 
                        alt={booking.roomName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase mb-2 ${booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {booking.status}
                            </span>
                            <h3 className="text-2xl font-bold text-slate-800">{booking.roomName}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-bold uppercase">Booking ID</p>
                            <p className="font-mono text-sm text-slate-600">#{booking.id}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Check-in</p>
                            <p className="font-semibold text-slate-700">{booking.checkIn}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Check-out</p>
                            <p className="font-semibold text-slate-700">{booking.checkOut}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Guest</p>
                            <p className="font-semibold text-slate-700">{booking.guestName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Paid</p>
                            <p className="font-semibold text-indigo-600">${booking.totalPrice}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                        {booking.status === BookingStatus.CONFIRMED && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                          >
                            Cancel Reservation
                          </button>
                        )}
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {bookingRoom && (
        <BookingModal 
          room={bookingRoom} 
          onClose={() => setBookingRoom(null)} 
          onSuccess={handleBookingSuccess} 
        />
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 LuxeStay Hotel Reservation System. Developed for Task 4.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
