import Link from 'next/link';

export function CourseCard({ 
  title, 
  description, 
  href, 
  icon = '📚', 
  color = 'from-brand-blue to-brand-orange' 
}: { 
  title: string; 
  description: string; 
  href: string;
  icon?: string;
  color?: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-full glass rounded-2xl p-6 card-hover overflow-hidden">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        {/* Icon */}
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        
        {/* Content */}
        <h3 className="font-bold text-xl mb-2 group-hover:text-brand-blue transition">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        
        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-brand-blue font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Start Learning 
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
