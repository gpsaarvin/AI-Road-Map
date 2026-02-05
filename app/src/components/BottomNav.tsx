"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/chat', label: 'AI Chat', icon: '🤖' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function BottomNav() {
  const pathname = usePathname();
  
  return (
    <nav className="grid grid-cols-4 gap-1 p-2 glass">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex flex-col items-center py-2 rounded-xl transition-all ${
              isActive 
                ? 'bg-gradient-brand text-white shadow-lg scale-105' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
