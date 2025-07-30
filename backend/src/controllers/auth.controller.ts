import { Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { insertUserSchema } from '@/models/user.model';
import { AppError, asyncHandler } from '@/middleware/error.middleware';
import { AuthRequest } from '@/middleware/auth.middleware';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validatedData = insertUserSchema.parse(req.body);
  
  // Check if user already exists
  const existingUser = await AuthService.findUserByEmail(validatedData.email);
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  const user = await AuthService.createUser(validatedData);
  const token = AuthService.generateToken(user);

  // Remove password from response
  const { password, ...userWithoutPassword } = user;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: userWithoutPassword,
      token,
    },
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const result = await AuthService.loginUser(email, password);
  if (!result) {
    throw new AppError('Invalid credentials', 401);
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await AuthService.findUserById(req.user!.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: { user: userWithoutPassword },
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  // In a production app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});