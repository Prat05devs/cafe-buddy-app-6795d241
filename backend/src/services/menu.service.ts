import { eq, and } from 'drizzle-orm';
import { db } from '@/config/database';
import { 
  menuItems, 
  categories,
  type MenuItem, 
  type Category,
  type InsertMenuItem, 
  type InsertCategory,
  type UpdateMenuItem,
  type UpdateCategory
} from '@/models';

export class MenuService {
  // Category methods
  static async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).where(eq(categories.isActive, true));
  }

  static async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(
      and(eq(categories.id, id), eq(categories.isActive, true))
    );
    return category;
  }

  static async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  static async updateCategory(id: number, categoryData: UpdateCategory): Promise<Category | null> {
    const [category] = await db
      .update(categories)
      .set({ ...categoryData, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return category || null;
  }

  static async deleteCategory(id: number): Promise<boolean> {
    const [result] = await db
      .update(categories)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return !!result;
  }

  // Menu item methods
  static async getAllMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.isAvailable, true));
  }

  static async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(
      and(eq(menuItems.id, id), eq(menuItems.isAvailable, true))
    );
    return item;
  }

  static async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(
      and(
        eq(menuItems.categoryId, categoryId),
        eq(menuItems.isAvailable, true)
      )
    );
  }

  static async createMenuItem(itemData: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db.insert(menuItems).values(itemData).returning();
    return item;
  }

  static async updateMenuItem(id: number, itemData: UpdateMenuItem): Promise<MenuItem | null> {
    const [item] = await db
      .update(menuItems)
      .set({ ...itemData, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return item || null;
  }

  static async toggleMenuItemAvailability(id: number): Promise<MenuItem | null> {
    const item = await this.getMenuItemById(id);
    if (!item) return null;

    const [updatedItem] = await db
      .update(menuItems)
      .set({ 
        isAvailable: !item.isAvailable,
        updatedAt: new Date()
      })
      .where(eq(menuItems.id, id))
      .returning();
    
    return updatedItem || null;
  }

  static async deleteMenuItem(id: number): Promise<boolean> {
    const [result] = await db
      .update(menuItems)
      .set({ isAvailable: false, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return !!result;
  }

  static async searchMenuItems(query: string): Promise<MenuItem[]> {
    // This would need proper full-text search in production
    return db.select().from(menuItems).where(
      and(
        eq(menuItems.isAvailable, true)
        // Add text search conditions here based on your database capabilities
      )
    );
  }
}