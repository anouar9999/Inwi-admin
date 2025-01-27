import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { Home, BarChart2, Users, Settings, HelpCircle } from 'lucide-react';

const menuItems = [
  { id: 1, icon: Home, name: 'Home', href: '/' },
  { id: 2, icon: BarChart2, name: 'Analytics', href: '/dashboards/ecommerce' },
  { id: 3, icon: Users, name: 'Team', href: '/dashboards/tournament/5' },
  { id: 4, icon: Settings, name: 'Settings', href: '/dashboards/match/7' },
  { id: 5, icon: HelpCircle, name: 'Help', href: '/dashboards/profile/player' },
];

const SidebarItems = () => {
  const pathname = usePathname();

  return (
    <nav className=" py-10">
      <div className="flex flex-col space-y-5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link 
              href={item.href} 
              key={item.id}
              className="flex flex-col items-center"
            >
              <button 
                className={`p-2 rounded-lg transition-colors duration-200 w-full ${
                  isActive ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto" />
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarItems;