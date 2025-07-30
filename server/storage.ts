import { 
  users, categories, menuItems, tables, orders, orderItems,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type MenuItem, type InsertMenuItem,
  type Table, type InsertTable,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";

// Storage interface for restaurant POS system
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category management
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Menu item management
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Table management
  getTables(): Promise<Table[]>;
  getTableById(id: number): Promise<Table | undefined>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: number, updates: Partial<InsertTable>): Promise<Table | undefined>;
  deleteTable(id: number): Promise<boolean>;
  
  // Order management
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByTable(tableId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  // Order items management
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  updateOrderItem(id: number, updates: Partial<InsertOrderItem>): Promise<OrderItem | undefined>;
  deleteOrderItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private categories: Map<number, Category> = new Map();
  private menuItems: Map<number, MenuItem> = new Map();
  private tables: Map<number, Table> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();
  
  private userCounter = 1;
  private categoryCounter = 1;
  private menuItemCounter = 1;
  private tableCounter = 1;
  private orderCounter = 1;
  private orderItemCounter = 1;

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values())
      .filter(cat => cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCounter++;
    const now = new Date();
    const category: Category = { 
      ...insertCategory, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updated: Category = { 
      ...category, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Menu item methods
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.isAvailable)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values())
      .filter(item => item.categoryId === categoryId && item.isAvailable)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemCounter++;
    const now = new Date();
    const menuItem: MenuItem = { 
      ...insertMenuItem, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const menuItem = this.menuItems.get(id);
    if (!menuItem) return undefined;
    
    const updated: MenuItem = { 
      ...menuItem, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Table methods
  async getTables(): Promise<Table[]> {
    return Array.from(this.tables.values())
      .filter(table => table.isActive)
      .sort((a, b) => parseInt(a.number) - parseInt(b.number));
  }

  async getTableById(id: number): Promise<Table | undefined> {
    return this.tables.get(id);
  }

  async createTable(insertTable: InsertTable): Promise<Table> {
    const id = this.tableCounter++;
    const now = new Date();
    const table: Table = { 
      ...insertTable, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.tables.set(id, table);
    return table;
  }

  async updateTable(id: number, updates: Partial<InsertTable>): Promise<Table | undefined> {
    const table = this.tables.get(id);
    if (!table) return undefined;
    
    const updated: Table = { 
      ...table, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.tables.set(id, updated);
    return updated;
  }

  async deleteTable(id: number): Promise<boolean> {
    return this.tables.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByTable(tableId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.tableId === tableId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCounter++;
    const now = new Date();
    const orderNumber = `ORD-${Date.now()}-${id}`;
    const order: Order = { 
      ...insertOrder, 
      id, 
      orderNumber,
      createdAt: now, 
      updatedAt: now 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated: Order = { 
      ...order, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.orders.set(id, updated);
    return updated;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Order item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemCounter++;
    const now = new Date();
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id, 
      createdAt: now 
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async updateOrderItem(id: number, updates: Partial<InsertOrderItem>): Promise<OrderItem | undefined> {
    const orderItem = this.orderItems.get(id);
    if (!orderItem) return undefined;
    
    const updated: OrderItem = { 
      ...orderItem, 
      ...updates 
    };
    this.orderItems.set(id, updated);
    return updated;
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    return this.orderItems.delete(id);
  }
}

export const storage = new MemStorage();
