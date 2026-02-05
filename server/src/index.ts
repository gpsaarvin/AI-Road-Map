import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config';
import { authMiddleware } from './middleware/auth';
import roadmapRouter from './routes/roadmap';
import videosRouter from './routes/videos';
import progressRouter from './routes/progress';
import adminRouter from './routes/admin';
import chatRouter from './routes/chat';
import profileRouter from './routes/profile';
import authRouter from './routes/auth'; // Import auth router

async function start() {
  if (config.mongoUri) {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('MongoDB connected');
    } catch (err) {
      console.warn('MongoDB connection failed. Starting in demo mode (no DB).');
    }
  } else {
    console.warn('No MONGODB_URI provided. Starting in demo mode (no DB).');
  }

  const app = express();
  // Increase payload limit to support base64 encoded images (profile pictures)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(cors({ origin: config.corsOrigin, credentials: true }));

  // Public routes
  app.use('/api/auth', authRouter); // Authentication routes (register, login)
  app.use('/api/roadmap', roadmapRouter);
  app.use('/api/videos', videosRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api', profileRouter); // Add profile routes (public endpoint)

  // Protected routes
  app.use('/api/progress', authMiddleware, progressRouter);
  app.use('/api/admin', authMiddleware, adminRouter);

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
