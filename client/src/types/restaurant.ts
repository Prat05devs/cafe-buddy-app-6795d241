export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  ingredients?: string[];
  allergens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  displayOrder: number;
  icon?: string;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  floor?: string;
  position?: { x: number; y: number };
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  table?: Table;
  type: 'dine-in' | 'takeaway' | 'delivery';
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'partial';
  paymentMethod?: 'cash' | 'card' | 'upi' | 'wallet';
  customerName?: string;
  customerPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  servedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'waiter' | 'kitchen';
  phone?: string;
  active: boolean;
  createdAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
  logo?: string;
  settings: {
    enableTableManagement: boolean;
    enableInventory: boolean;
    autoCalculateTax: boolean;
    defaultPaymentMethod: string;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface DashboardStats {
  todaysSales: number;
  todaysOrders: number;
  availableTables: number;
  totalTables: number;
  pendingOrders: number;
  topSellingItems: Array<{
    item: MenuItem;
    quantity: number;
    revenue: number;
  }>;
}