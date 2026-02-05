import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { NavBar } from '@/components/NavBar';

export const metadata = {
  title: 'AI Course Roadmap - Smart Learning Paths',
  description: 'Generate AI-powered learning roadmaps with curated YouTube references and personalized guidance.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/30 dark:from-neutral-950 dark:via-blue-950/20 dark:to-orange-950/20 text-gray-900 dark:text-gray-100 transition-colors">
              <NavBar />
              <div className="flex">
                <aside className="hidden lg:block w-72 border-r border-gray-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                  <div className="sticky top-20">
                    <Sidebar />
                  </div>
                </aside>
                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
              </div>
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 shadow-2xl">
                <BottomNav />
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
