import { useState, useEffect } from 'react';
import { 
  MenuItem, 
  Category, 
  Order, 
  Table, 
  DashboardStats, 
  Restaurant 
} from '@/types/restaurant';
import { loadConfig, RestaurantConfig } from '@/lib/config';

export const useRestaurantData = () => {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [rawMenuItems, setRawMenuItems] = useState<any[]>([]);
  const [rawCategories, setRawCategories] = useState<any[]>([]);

  // Helper function to get localized text
  const getLocalizedText = (textObj: any, lang: string = language): string => {
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object' && textObj !== null) {
      return textObj[lang] || textObj['en'] || textObj[Object.keys(textObj)[0]] || '';
    }
    return '';
  };

  // Computed values that update when language changes
  const categories = rawCategories.map(cat => ({
    id: cat.id,
    name: getLocalizedText(cat.name),
    displayOrder: cat.order,
    icon: cat.icon
  }));

  const menuItems = rawMenuItems.map(item => ({
    id: item.id.toString(),
    name: getLocalizedText(item.name),
    description: getLocalizedText(item.description),
    price: item.price,
    category: item.category.toLowerCase().replace(/\s+/g, '-'),
    available: item.available,
    imageUrl: item.image,
    ingredients: item.ingredients || [],
    allergens: item.allergens || [],
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  // Create restaurant object from config
  const [restaurant, setRestaurant] = useState<Restaurant>({
    id: 'rest-1',
    name: 'Restaurant',
    address: '',
    phone: '',
    email: '',
    taxRate: 0,
    currency: '$',
    settings: {
      enableTableManagement: true,
      enableInventory: true,
      autoCalculateTax: true,
      defaultPaymentMethod: 'cash',
      language: 'en',
      theme: 'auto'
    }
  });

  // Transform tables from config format to app format - will be populated from data.json
  const [tables, setTables] = useState<Table[]>([]);
  
  // Orders will be managed dynamically (not from data.json)
  const [orders, setOrders] = useState<Order[]>([]);  // Load config from data.json on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Check for stored language preference first
        const storedLanguage = localStorage.getItem('preferredLanguage');
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }

        const configData = await loadConfig();
        setConfig(configData);
        
        // Use stored language preference or config language
        const finalLanguage = storedLanguage || configData.language || 'en';
        setLanguage(finalLanguage);
        
        // Update restaurant info
        setRestaurant({
          id: 'rest-1',
          name: typeof configData.restaurantName === 'string' 
            ? configData.restaurantName 
            : getLocalizedText(configData.restaurantName, finalLanguage),
          address: configData.address,
          phone: configData.phone,
          email: configData.email,
          taxRate: configData.gstRate,
          currency: configData.currency,
          settings: {
            enableTableManagement: configData.features.tableManagement,
            enableInventory: configData.features.inventory,
            autoCalculateTax: configData.settings.autoCalculateTax,
            defaultPaymentMethod: configData.settings.defaultPaymentMethod,
            language: finalLanguage,
            theme: configData.theme as 'light' | 'dark' | 'auto'
          }
        });
        
        // Set initial language - removed duplicate line since we already set it above
        
        // Store raw categories and menu items for localization
        setRawCategories(configData.categories || []);
        setRawMenuItems(configData.menu || []);
        
        // Transform tables from config data
        if (configData.tables) {
          const transformedTables: Table[] = configData.tables.map((table: any) => ({
            id: String(table.id),
            number: table.name,
            capacity: table.capacity,
            status: table.status as Table['status'],
            floor: table.floor,
            position: table.position || { x: 0, y: 0 }
          }));
          setTables(transformedTables);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load config:', error);
        console.log('Using fallback configuration...');
        
        // Set a fallback config when loading fails
        const fallbackConfig: RestaurantConfig = {
          restaurantName: 'Cafe Buddy',
          logo: '',
          address: '123 Main Street',
          phone: '+1-234-567-8900',
          email: 'info@cafebuddy.com',
          currency: '$',
          language: 'en',
          gstRate: 18,
          theme: 'light',
          menu: [],
          categories: [],
          staff: [],
          tables: [],
          features: {
            inventory: false,
            tableManagement: true,
            printerSupport: false,
            guestMode: false,
            multiLanguage: false,
            qrMenu: false,
            loyaltyProgram: false,
            deliveryIntegration: false,
            analyticsReports: true,
          },
          shortcuts: [],
          settings: {
            autoCalculateTax: true,
            defaultPaymentMethod: 'cash',
            printBillAutomatically: false,
            soundNotifications: false,
            roundOffBills: true,
            showItemImages: true,
            compactMode: false,
            greeting: 'Welcome to Cafe Buddy',
            footer: 'Thank you for your visit!',
          },
          inventory: [],
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
        };
        
        setConfig(fallbackConfig);
        setRawCategories([]);
        setRawMenuItems([]);
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, []);

  // Calculate dashboard stats from actual data
  const dashboardStats: DashboardStats = {
    todaysSales: orders
      .filter(o => o.status === 'served' && o.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0),
    todaysOrders: orders.length,
    availableTables: tables.filter(t => t.status === 'available').length,
    totalTables: tables.length,
    pendingOrders: orders.filter(o => ['pending', 'preparing'].includes(o.status)).length,
    topSellingItems: menuItems.slice(0, 3).map((item, index) => ({
      item,
      quantity: Math.max(1, 15 - index * 3), // Sample data based on item popularity
      revenue: (Math.max(1, 15 - index * 3)) * item.price
    }))
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
    const newItem = {
      id: Date.now(),
      name: { en: item.name },
      description: { en: item.description },
      price: item.price,
      category: item.category,
      available: item.available,
      image: item.imageUrl,
      ingredients: item.ingredients,
      allergens: item.allergens,
    };
    setRawMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setRawMenuItems(prev => prev.map(item => 
      item.id.toString() === id 
        ? { 
            ...item, 
            ...(updates.name && { name: { en: updates.name } }),
            ...(updates.description && { description: { en: updates.description } }),
            ...(updates.price && { price: updates.price }),
            ...(updates.category && { category: updates.category }),
            ...(updates.available !== undefined && { available: updates.available }),
            ...(updates.imageUrl && { image: updates.imageUrl }),
            ...(updates.ingredients && { ingredients: updates.ingredients }),
            ...(updates.allergens && { allergens: updates.allergens }),
          }
        : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setRawMenuItems(prev => prev.filter(item => item.id.toString() !== id));
  };

  const toggleMenuItemAvailability = (id: string) => {
    setRawMenuItems(prev => prev.map(item =>
      item.id.toString() === id
        ? { ...item, available: !item.available }
        : item
    ));
  };

  // Order management functions
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { 
            ...order, 
            status, 
            // Automatically mark as paid when served (for dashboard earnings calculation)
            paymentStatus: status === 'served' ? 'paid' : order.paymentStatus,
            updatedAt: new Date() 
          }
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

  // Language management function
  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  // Clear any problematic orders - useful for debugging
  const clearOrders = () => {
    setOrders([]);
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
    loading,
    config,
    language,
    // Actions
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    updateOrderStatus,
    addOrder,
    updateTableStatus,
    setLanguage: updateLanguage,
    clearOrders, // Add for debugging
  };
};