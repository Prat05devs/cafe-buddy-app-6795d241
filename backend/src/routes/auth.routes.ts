import { Router } from 'express';
import { register, login, getProfile, logout } from '@/controllers/auth.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { validateBody } from '@/middleware/validation.middleware';
import { insertUserSchema } from '@/models/user.model';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Public routes
router.post('/register', validateBody(insertUserSchema), register);
router.post('/login', validateBody(loginSchema), login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.post('/logout', authMiddleware, logout);

export default router;