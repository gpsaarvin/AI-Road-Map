"use client";
import { useState, useRef, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI learning assistant. Ask me anything about courses, programming, career advice, or learning strategies!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What's the best way to learn programming?",
    "Recommend a course for beginners",
    "How long does it take to learn web development?",
    "What skills are in demand?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <NavBar />
      
      <div className="flex">
        <aside className="hidden lg:block w-64 min-h-screen border-r border-gray-200 dark:border-neutral-800">
          <Sidebar />
        </aside>

        <main className="flex-1 pb-20 lg:pb-8">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-2xl animate-float">
                  🤖
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gradient">AI Learning Assistant</h1>
                  <p className="text-gray-600 dark:text-gray-400">Get personalized advice and course recommendations</p>
                </div>
              </div>
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="mb-6 glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">💡 Quick Questions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(question)}
                      className="p-3 text-left rounded-xl border border-gray-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="glass rounded-2xl p-4 lg:p-6 mb-6 h-[calc(100vh-400px)] lg:h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-orange-400 to-orange-600' 
                        : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                      {message.role === 'user' ? '👤' : '🤖'}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-brand text-white'
                          : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      🤖
                    </div>
                    <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-2xl">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about learning..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-gradient-brand text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '...' : 'Send'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Ask about courses, learning paths, career advice, or programming concepts
              </p>
            </form>
          </div>
        </main>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
