import { useState, useEffect } from 'react';
import { 
  MenuItem, 
  Category, 
  Order, 
  Table, 
  DashboardStats, 
  Restaurant 
} from '@/types/restaurant';

// Mock data for demonstration
const mockCategories: Category[] = [
  { id: 'starters', name: 'Starters', displayOrder: 1, icon: '🥗' },
  { id: 'main-course', name: 'Main Course', displayOrder: 2, icon: '🍽️' },
  { id: 'beverages', name: 'Beverages', displayOrder: 3, icon: '🥤' },
  { id: 'desserts', name: 'Desserts', displayOrder: 4, icon: '🍰' },
];

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Paneer Butter Masala',
    description: 'Creamy tomato-based curry with cottage cheese cubes',
    price: 24,
    category: 'main-course',
    available: true,
    ingredients: ['paneer', 'tomatoes', 'cream', 'spices'],
    allergens: ['dairy'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Chana Masala',
    description: 'Spiced chickpea curry',
    price: 22,
    category: 'main-course',
    available: true,
    ingredients: ['chickpeas', 'onions', 'tomatoes', 'spices'],
    allergens: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Mix Vegetable Jalfrezi',
    description: 'Stir-fried mixed vegetables in tangy sauce',
    price: 28,
    category: 'main-course',
    available: true,
    ingredients: ['mixed vegetables', 'bell peppers', 'onions', 'tomatoes'],
    allergens: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Thai Curry Green',
    description: 'Aromatic green curry with vegetables',
    price: 22,
    category: 'main-course',
    available: true,
    ingredients: ['coconut milk', 'green curry paste', 'vegetables'],
    allergens: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Marwadi Kofte',
    description: 'Traditional Rajasthani vegetable dumplings in curry',
    price: 18,
    category: 'main-course',
    available: true,
    ingredients: ['mixed vegetables', 'gram flour', 'yogurt', 'spices'],
    allergens: ['dairy'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Spinach Cheese Grilled',
    description: 'Grilled sandwich with spinach and cheese',
    price: 10,
    category: 'starters',
    available: true,
    ingredients: ['bread', 'spinach', 'cheese', 'butter'],
    allergens: ['gluten', 'dairy'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Paneer Kadhi Roll',
    description: 'Rolled paratha with spiced paneer',
    price: 10,
    category: 'starters',
    available: true,
    ingredients: ['paratha', 'paneer', 'onions', 'chutneys'],
    allergens: ['gluten', 'dairy'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Dal Tadka',
    description: 'Tempered yellow lentils',
    price: 8,
    category: 'main-course',
    available: false,
    ingredients: ['lentils', 'onions', 'tomatoes', 'ghee', 'spices'],
    allergens: ['dairy'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    name: 'Dal Panchmel',
    description: 'Mixed five lentil curry',
    price: 10,
    category: 'main-course',
    available: true,
    ingredients: ['mixed lentils', 'onions', 'tomatoes', 'spices'],
    allergens: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `table-${i + 1}`,
  number: `${i + 1}`,
  capacity: [2, 4, 6][i % 3],
  status: ['available', 'occupied', 'reserved', 'cleaning'][Math.floor(Math.random() * 4)] as Table['status'],
  floor: i < 6 ? 'Ground Floor' : '1st Floor',
  position: { x: (i % 4) * 100, y: Math.floor(i / 4) * 100 },
}));

const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD001',
    tableId: 'table-1',
    table: mockTables[0],
    type: 'dine-in',
    status: 'preparing',
    items: [
      {
        id: 'item-1',
        menuItemId: '1',
        menuItem: mockMenuItems[0],
        quantity: 2,
        price: 24,
        totalPrice: 48,
        specialInstructions: 'Less spicy'
      }
    ],
    subtotal: 48,
    tax: 4.8,
    discount: 0,
    total: 52.8,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    updatedAt: new Date(),
  },
  {
    id: 'order-2',
    orderNumber: 'ORD002',
    tableId: 'table-3',
    table: mockTables[2],
    type: 'dine-in',
    status: 'ready',
    items: [
      {
        id: 'item-2',
        menuItemId: '2',
        menuItem: mockMenuItems[1],
        quantity: 1,
        price: 22,
        totalPrice: 22,
      },
      {
        id: 'item-3',
        menuItemId: '6',
        menuItem: mockMenuItems[5],
        quantity: 2,
        price: 10,
        totalPrice: 20,
      }
    ],
    subtotal: 42,
    tax: 4.2,
    discount: 2,
    total: 44.2,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 25 * 60000), // 25 minutes ago
    updatedAt: new Date(),
  }
];

export const useRestaurantData = () => {
  const [restaurant] = useState<Restaurant>({
    id: 'rest-1',
    name: 'DashPOS Restaurant',
    address: '123 Main Street, City',
    phone: '+91 98765 43210',
    email: 'contact@restaurant.com',
    taxRate: 10,
    currency: '₹',
    settings: {
      enableTableManagement: true,
      enableInventory: true,
      autoCalculateTax: true,
      defaultPaymentMethod: 'cash',
      language: 'en',
      theme: 'auto'
    }
  });

  const [categories] = useState(mockCategories);
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [tables, setTables] = useState(mockTables);
  const [orders, setOrders] = useState(mockOrders);

  const dashboardStats: DashboardStats = {
    todaysSales: 2840.50,
    todaysOrders: 45,
    availableTables: tables.filter(t => t.status === 'available').length,
    totalTables: tables.length,
    pendingOrders: orders.filter(o => ['pending', 'preparing'].includes(o.status)).length,
    topSellingItems: [
      { item: menuItems[0], quantity: 12, revenue: 288 },
      { item: menuItems[1], quantity: 8, revenue: 176 },
      { item: menuItems[2], quantity: 6, revenue: 168 },
    ]
  };

  const tableOrders = orders.reduce((acc, order) => {
    if (order.tableId) {
      acc[order.tableId] = acc[order.tableId] || [];
      acc[order.tableId].push(order);
    }
    return acc;
  }, {} as Record<string, Order[]>);

  // Menu management functions
  const addMenuItem = (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, available: !item.available, updatedAt: new Date() }
        : item
    ));
  };

  // Order management functions
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date() }
        : order
    ));
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  // Table management functions
  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(table =>
      table.id === tableId
        ? { ...table, status }
        : table
    ));
  };

  return {
    restaurant,
    categories,
    menuItems,
    tables,
    orders,
    dashboardStats,
    tableOrders,
    // Actions
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    updateOrderStatus,
    addOrder,
    updateTableStatus,
  };
};