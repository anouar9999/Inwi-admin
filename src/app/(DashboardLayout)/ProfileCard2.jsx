import React from 'react';
import { Star, GameController, ChevronRight } from 'lucide-react';

const ProfileCard2 = ({ name, rating, game, avatar }) => (
  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-sm">
    <div className="relative">
      {/* <img className="w-full h-48 object-cover filter brightness-75" src={avatar} alt="John Doe" /> */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <h3 className="text-white font-bold text-xl mb-1 truncate">John Doe</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-yellow-500 text-gray-900 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1" />
            4.5
          </span>
          <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
            <GameController className="w-3 h-3 mr-1" />
            Chess
          </span>
        </div>
      </div>
    </div>
    <div className="p-4">
      <p className="text-gray-300 text-sm mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center justify-center">
        Challenge
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  </div>
);

export default ProfileCard2;