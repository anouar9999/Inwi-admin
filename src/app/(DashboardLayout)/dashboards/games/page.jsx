"use client"
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

const GameTile = ({ title, imageSrc, isJoinable = false }) => (
  <div className="relative group">
    <Link href={"/dashboards/ecommerce"}>
      <div className="w-full h-full">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-semibold">{title}</span>
        </div>
      </div>
    </Link>
  </div>
);

const GamesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const games = [
    { id: 1, title: 'Game 1', imageSrc: '/path/to/image1.jpg' },
    { id: 2, title: 'Game 2', imageSrc: '/path/to/image2.jpg' },
    // Add more games as needed
  ];

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map(game => (
          <GameTile
            key={game.id}
            title={game.title}
            imageSrc={game.imageSrc}
          />
        ))}
      </div>
    </div>
  );
};

export default GamesPage;