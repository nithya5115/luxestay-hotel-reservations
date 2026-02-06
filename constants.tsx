
import { Room, RoomCategory } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Classic Standard Room',
    category: RoomCategory.STANDARD,
    pricePerNight: 120,
    description: 'A cozy room perfect for solo travelers or couples, featuring a comfortable queen-size bed and modern amenities.',
    imageUrl: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=800',
    amenities: ['Free Wi-Fi', 'TV', 'Air Conditioning', 'Coffee Maker']
  },
  {
    id: '2',
    name: 'Standard Twin Room',
    category: RoomCategory.STANDARD,
    pricePerNight: 140,
    description: 'Spacious room with two twin beds, ideal for friends or business colleagues.',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    amenities: ['Free Wi-Fi', 'Work Desk', 'Mini Fridge', 'TV']
  },
  {
    id: '3',
    name: 'Deluxe Ocean View',
    category: RoomCategory.DELUXE,
    pricePerNight: 250,
    description: 'Experience luxury with a stunning view of the ocean. Includes a king-size bed and a private balcony.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    amenities: ['Ocean View', 'Private Balcony', 'Mini Bar', 'Bathrobe', 'Room Service']
  },
  {
    id: '4',
    name: 'Deluxe City Suite',
    category: RoomCategory.DELUXE,
    pricePerNight: 220,
    description: 'A refined room in the heart of the city with premium furnishings and a deep soaking tub.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    amenities: ['City View', 'Soaking Tub', 'Premium Bedding', 'Smart TV']
  },
  {
    id: '5',
    name: 'Presidential Royal Suite',
    category: RoomCategory.SUITE,
    pricePerNight: 550,
    description: 'Our most prestigious suite offering separate living and dining areas, a master bedroom, and unparalleled luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    amenities: ['24/7 Butler Service', 'Separate Living Room', 'Private Terrace', 'Jacuzzi', 'Breakfast Included']
  },
  {
    id: '6',
    name: 'Honeymoon Penthouse',
    category: RoomCategory.SUITE,
    pricePerNight: 480,
    description: 'Romantic and secluded penthouse with panoramic views, perfect for celebrating special occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800',
    amenities: ['Champagne on Arrival', 'King Bed', 'Rain Shower', 'Complimentary Spa Access']
  }
];
