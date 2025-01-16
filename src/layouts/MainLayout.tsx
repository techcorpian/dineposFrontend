// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../shared/Menu';
import RightPanel from '../shared/RightPanel';

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen">
      <div className="flex w-full h-full">
        {/* Sidebar Menu */}
        <div className="w-60 h-full lg:flex hidden">
          <Menu />
        </div>

        {/* Main Content */}
        <div className="w-full overflow-y-auto scrollbar-hide bg-gray-50">
          <Outlet />
        </div>

        {/* Right Panel */}
        <div className="w-1/2 h-full sm:flex hidden bg-gray-50">
          <RightPanel />
        </div>
      </div>
      {/* Mobile Footer */}
      <div className="absolute bottom-0 border w-full bg-black text-white lg:hidden">
        Mobile Footer Content
      </div>
    </div>
  );
};

export default MainLayout;
