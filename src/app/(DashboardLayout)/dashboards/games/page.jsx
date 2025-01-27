"use client"
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

const GameTile = ({ title, imageSrc, isJoinable = false }) => (
    <div className="relative group">
 <Link href={"/dashboards/ecommerce"} > 
    <img src={imageSrc} alt={title} className="w-full h-full object-cover rounded-lg" />

 
  </Link> </div>

);

const GamesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([
    { title: "Counter-Strike 2", imageSrc: "https://assets.xboxservices.com/assets/36/b5/36b52fa8-e71b-4435-888a-cecb98d3876a.jpg?n=153142244433_GLP-Page-Hero-0_1083x1222_02.jpg" },
    { title: "FC 24", imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYK2uYkawelF8QFf8KniT7ZXFvzmxRAOWjWA&s" },
    { title: "NBA 24", imageSrc: "https://cdn.originalky.cz/images/0/3301b2b3abe5700c/2/playerunknown-s-battlegrounds-pubg-pc.jpg?hash=261024160" },
    { title: "Starfall", imageSrc: "https://howlongtobeat.com/games/5203_League_of_Legends.jpg" },
    { title: "Starfall", imageSrc: "https://upload.wikimedia.org/wikipedia/en/f/f2/CS2_Cover_Art.jpg" },

  ]);
 
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search games"
            className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
      </div>
      <div className="grid grid-cols-2 p-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredGames.map((game, index) => (
          <GameTile key={index} {...game} />
        ))}
      </div>
    </div>
  );
};

export default GamesPage;