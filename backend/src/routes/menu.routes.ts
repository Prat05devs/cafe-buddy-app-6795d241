import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
} from '@/controllers/menu.controller';
import { authMiddleware, requireRole } from '@/middleware/auth.middleware';
import { validateBody, validateParams } from '@/middleware/validation.middleware';
import { 
  insertCategorySchema, 
  insertMenuItemSchema,
  updateCategorySchema,
  updateMenuItemSchema
} from '@/models';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

// All routes require authentication
router.use(authMiddleware);

// Category routes
router.get('/categories', getCategories);
router.get('/categories/:id', validateParams(idParamSchema), getCategoryById);
router.post('/categories', requireRole(['admin', 'manager']), validateBody(insertCategorySchema), createCategory);
router.put('/categories/:id', requireRole(['admin', 'manager']), validateParams(idParamSchema), validateBody(updateCategorySchema), updateCategory);
router.delete('/categories/:id', requireRole(['admin', 'manager']), validateParams(idParamSchema), deleteCategory);

// Menu item routes
router.get('/items', getMenuItems);
router.get('/items/:id', validateParams(idParamSchema), getMenuItemById);
router.post('/items', requireRole(['admin', 'manager']), validateBody(insertMenuItemSchema), createMenuItem);
router.put('/items/:id', requireRole(['admin', 'manager']), validateParams(idParamSchema), validateBody(updateMenuItemSchema), updateMenuItem);
router.patch('/items/:id/toggle', requireRole(['admin', 'manager']), validateParams(idParamSchema), toggleMenuItemAvailability);
router.delete('/items/:id', requireRole(['admin', 'manager']), validateParams(idParamSchema), deleteMenuItem);

export default router;