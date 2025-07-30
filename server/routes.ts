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
      const tables = await sql`
        SELECT * FROM tables 
        WHERE is_active = true 
        ORDER BY CAST(number AS INTEGER) ASC
      `;
      res.json(tables);
    } catch (error) {
      console.error('Tables error:', error);
      res.status(500).json({ error: "Failed to fetch tables" });
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
