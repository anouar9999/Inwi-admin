import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TournamentCard = ({ 
  id, 
  name, 
  startDate, 
  endDate, 
  status, 
  maxParticipants, 
  prizePool, 
  tournamentType,
  spots_remaining, 
  registered_count,
  image,
  slug
}) => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const now = new Date();
  const hoursUntilStart = Math.floor((startDateObj - now) / (1000 * 60 * 60));

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <Link href={`/${slug}`}>
      <div className="w-full max-w-sm  overflow-hidden angular-cut shadow-lg ">
        <div className="relative h-48">
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image}` }
            alt={name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-1/2"></div>
        </div>
        <div className="p-4">
          <h2 className="text-white text-lg font-semibold mb-2">{name}</h2>
          <div className="flex items-center mb-3">
            <span className={`text-xs text-gray-900 px-2 py-1  angular-cut font-medium ${
              status === 'Ouvert aux inscriptions' ? 'bg-yellow-500' : status === 'En cours' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {status}
            </span>
          </div>

          <div className="flex justify-start text-white text-sm mb-4">
            <div className="px-2 first:pl-0">
              <p className="font-semibold">{formatDate(startDateObj)}</p>
              <p className="text-xs text-gray-400">Start Date</p>
            </div>
            <div className="px-2">
              <p className="font-semibold">{formatDate(endDateObj)}</p>
              <p className="text-xs text-gray-400">End Date</p>
            </div>
            <div className="px-2">
              <p className="font-semibold">{maxParticipants}</p>
              <p className="text-xs text-gray-400">Max Participants</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-white">{prizePool}DH</p>
              <p className="text-xs text-gray-400">Prize Pool</p>
            </div>
            <div>
              
            </div>
            <span className='flex items-center  space-x-2 text-sm font-semibold  text-white    transition duration-300 '>{registered_count}/{maxParticipants} <span className='font-xs font-inter  mx-2'> {tournamentType} Registred</span></span>

         
          </div>  
        </div>
      </div>
    </Link>
  );
};

export default TournamentCard;
