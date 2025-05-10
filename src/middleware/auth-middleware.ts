// src/middleware/auth-middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from "../types";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKENの形式から取得

  if (token == null) {
    res.status(401).json({ error: '認証トークンがありません' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback_secret", (err, user) => {
    if (err) {
      res.status(403).json({ error: 'トークンが無効です' });
      return;
    }

    req.user = user as UserPayload;
    next();
  });
};
