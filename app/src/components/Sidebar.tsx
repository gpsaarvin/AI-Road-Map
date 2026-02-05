"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/chat', label: 'AI Chat', icon: '🤖' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="p-4 space-y-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive 
                ? 'bg-gradient-brand text-white shadow-lg' 
                : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
