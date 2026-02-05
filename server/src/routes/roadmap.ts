import { Router } from 'express';
import { z } from 'zod';
import { generateRoadmap } from '../services/openai';
import { Course } from '../models/Course';
import { Roadmap } from '../models/Roadmap';
import { config } from '../config';
import mongoose from 'mongoose';

const router = Router();

router.post('/generate', async (req, res) => {
  const schema = z.object({ courseName: z.string().min(2) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { courseName } = parsed.data;
  try {
    let data: any;
    const hasValidKey = config.openaiKey && !config.openaiKey.includes('your_openai_key') && config.openaiKey.length > 20;
    if (!hasValidKey) {
      // Demo fallback
      console.log(`Using demo roadmap for "${courseName}" (no valid OpenAI key)`);
      data = {
        levels: [
          { level: 'Beginner', topics: [
            { title: `${courseName} Basics`, description: 'Core concepts and terminology', estimatedHours: 8 },
            { title: 'Fundamentals', description: 'Hands-on intro', estimatedHours: 10 }
          ]},
          { level: 'Intermediate', topics: [
            { title: 'Projects', description: 'Build real features', estimatedHours: 12 },
            { title: 'Best Practices', description: 'Write better code', estimatedHours: 8 }
          ]},
          { level: 'Advanced', topics: [
            { title: 'Performance', description: 'Optimize and scale', estimatedHours: 6 },
            { title: 'Testing', description: 'Quality and CI', estimatedHours: 6 }
          ]}
        ],
        totalHours: 50
      };
    } else {
      data = await generateRoadmap(courseName);
    }

    const slug = courseName.toLowerCase().replace(/\s+/g, '-');
    const dbReady = mongoose.connection.readyState === 1;
    if (dbReady) {
      let course = await Course.findOne({ slug });
      if (!course) course = await Course.create({ name: courseName, slug });
      const roadmap = await Roadmap.create({ course: course._id, levels: data.levels, totalHours: data.totalHours });
      return res.json({ course, roadmap });
    } else {
      // Return without persistence
      return res.json({ course: { name: courseName, slug }, roadmap: { levels: data.levels, totalHours: data.totalHours } });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

export default router;
