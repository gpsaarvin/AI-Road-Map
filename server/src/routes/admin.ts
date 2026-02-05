import { Router } from 'express';
import { Roadmap } from '../models/Roadmap';

const router = Router();

router.get('/roadmaps', async (_req, res) => {
  const items = await Roadmap.find().limit(50).sort({ createdAt: -1 });
  res.json({ items });
});

router.post('/roadmaps/:id/approve', async (req, res) => {
  const { id } = req.params;
  const r = await Roadmap.findByIdAndUpdate(id, { approved: true }, { new: true });
  res.json({ roadmap: r });
});

export default router;
