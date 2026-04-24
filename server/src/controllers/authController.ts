import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const SALT_ROUNDS = 12;

const signToken = (userId: string): string =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, preferredUnit } = req.body;

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    res.status(400).json({ message: 'Name, email, and password are required' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters' });
    return;
  }

  const normalizedEmail = normalizeEmail(email);

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, preferredUnit });

  res.status(201).json({
    token: signToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, preferredUnit: user.preferredUnit },
  });
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email: normalizeEmail(email) });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.json({
    token: signToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, preferredUnit: user.preferredUnit },
  });
};

// GET /api/auth/me  (protected)
export const getMe = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  const user = await User.findById(req.userId).select('-passwordHash');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
};
