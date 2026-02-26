
import React from 'react';
import { NavLink } from 'react-router-dom';
import { CreditCard, Home, Bed, LayoutGrid, Info, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const navItems = [
    { title: 'Home', path: '/', icon: Home },
    { title: 'Rooms', path: '/rooms', icon: Bed },
    { title: 'Services', path: '/services', icon: LayoutGrid },
    { title: 'About', path: '/about', icon: Info },
    { title: 'Contact', path: '/contact', icon: Phone },
    { title: 'Checkout', path: '/checkout', icon: CreditCard },
  ];

  return (
    <div className="w-64 h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 space-y-2">
      <div className="px-3 py-4 mb-4">
        <h2 className="text-xl font-serif font-bold text-[#8fa492]">Luxury Stay</h2>
      </div>
      
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-[#8fa492]/10 text-[#8fa492]" 
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
            )
          }
        >
          <item.icon className="w-4 h-4" />
          {item.title}
        </NavLink>
      ))}
    </div>
  );
}
