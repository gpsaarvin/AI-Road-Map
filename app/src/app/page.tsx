"use client";
import { CourseCard } from '@/components/CourseCard';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const popularCourses = [
  { title: 'Web Development', slug: 'web-development', description: 'HTML, CSS, JS, React', icon: '🌐', color: 'from-blue-500 to-cyan-400' },
  { title: 'Python Programming', slug: 'python', description: 'Syntax, OOP, Libraries', icon: '🐍', color: 'from-yellow-500 to-green-400' },
  { title: 'Data Structures & Algorithms', slug: 'dsa', description: 'Arrays, Trees, Graphs', icon: '🔢', color: 'from-purple-500 to-pink-400' },
  { title: 'Artificial Intelligence', slug: 'ai', description: 'ML, DL, NLP', icon: '🤖', color: 'from-[#2B7FD9] to-[#F59E0B]' },
  { title: 'Cloud Computing', slug: 'cloud', description: 'AWS, Azure, GCP', icon: '☁️', color: 'from-blue-400 to-indigo-500' },
  { title: 'Cybersecurity', slug: 'cybersecurity', description: 'Network Security, Ethical Hacking', icon: '🔒', color: 'from-red-500 to-orange-500' }
];

export default function LandingPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = (q || '').trim().toLowerCase().replace(/\s+/g, '-');
    if (slug) router.push(`/roadmap/${slug}`);
  }
  return (
    <div className="space-y-12 pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 text-center space-y-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 animate-slide-up">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-brand text-white rounded-full text-sm font-medium shadow-lg">
              🚀 Powered by Advanced AI
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Learn Faster with
            <br />
            <span className="text-gradient">AI-Powered Roadmaps</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get personalized learning paths, curated video recommendations, and track your progress with intelligent AI guidance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <form className="relative group" onSubmit={onSubmit}>
            <div className="absolute -inset-1 bg-gradient-brand rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
            <div className="relative flex gap-2 p-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                <input 
                  value={q} 
                  onChange={(e)=>setQ(e.target.value)} 
                  type="text" 
                  placeholder="Search any course (e.g., JavaScript, Machine Learning)" 
                  className="w-full pl-14 pr-4 py-4 rounded-xl bg-transparent border-none focus:outline-none text-lg"
                />
              </div>
              <button 
                className="px-8 py-4 rounded-xl bg-gradient-brand text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105" 
                type="submit"
              >
                Generate Roadmap →
              </button>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 pt-8 flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">1000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Courses Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">50K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Video Resources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">AI-Powered</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Learning Paths</div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore <span className="text-gradient">Popular Courses</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Start learning with our most popular learning paths</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {popularCourses.map((c, idx) => (
            <div key={c.slug} className="animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <CourseCard 
                title={c.title} 
                description={c.description} 
                href={`/roadmap/${c.slug}`}
                icon={c.icon}
                color={c.color}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose <span className="text-gradient">AI Roadmap</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass rounded-2xl p-8 text-center space-y-4 card-hover">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-blue to-blue-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              🎯
            </div>
            <h3 className="text-xl font-bold">Personalized Learning</h3>
            <p className="text-gray-600 dark:text-gray-400">AI-generated roadmaps tailored to your skill level and goals</p>
          </div>
          <div className="glass rounded-2xl p-8 text-center space-y-4 card-hover">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-orange to-yellow-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              📹
            </div>
            <h3 className="text-xl font-bold">Curated Videos</h3>
            <p className="text-gray-600 dark:text-gray-400">Best YouTube tutorials automatically matched to each topic</p>
          </div>
          <div className="glass rounded-2xl p-8 text-center space-y-4 card-hover">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              📊
            </div>
            <h3 className="text-xl font-bold">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-400">Monitor your learning journey with detailed analytics</p>
          </div>
        </div>
      </section>
    </div>
  );
}
