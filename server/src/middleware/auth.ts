import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid' });
  }
};

// Validates that the named route params are well-formed Mongo ObjectIds
// so callers receive a clean 400 rather than a 500 on malformed input.
export const validateObjectIdParams =
  (...params: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    for (const p of params) {
      const value = req.params[p];
      if (typeof value !== 'string' || !Types.ObjectId.isValid(value)) {
        res.status(400).json({ message: `Invalid ${p}` });
        return;
      }
    }
    next();
  };
