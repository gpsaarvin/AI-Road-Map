import { Router } from 'express';
import { z } from 'zod';
import { Progress } from '../models/Progress';
import { Course } from '../models/Course';

const router = Router();

router.get('/', async (req, res) => {
  const courseId = (req.query.courseId as string) || '';
  const userId = (req as any).user?.uid;
  if (!userId || !courseId) return res.status(400).json({ error: 'Missing params' });

  const course = await Course.findOne({ slug: courseId });
  if (!course) return res.json({ completedTopics: [] });

  const prog = await Progress.findOne({ user: userId, course: course._id });
  return res.json({ completedTopics: prog?.completedTopics || [] });
});

router.post('/', async (req, res) => {
  const schema = z.object({ courseId: z.string(), topicId: z.string(), completed: z.boolean() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { courseId, topicId, completed } = parsed.data;
  const userId = (req as any).user?.uid;
  const course = await Course.findOne({ slug: courseId });
  if (!course) return res.status(404).json({ error: 'Course not found' });

  let prog = await Progress.findOne({ user: userId, course: course._id });
  if (!prog) prog = await Progress.create({ user: userId, course: course._id, completedTopics: [] });

  const set = new Set(prog.completedTopics);
  if (completed) set.add(topicId); else set.delete(topicId);
  prog.completedTopics = Array.from(set);
  await prog.save();
  return res.json({ completedTopics: prog.completedTopics });
});

export default router;
