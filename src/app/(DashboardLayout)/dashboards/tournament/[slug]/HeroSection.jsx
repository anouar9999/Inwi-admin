import { NeonSharpEdgedProgressBar } from "./NeonSharpEdgedProgressBar";
import { Clock, Share2, Users } from "lucide-react";

export const HeroSection = ({ title, backgroundSrc, startDate, endDate }) => {
  const shareTournament = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this tournament: ${title}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
      <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${backgroundSrc}`}
        alt="Tournament background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="w-full">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <button 
            onClick={shareTournament}
              className="bg-gray-800/50 hover:bg-gray-700/50 p-2 rounded-full"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date(startDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Spots Available</span>
            </div>
          </div>
          
          <NeonSharpEdgedProgressBar startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </div>
  );
};