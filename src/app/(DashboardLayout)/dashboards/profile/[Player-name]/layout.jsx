import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base background */}
      {children}
    </div>
  );
};

export default Layout;