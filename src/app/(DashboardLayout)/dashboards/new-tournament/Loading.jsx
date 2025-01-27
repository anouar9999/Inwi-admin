import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({text}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-primary/50 to-primary/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Loader2 className="w-28 h-28 text-white animate-spin" />
      <p className="mt-4 text-5xl font-custom text-white">{text}...</p>
    </div>
  );
};

export default LoadingOverlay;