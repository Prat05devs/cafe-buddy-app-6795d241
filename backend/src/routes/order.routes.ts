import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
} from '@/controllers/order.controller';
import { authMiddleware, requireRole } from '@/middleware/auth.middleware';
import { validateParams } from '@/middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

// All routes require authentication
router.use(authMiddleware);

router.get('/', getOrders);
router.get('/stats', requireRole(['admin', 'manager']), getOrderStats);
router.get('/:id', validateParams(idParamSchema), getOrderById);
router.post('/', createOrder);
router.patch('/:id/status', validateParams(idParamSchema), updateOrderStatus);
router.patch('/:id/payment', requireRole(['admin', 'manager']), validateParams(idParamSchema), updatePaymentStatus);
router.patch('/:id/cancel', validateParams(idParamSchema), cancelOrder);

export default router;