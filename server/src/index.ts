import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import authRoutes from './routes/authRoutes';
import workoutRoutes from './routes/workoutRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const app = express();
const PORT = process.env.PORT || 5000;

// When deployed behind a reverse proxy / load balancer, trust the first hop
// so rate limiting sees the real client IP via X-Forwarded-For.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'ApexLift API running' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
