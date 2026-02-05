"use client";
import { useState } from 'react';

export function Chatbot() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');

  async function ask() {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    // TODO: Call backend chat endpoint
    const reply = { role: 'assistant' as const, content: 'This is a placeholder response.' };
    setMessages((m) => [...m, reply]);
  }

  return (
    <div className="rounded-lg border dark:border-neutral-800 p-4 space-y-3">
      <h3 className="font-semibold">AI Tutor</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`${m.role === 'user' ? 'text-brand' : ''}`}>{m.role}: {m.content}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-md border dark:border-neutral-800 px-3 py-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a doubt..." />
        <button className="px-3 py-2 rounded-md bg-brand text-white" onClick={ask}>Ask</button>
      </div>
    </div>
  );
}
