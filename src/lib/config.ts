export interface RestaurantConfig {
  restaurantName: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  language: string;
  currency: string;
  gstRate: number;
  theme: 'light' | 'dark' | 'auto';
  menu: MenuItem[];
  categories: Category[];
  staff: StaffMember[];
  tables: Table[];
  features: Features;
  shortcuts: Shortcut[];
  settings: Settings;
  inventory: InventoryItem[];
  version: string;
  lastUpdated: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  available: boolean;
  veg: boolean;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface StaffMember {
  id: number;
  name: string;
  role: 'waiter' | 'manager' | 'cook' | 'admin';
  pin: string;
  active: boolean;
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
  floor: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
}

export interface Features {
  inventory: boolean;
  printerSupport: boolean;
  guestMode: boolean;
  multiLanguage: boolean;
  tableManagement: boolean;
  qrMenu: boolean;
  loyaltyProgram: boolean;
  deliveryIntegration: boolean;
  analyticsReports: boolean;
}

export interface Shortcut {
  name: string;
  items: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface Settings {
  autoCalculateTax: boolean;
  defaultPaymentMethod: string;
  printBillAutomatically: boolean;
  soundNotifications: boolean;
  roundOffBills: boolean;
  showItemImages: boolean;
  compactMode: boolean;
  greeting: string;
  footer: string;
}

export interface InventoryItem {
  itemId: number;
  stockLevel: number;
  minStock: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: number;
  type: 'dine-in' | 'takeaway' | 'delivery';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  paymentMethod?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number; // staff id
}

export interface OrderItem {
  id: string;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  notes?: string;
}

let configCache: RestaurantConfig | null = null;

export async function loadConfig(): Promise<RestaurantConfig> {
  if (configCache) {
    return configCache;
  }

  try {
    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    
    configCache = await response.json();
    return configCache!;
  } catch (error) {
    console.error('Error loading restaurant config:', error);
    throw new Error('Failed to load restaurant configuration');
  }
}

export function clearConfigCache() {
  configCache = null;
}

export function getConfig(): RestaurantConfig | null {
  return configCache;
}