import { eq, desc, and } from 'drizzle-orm';
import { db } from '@/config/database';
import { 
  orders, 
  orderItems,
  type Order, 
  type OrderItem,
  type InsertOrder, 
  type InsertOrderItem
} from '@/models/order.model';

export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  static async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  static async getOrdersByTable(tableId: number): Promise<Order[]> {
    return db.select().from(orders)
      .where(eq(orders.tableId, tableId))
      .orderBy(desc(orders.createdAt));
  }

  static async getOrdersByStatus(status: string): Promise<Order[]> {
    return db.select().from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt));
  }

  static async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  static generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
  }

  static async createOrder(
    orderData: InsertOrder, 
    items: Omit<InsertOrderItem, 'orderId'>[]
  ): Promise<{ order: Order; orderItems: OrderItem[] }> {
    const orderNumber = this.generateOrderNumber();
    
    // Create the order
    const [order] = await db.insert(orders).values({
      ...orderData,
      orderNumber,
    }).returning();

    // Create order items with proper types
    const orderItemsWithOrderId = items.map(item => ({
      orderId: order.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice || (Number(item.unitPrice) * item.quantity).toString(),
      specialInstructions: item.specialInstructions,
      customizations: (item.customizations as Record<string, any>) || {},
    })) as any[];

    const createdOrderItems = await db.insert(orderItems)
      .values(orderItemsWithOrderId)
      .returning();

    return {
      order,
      orderItems: createdOrderItems,
    };
  }

  static async updateOrderStatus(id: number, status: string): Promise<Order | null> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };

    // Set servedAt timestamp when order is served
    if (status === 'served') {
      updateData.servedAt = new Date();
    }

    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    
    return order || null;
  }

  static async updatePaymentStatus(id: number, paymentStatus: string, paymentMethod?: string): Promise<Order | null> {
    const updateData: any = { 
      paymentStatus, 
      updatedAt: new Date() 
    };

    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    
    return order || null;
  }

  static async cancelOrder(id: number, reason?: string): Promise<Order | null> {
    const updateData: any = {
      status: 'cancelled',
      updatedAt: new Date(),
    };

    if (reason) {
      updateData.notes = reason;
    }

    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    
    return order || null;
  }

  static async getOrderStats() {
    // This would be more complex in a real implementation
    // You'd want to use SQL aggregation functions
    const allOrders = await this.getAllOrders();
    
    const stats = {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'pending').length,
      preparing: allOrders.filter(o => o.status === 'preparing').length,
      ready: allOrders.filter(o => o.status === 'ready').length,
      served: allOrders.filter(o => o.status === 'served').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
      totalRevenue: allOrders
        .filter(o => o.status === 'served')
        .reduce((sum, o) => sum + Number(o.total), 0),
    };

    return stats;
  }
}