
import { Booking, BookingStatus, Room } from '../types';

const BOOKINGS_KEY = 'luxestay_bookings';

export class StorageService {
  static getBookings(): Booking[] {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveBooking(booking: Booking): void {
    const bookings = this.getBookings();
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }

  static cancelBooking(bookingId: string): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = BookingStatus.CANCELLED;
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  }

  static isRoomAvailable(roomId: string, checkIn: string, checkOut: string): boolean {
    const bookings = this.getBookings().filter(b => b.roomId === roomId && b.status === BookingStatus.CONFIRMED);
    
    const newIn = new Date(checkIn).getTime();
    const newOut = new Date(checkOut).getTime();

    for (const b of bookings) {
      const existingIn = new Date(b.checkIn).getTime();
      const existingOut = new Date(b.checkOut).getTime();

      // Overlap check
      if (newIn < existingOut && newOut > existingIn) {
        return false;
      }
    }
    return true;
  }
}
