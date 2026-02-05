"use client";
import Link from 'next/link';
import { ProgressBar } from '@/components/ProgressBar';
import { Chatbot } from '@/components/Chatbot';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const recentCourses = [
  { name: 'Web Development', slug: 'web-development', progress: 65, totalTopics: 20, completedTopics: 13, lastAccessed: '2 hours ago' },
  { name: 'Python Programming', slug: 'python', progress: 45, totalTopics: 15, completedTopics: 7, lastAccessed: '1 day ago' },
  { name: 'Machine Learning', slug: 'machine-learning', progress: 20, totalTopics: 25, completedTopics: 5, lastAccessed: '3 days ago' },
];

const achievements = [
  { icon: '🏆', title: 'First Course', description: 'Completed your first roadmap' },
  { icon: '🔥', title: '7 Day Streak', description: 'Learned for 7 days straight' },
  { icon: '⭐', title: 'Quick Learner', description: 'Completed 5 topics in one day' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="space-y-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome Back, <span className="text-gradient">{user?.fullName?.split(' ')[0] || 'User'}! 👋</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track your learning progress and continue where you left off</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-6 text-center space-y-2 card-hover">
            <div className="text-3xl font-bold text-gradient">{recentCourses.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Courses</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center space-y-2 card-hover">
            <div className="text-3xl font-bold text-brand-orange">25</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Topics Completed</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center space-y-2 card-hover">
            <div className="text-3xl font-bold text-brand-blue">48h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Invested</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center space-y-2 card-hover">
            <div className="text-3xl font-bold text-green-500">7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak 🔥</div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Continue Learning</h2>
            <Link href="/" className="text-brand-blue hover:text-brand-orange transition text-sm font-medium">
              Browse All Courses →
            </Link>
          </div>

            <div className="space-y-4">
            {recentCourses.map((course) => (
              <Link key={course.slug} href={`/roadmap/${course.slug}`}>
                <div className="glass rounded-2xl p-6 card-hover space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{course.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.completedTopics} of {course.totalTopics} topics completed • Last accessed {course.lastAccessed}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-blue">{course.progress}%</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-2.5 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-brand rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full md:w-auto px-6 py-2.5 bg-gradient-brand text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Continue Learning →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Achievements 🏆</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="glass rounded-2xl p-6 text-center space-y-3 card-hover">
                <div className="text-4xl">{achievement.icon}</div>
                <h3 className="font-bold">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/" className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
              <span className="text-2xl">🔍</span>
              <span className="text-sm font-medium">Find Course</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
              <span className="text-2xl">⚙️</span>
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium">Analytics</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
              <span className="text-2xl">💾</span>
              <span className="text-sm font-medium">Saved</span>
            </button>
          </div>
        </div>
        <Chatbot />
      </div>
    </ProtectedRoute>
  );
}
