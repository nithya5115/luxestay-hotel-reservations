
export enum RoomCategory {
  STANDARD = 'Standard',
  DELUXE = 'Deluxe',
  SUITE = 'Suite'
}

export enum BookingStatus {
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled'
}

export interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  pricePerNight: number;
  description: string;
  imageUrl: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface SearchFilters {
  category: RoomCategory | 'All';
  maxPrice: number;
}
