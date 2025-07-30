import { eq, and } from 'drizzle-orm';
import { db } from '@/config/database';
import { 
  tables,
  type Table, 
  type InsertTable, 
  type UpdateTable
} from '@/models/table.model';

export class TableService {
  static async getAllTables(): Promise<Table[]> {
    return db.select().from(tables).where(eq(tables.isActive, true));
  }

  static async getTableById(id: number): Promise<Table | undefined> {
    const [table] = await db.select().from(tables).where(
      and(eq(tables.id, id), eq(tables.isActive, true))
    );
    return table;
  }

  static async getTableByNumber(number: string): Promise<Table | undefined> {
    const [table] = await db.select().from(tables).where(
      and(eq(tables.number, number), eq(tables.isActive, true))
    );
    return table;
  }

  static async getTablesByFloor(floor: string): Promise<Table[]> {
    return db.select().from(tables).where(
      and(
        eq(tables.floor, floor),
        eq(tables.isActive, true)
      )
    );
  }

  static async getTablesByStatus(status: string): Promise<Table[]> {
    return db.select().from(tables).where(
      and(
        eq(tables.status, status),
        eq(tables.isActive, true)
      )
    );
  }

  static async createTable(tableData: InsertTable): Promise<Table> {
    const [table] = await db.insert(tables).values(tableData).returning();
    return table;
  }

  static async updateTable(id: number, tableData: UpdateTable): Promise<Table | null> {
    const [table] = await db
      .update(tables)
      .set({ ...tableData, updatedAt: new Date() })
      .where(eq(tables.id, id))
      .returning();
    return table || null;
  }

  static async updateTableStatus(id: number, status: string): Promise<Table | null> {
    const [table] = await db
      .update(tables)
      .set({ 
        status, 
        updatedAt: new Date() 
      })
      .where(eq(tables.id, id))
      .returning();
    return table || null;
  }

  static async deleteTable(id: number): Promise<boolean> {
    const [result] = await db
      .update(tables)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(tables.id, id))
      .returning();
    return !!result;
  }

  static async getAvailableTables(): Promise<Table[]> {
    return this.getTablesByStatus('available');
  }

  static async getOccupiedTables(): Promise<Table[]> {
    return this.getTablesByStatus('occupied');
  }

  static async generateQRCode(tableId: number): Promise<string> {
    // In a real implementation, you'd generate a proper QR code
    // This is a placeholder that returns a URL that could be used to generate QR codes
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return `${baseUrl}/order?table=${tableId}`;
  }

  static async updateQRCode(id: number): Promise<Table | null> {
    const qrCodeUrl = await this.generateQRCode(id);
    
    const [table] = await db
      .update(tables)
      .set({ 
        qrCodeUrl, 
        updatedAt: new Date() 
      })
      .where(eq(tables.id, id))
      .returning();
    
    return table || null;
  }
}