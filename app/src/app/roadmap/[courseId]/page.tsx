"use client";
import { useEffect, useMemo, useState } from 'react';
import { TopicCard } from '@/components/TopicCard';
import { VideoCard } from '@/components/VideoCard';
import { generateRoadmap, searchVideos } from '@/lib/api';

type Topic = { title: string; description?: string; estimatedHours?: number };
type Level = { level: string; topics: Topic[] };

export default function RoadmapPage({ params }: { params: { courseId: string } }) {
  const courseName = useMemo(() => params.courseId.replace(/-/g, ' '), [params.courseId]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [videoMap, setVideoMap] = useState<Record<string, { title: string; channel: string; href: string; thumbnail?: string; videoId?: string }[]>>({});
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  // Calculate total topics
  const totalTopics = useMemo(() => {
    return levels.reduce((sum, level) => sum + (level.topics?.length || 0), 0);
  }, [levels]);

  const progress = totalTopics > 0 ? Math.round((completedTopics.size / totalTopics) * 100) : 0;

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        const res = await generateRoadmap(courseName);
        const roadmap = res?.roadmap || res;
        const lvls: Level[] = roadmap.levels || [];
        if (!cancelled) setLevels(lvls);
        
        const entries: [string, { title: string; channel: string; href: string; thumbnail?: string; videoId?: string }[] ][] = [];
        for (const lvl of lvls) {
          await Promise.all(
            (lvl.topics || []).map(async (t) => {
              try {
                const v = await searchVideos(t.title);
                console.log(`[Roadmap] Videos for "${t.title}":`, v?.videos);
                const vids = (v?.videos || []).slice(0, 3).map((x: any) => ({ 
                  title: x.title, 
                  channel: x.channel, 
                  href: x.href,
                  thumbnail: x.thumbnail,
                  videoId: x.videoId || x.id  // Include videoId for embed support
                }));
                entries.push([t.title, vids]);
              } catch (err) {
                console.error(`[Roadmap] Failed to fetch videos for "${t.title}":`, err);
                entries.push([t.title, []]);
              }
            })
          );
        }
        if (!cancelled) setVideoMap(Object.fromEntries(entries));
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || 'Failed to load roadmap');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [courseName]);

  const toggleTopicCompletion = (topicTitle: string) => {
    setCompletedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicTitle)) {
        newSet.delete(topicTitle);
      } else {
        newSet.add(topicTitle);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 animate-slide-up">
          <div className="w-16 h-16 mx-auto bg-gradient-brand rounded-full animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Generating Your Roadmap...</h2>
          <p className="text-gray-600 dark:text-gray-400">AI is creating a personalized learning path for you</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass rounded-2xl p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Error Loading Roadmap</h2>
          <p className="text-gray-600 dark:text-gray-400">{err}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-gradient-brand text-white rounded-lg font-medium hover:shadow-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Course Header */}
      <div className="glass rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient capitalize">{courseName}</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete learning roadmap with curated resources</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-blue">{levels.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Levels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-orange">{totalTopics}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Topics</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Your Progress</span>
            <span className="text-brand-blue font-bold">{progress}% Complete</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-brand transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {completedTopics.size} of {totalTopics} topics completed
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button className="flex-1 md:flex-none px-6 py-3 bg-gradient-brand text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
            Start Learning
          </button>
          <button className="px-6 py-3 glass rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
            Save Roadmap
          </button>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="space-y-6">
        {levels.map((lvl, levelIndex) => {
          const levelTopics = lvl.topics || [];
          const completedInLevel = levelTopics.filter(t => completedTopics.has(t.title)).length;
          const levelProgress = levelTopics.length > 0 ? Math.round((completedInLevel / levelTopics.length) * 100) : 0;
          
          return (
            <section key={lvl.level} className="space-y-4">
              {/* Level Header */}
              <div className="glass rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {levelIndex + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{lvl.level}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{levelTopics.length} topics to master</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand-blue">{levelProgress}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Progress</div>
                  </div>
                </div>
                
                {/* Level Progress Bar */}
                <div className="h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-orange transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>

              {/* Topics in this level */}
              <div className="space-y-6">
                {levelTopics.map((topic, topicIndex) => {
                  const isCompleted = completedTopics.has(topic.title);
                  const topicVideos = videoMap[topic.title] || [];
                  const globalIndex = levels.slice(0, levelIndex).reduce((sum, l) => sum + (l.topics?.length || 0), 0) + topicIndex;
                  
                  return (
                    <div key={topic.title} className="relative pl-8 md:pl-12">
                      {/* Vertical Line */}
                      {topicIndex < levelTopics.length - 1 && (
                        <div className="absolute left-6 md:left-9 top-12 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue to-brand-orange opacity-30"></div>
                      )}
                      
                      {/* Step Number */}
                      <div className={`absolute left-0 md:left-3 top-6 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                        isCompleted ? 'bg-green-500' : 'bg-gradient-brand'
                      }`}>
                        {isCompleted ? '✓' : globalIndex + 1}
                      </div>

                      <div className="space-y-4">
                        {/* Topic Card */}
                        <div className={`glass rounded-2xl p-6 space-y-4 ${isCompleted ? 'border-2 border-green-500' : ''}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className={`text-xl font-bold mb-2 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                {topic.title}
                              </h3>
                              {topic.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{topic.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {topic.estimatedHours || 4}h estimated
                                </span>
                                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                  </svg>
                                  {topicVideos.length} videos
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => toggleTopicCompletion(topic.title)}
                              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:scale-105 ${
                                isCompleted 
                                  ? 'bg-green-500 text-white hover:bg-green-600' 
                                  : 'bg-gradient-brand text-white hover:shadow-xl'
                              }`}
                            >
                              {isCompleted ? '✓ Completed' : 'Mark Complete'}
                            </button>
                          </div>
                        </div>

                        {/* Video Resources */}
                        {topicVideos.length > 0 && (
                          <div className="pl-6 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                              Recommended Videos
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {topicVideos.map((video, idx) => (
                                <VideoCard 
                                  key={video.href || `video-${idx}`} 
                                  title={video.title} 
                                  channel={video.channel} 
                                  href={video.href}
                                  thumbnail={video.thumbnail}
                                  videoId={video.videoId}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Completion Badge */}
      {progress === 100 && (
        <div className="glass rounded-2xl p-8 text-center space-y-4 animate-slide-up">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl shadow-2xl animate-bounce">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-gradient">Congratulations!</h2>
          <p className="text-gray-600 dark:text-gray-400">You've completed the entire {courseName} roadmap!</p>
          <button className="px-8 py-3 bg-gradient-brand text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
            Get Certificate
          </button>
        </div>
      )}
    </div>
  );
}
