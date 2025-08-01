import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Import postgres connection directly
  const postgres = await import("postgres");
  const sql = postgres.default(process.env.DATABASE_URL!, { prepare: false });
  
  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await sql`
        SELECT * FROM categories 
        WHERE is_active = true 
        ORDER BY sort_order ASC
      `;
      res.json(categories);
    } catch (error) {
      console.error('Categories error:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Menu Items API
  app.get("/api/menu/items", async (req, res) => {
    try {
      const menuItems = await sql`
        SELECT 
          mi.*,
          c.name as category_name,
          c.icon as category_icon
        FROM menu_items mi
        LEFT JOIN categories c ON mi.category_id = c.id
        WHERE mi.is_available = true 
        ORDER BY mi.sort_order ASC, mi.name ASC
      `;
      res.json(menuItems);
    } catch (error) {
      console.error('Menu items error:', error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Tables API
  app.get("/api/tables", async (req, res) => {
    try {
      console.log('Fetching tables...');
      const tables = await sql`
        SELECT id, number, capacity, status, floor, is_active, created_at, updated_at
        FROM tables 
        WHERE is_active = true 
        ORDER BY id ASC
      `;
      console.log('Tables fetched:', tables.length, 'tables');
      res.json(tables);
    } catch (error) {
      console.error('Tables error:', error);
      res.status(500).json({ error: "Failed to fetch tables", details: error.message });
    }
  });

  // Users API
  app.get("/api/users", async (req, res) => {
    try {
      const users = await sql`
        SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at
        FROM users 
        WHERE is_active = true 
        ORDER BY first_name ASC
      `;
      res.json(users);
    } catch (error) {
      console.error('Users error:', error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Create new menu item (POST)
  app.post("/api/menu/items", async (req, res) => {
    try {
      const { name, description, price, category_id, is_vegetarian = true } = req.body;
      
      if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
      }
      
      const result = await sql`
        INSERT INTO menu_items (name, description, price, category_id, is_vegetarian, is_available)
        VALUES (${name}, ${description || ''}, ${price}, ${category_id}, ${is_vegetarian}, true)
        RETURNING *
      `;
      
      res.status(201).json({ message: "Menu item created successfully", item: result[0] });
    } catch (error) {
      console.error('Create menu item error:', error);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  // Update table status (PATCH)
  app.patch("/api/tables/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['available', 'occupied', 'reserved', 'cleaning'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const result = await sql`
        UPDATE tables 
        SET status = ${status}, updated_at = now()
        WHERE id = ${id}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Table not found" });
      }
      
      res.json({ message: "Table status updated", table: result[0] });
    } catch (error) {
      console.error('Update table error:', error);
      res.status(500).json({ error: "Failed to update table status" });
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await sql`
        SELECT * FROM orders 
        ORDER BY created_at DESC
      `;
      res.json(orders);
    } catch (error) {
      console.error('Orders error:', error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Create new order (POST)
  app.post("/api/orders", async (req, res) => {
    try {
      const { 
        table_id, 
        type, 
        subtotal, 
        tax, 
        discount, 
        total, 
        customer_name, 
        customer_phone,
        items 
      } = req.body;
      
      console.log('Received order data:', JSON.stringify(req.body, null, 2));
      
      if (!subtotal || !total || !items || items.length === 0) {
        return res.status(400).json({ error: "Order details and items are required" });
      }
      
      // Generate order number
      const orderCount = await sql`SELECT COUNT(*) as count FROM orders`;
      const orderNumber = `ORD${String(Number(orderCount[0].count) + 1).padStart(3, '0')}`;
      
      // Prepare values with explicit null handling (only for columns that exist)
      const orderData = {
        order_number: orderNumber,
        table_id: table_id ? parseInt(table_id) : null,
        type: type || 'dine-in',
        status: 'pending',
        subtotal: subtotal.toString(),
        total: total.toString(),
        payment_status: 'pending',
        payment_method: 'cash',
        customer_name: customer_name || null,
        customer_phone: customer_phone || null
      };
      
      console.log('Processed order data:', orderData);
      
      // Create order (using only columns that exist in database)
      const orderResult = await sql`
        INSERT INTO orders (
          order_number, table_id, type, status, subtotal, total,
          payment_status, payment_method, customer_name, customer_phone
        )
        VALUES (
          ${orderData.order_number}, ${orderData.table_id}, ${orderData.type}, ${orderData.status}, 
          ${orderData.subtotal}, ${orderData.total},
          ${orderData.payment_status}, ${orderData.payment_method}, ${orderData.customer_name}, ${orderData.customer_phone}
        )
        RETURNING *
      `;
      
      const order = orderResult[0];
      console.log('Created order:', order);
      
      // Add order items
      for (const item of items) {
        const itemData = {
          order_id: order.id,
          menu_item_id: parseInt(item.menu_item_id),
          quantity: parseInt(item.quantity),
          price: item.price.toString(),
          total_price: item.total_price.toString(),
          special_instructions: item.special_instructions || null
        };
        
        await sql`
          INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, special_instructions)
          VALUES (${itemData.order_id}, ${itemData.menu_item_id}, ${itemData.quantity}, ${itemData.price}, ${itemData.total_price}, ${itemData.special_instructions})
        `;
      }
      
      // Update table status if table order
      if (orderData.table_id) {
        await sql`
          UPDATE tables 
          SET status = 'occupied', updated_at = now()
          WHERE id = ${orderData.table_id}
        `;
      }
      
      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: "Failed to create order", details: error.message });
    }
  });

  // Update order status (PATCH)
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['pending', 'preparing', 'ready', 'served', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      let result;
      
      if (status === 'served') {
        // When marking as served, update payment status and served timestamp
        result = await sql`
          UPDATE orders 
          SET status = ${status}, updated_at = now(), payment_status = 'paid'
          WHERE id = ${id}
          RETURNING *
        `;
        
        // Update table status back to available if it's a table order
        const order = result[0];
        if (order && order.table_id) {
          await sql`
            UPDATE tables 
            SET status = 'available', updated_at = now()
            WHERE id = ${order.table_id}
          `;
        }
      } else {
        // For other status updates
        result = await sql`
          UPDATE orders 
          SET status = ${status}, updated_at = now()
          WHERE id = ${id}
          RETURNING *
        `;
      }
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ message: "Order status updated", order: result[0] });
    } catch (error) {
      console.error('Update order error:', error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Comprehensive analytics endpoint for dashboard and reports
  app.get("/api/analytics", async (req, res) => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.setDate(now.getDate() - 7));
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all completed orders with items
      const completedOrders = await sql`
        SELECT o.*, 
               oi.menu_item_id,
               oi.quantity,
               oi.unit_price,
               oi.total_price,
               mi.name as item_name,
               mi.category_id,
               c.name as category_name,
               EXTRACT(hour FROM o.created_at) as order_hour,
               EXTRACT(dow FROM o.created_at) as day_of_week
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        LEFT JOIN categories c ON mi.category_id = c.id
        WHERE o.status = 'served' AND o.payment_status = 'paid'
        ORDER BY o.created_at DESC
      `;

      // Calculate daily sales
      const todaySales = completedOrders.filter(order => 
        new Date(order.created_at) >= todayStart
      );
      const weekSales = completedOrders.filter(order => 
        new Date(order.created_at) >= weekStart
      );
      const monthSales = completedOrders.filter(order => 
        new Date(order.created_at) >= monthStart
      );

      // Calculate revenue totals
      const todayRevenue = todaySales.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const weekRevenue = weekSales.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const monthRevenue = monthSales.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const totalRevenue = completedOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);

      // Count unique orders
      const todayOrderCount = [...new Set(todaySales.map(o => o.id))].length;
      const weekOrderCount = [...new Set(weekSales.map(o => o.id))].length;
      const monthOrderCount = [...new Set(monthSales.map(o => o.id))].length;
      const totalOrderCount = [...new Set(completedOrders.map(o => o.id))].length;

      // Calculate top selling items
      const itemSales = {};
      completedOrders.forEach(order => {
        if (order.menu_item_id && order.item_name) {
          const key = order.menu_item_id;
          if (!itemSales[key]) {
            itemSales[key] = {
              id: order.menu_item_id,
              name: order.item_name,
              category: order.category_name,
              quantity: 0,
              revenue: 0
            };
          }
          itemSales[key].quantity += parseInt(order.quantity || 0);
          itemSales[key].revenue += parseFloat(order.total_price || 0);
        }
      });

      const topSellingItems = Object.values(itemSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      // Calculate peak hours
      const hourlyStats = {};
      completedOrders.forEach(order => {
        const hour = parseInt(order.order_hour);
        if (!hourlyStats[hour]) {
          hourlyStats[hour] = { hour, orders: 0, revenue: 0 };
        }
        hourlyStats[hour].orders += 1;
        hourlyStats[hour].revenue += parseFloat(order.total || 0);
      });

      const peakHours = Object.values(hourlyStats)
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      // Daily trend for the last 7 days
      const dailyTrend = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = completedOrders.filter(order => 
          order.created_at && order.created_at.toISOString().startsWith(dateStr)
        );
        
        dailyTrend.push({
          date: dateStr,
          revenue: dayOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0),
          orders: [...new Set(dayOrders.map(o => o.id))].length,
          items: dayOrders.reduce((sum, order) => sum + parseInt(order.quantity || 0), 0)
        });
      }

      res.json({
        summary: {
          today: {
            revenue: todayRevenue,
            orders: todayOrderCount,
            averageOrderValue: todayOrderCount > 0 ? todayRevenue / todayOrderCount : 0
          },
          week: {
            revenue: weekRevenue,
            orders: weekOrderCount,
            averageOrderValue: weekOrderCount > 0 ? weekRevenue / weekOrderCount : 0
          },
          month: {
            revenue: monthRevenue,
            orders: monthOrderCount,
            averageOrderValue: monthOrderCount > 0 ? monthRevenue / monthOrderCount : 0
          },
          total: {
            revenue: totalRevenue,
            orders: totalOrderCount,
            averageOrderValue: totalOrderCount > 0 ? totalRevenue / totalOrderCount : 0
          }
        },
        topSellingItems,
        peakHours,
        dailyTrend,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: "Failed to fetch analytics data" });
    }
  });

  // Keep the original sales endpoint for backward compatibility
  app.get("/api/sales", async (req, res) => {
    try {
      const servedOrders = await sql`
        SELECT o.*, 
               COUNT(oi.id) as item_count,
               json_agg(
                 json_build_object(
                   'menu_item_id', oi.menu_item_id,
                   'quantity', oi.quantity,
                   'unit_price', oi.unit_price,
                   'total_price', oi.total_price
                 )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.status = 'served' AND o.payment_status = 'paid'
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;

      const totalRevenue = servedOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const totalOrders = servedOrders.length;
      const totalItems = servedOrders.reduce((sum, order) => sum + parseInt(order.item_count || 0), 0);
      
      res.json({
        orders: servedOrders,
        metrics: {
          totalRevenue,
          totalOrders,
          totalItems,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        }
      });
    } catch (error) {
      console.error('Sales data error:', error);
      res.status(500).json({ error: "Failed to fetch sales data" });
    }
  });

  // Health check
  app.get("/api/health", async (req, res) => {
    try {
      await sql`SELECT 1`;
      res.json({ status: "healthy", database: "connected" });
    } catch (error) {
      res.status(500).json({ status: "unhealthy", database: "disconnected" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
