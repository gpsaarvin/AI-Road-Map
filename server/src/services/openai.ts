import OpenAI from 'openai';
import { config } from '../config';

const client = new OpenAI({ 
  apiKey: config.openaiKey,
  baseURL: 'https://openrouter.ai/api/v1'
});

export async function generateRoadmap(courseName: string) {
  const prompt = `You are an expert course planner. Create a structured learning roadmap for ${courseName} with Beginner, Intermediate, Advanced levels. For each level, list 4-6 topics with a short description and estimated hours. Return ONLY valid JSON with shape: { levels: [{ level: string, topics: [{ title: string, description: string, estimatedHours: number }] }], totalHours: number }`;

  const res = await client.chat.completions.create({
    model: 'liquid/lfm-2.5-1.2b-thinking:free',
    messages: [
      { role: 'system', content: 'You return only JSON. No prose.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2
  });

  const content = res.choices[0]?.message?.content || '{}';
  const data = JSON.parse(content);
  return data;
}

export async function chatWithAI(message: string) {
  try {
    const hasValidKey = config.openaiKey && !config.openaiKey.includes('your_openai_key') && config.openaiKey.length > 20;
    
    if (!hasValidKey) {
      // Demo response when no API key
      return `I'm a demo AI assistant. Here's some advice about "${message}": Start by learning the fundamentals, practice regularly, and build projects to solidify your knowledge. Feel free to explore our courses for structured learning paths!`;
    }

    console.log('Sending chat request to OpenRouter...');
    const res = await client.chat.completions.create({
      model: 'liquid/lfm-2.5-1.2b-thinking:free',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful AI learning assistant. Provide concise, practical advice about courses, learning strategies, programming, and career development. Keep responses under 200 words.' 
        },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const response = res.choices[0]?.message?.content;
    if (!response) {
      console.log('No content in AI response');
      return `I'd be happy to help! Regarding "${message}": Start with fundamentals, practice consistently, build projects, and join learning communities. Check out our courses for structured learning paths!`;
    }
    
    console.log('AI response received:', response.substring(0, 50));
    return response;
  } catch (error: any) {
    console.error('Chat AI Error:', error.message);
    // Return helpful fallback response
    return `I'm here to help you learn! About "${message}": Focus on understanding core concepts first, practice with real projects, and don't hesitate to explore our structured courses. What specific aspect would you like to know more about?`;
  }
}
