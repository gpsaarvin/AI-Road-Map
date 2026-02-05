import admin from 'firebase-admin';
import { config } from '../config';
import { Request, Response, NextFunction } from 'express';

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      })
    });
  }
} catch (e) {
  console.warn('Firebase Admin init failed. Check credentials.');
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).user = { uid: decoded.uid };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
