import { Request, Response, NextFunction } from 'express';
import { logError } from '../lib/logger.js';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: 'ADMIN' | 'USER';
    };
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    logError('authMiddleware — jwt.verify', error)
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  const user = (req as AuthRequest).user;
  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acceso denegado: se requiere rol ADMIN' });
    return;
  }
  next();
}
