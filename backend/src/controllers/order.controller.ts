import { Response } from 'express';
import { OrderService } from '@/services/order.service';
import { insertOrderSchema, insertOrderItemSchema } from '@/models/order.model';
import { AppError, asyncHandler } from '@/middleware/error.middleware';
import { AuthRequest } from '@/middleware/auth.middleware';
import { z } from 'zod';

// Schema for order item creation (without orderId)
const createOrderItemSchema = insertOrderItemSchema.omit({ orderId: true });

const createOrderSchema = z.object({
  tableId: z.number().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),
  type: z.enum(['dine-in', 'takeaway', 'delivery']),
  items: z.array(createOrderItemSchema),
  subtotal: z.string(),
  taxAmount: z.string().default('0'),
  discountAmount: z.string().default('0'),
  total: z.string(),
  notes: z.string().optional(),
});

export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, tableId } = req.query;
  
  let orders;
  if (status) {
    orders = await OrderService.getOrdersByStatus(status as string);
  } else if (tableId) {
    orders = await OrderService.getOrdersByTable(parseInt(tableId as string));
  } else {
    orders = await OrderService.getAllOrders();
  }

  res.json({
    success: true,
    data: { orders },
  });
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = await OrderService.getOrderById(parseInt(id));
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const orderItems = await OrderService.getOrderItems(order.id);

  res.json({
    success: true,
    data: { 
      order,
      items: orderItems,
    },
  });
});

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validatedData = createOrderSchema.parse(req.body);
  const { items, ...orderData } = validatedData;

  const orderWithUserId = {
    ...orderData,
    userId: req.user!.id,
    status: 'pending' as const,
    paymentStatus: 'pending' as const,
  };

  const result = await OrderService.createOrder(orderWithUserId, items);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError('Status is required', 400);
  }

  const validStatuses = ['pending', 'preparing', 'ready', 'served', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const order = await OrderService.updateOrderStatus(parseInt(id), status);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { order },
  });
});

export const updatePaymentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { paymentStatus, paymentMethod } = req.body;

  if (!paymentStatus) {
    throw new AppError('Payment status is required', 400);
  }

  const validPaymentStatuses = ['pending', 'paid', 'failed'];
  if (!validPaymentStatuses.includes(paymentStatus)) {
    throw new AppError('Invalid payment status', 400);
  }

  const order = await OrderService.updatePaymentStatus(
    parseInt(id), 
    paymentStatus, 
    paymentMethod
  );
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({
    success: true,
    message: 'Payment status updated successfully',
    data: { order },
  });
});

export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await OrderService.cancelOrder(parseInt(id), reason);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order },
  });
});

export const getOrderStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await OrderService.getOrderStats();

  res.json({
    success: true,
    data: { stats },
  });
});