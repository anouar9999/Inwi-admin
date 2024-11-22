import { useEffect, useState } from "react";

export const NeonSharpEdgedProgressBar = ({ startDate, endDate }) => {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const calculateProgress = () => {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();

      if (now < start) return 0;
      if (now > end) return 100;

      const total = end - start;
      const elapsed = now - start;
      return Math.round((elapsed / total) * 100);
    };

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(startDate).getTime() > now 
        ? new Date(startDate).getTime() 
        : new Date(endDate).getTime();
      
      const diff = target - now;
      if (diff <= 0) return "";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h remaining`;
      if (hours > 0) return `${hours}h ${minutes}m remaining`;
      return `${minutes}m remaining`;
    };

    const updateProgress = () => {
      setProgress(calculateProgress());
      setTimeRemaining(calculateTimeRemaining());
    };

    updateProgress();
    const timer = setInterval(updateProgress, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-white/80">
        <span>{progress}% Complete</span>
        <span>{timeRemaining}</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};