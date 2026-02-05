import { Router } from 'express';
import { z } from 'zod';
import { chatWithAI } from '../services/openai';

const router = Router();

router.post('/', async (req, res) => {
  const schema = z.object({ message: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { message } = parsed.data;

  try {
    const response = await chatWithAI(message);
    res.json({ response });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

export default router;
