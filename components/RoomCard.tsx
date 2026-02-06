
import React from 'react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
          {room.category}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800">{room.name}</h3>
          <p className="text-xl font-bold text-indigo-600">${room.pricePerNight}<span className="text-xs text-slate-400 font-normal">/night</span></p>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.slice(0, 3).map(amenity => (
            <span key={amenity} className="bg-slate-50 text-slate-500 text-[10px] px-2 py-1 rounded-md border border-slate-100">
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-slate-400 text-[10px] px-2 py-1">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        <button 
          onClick={() => onBook(room)}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
