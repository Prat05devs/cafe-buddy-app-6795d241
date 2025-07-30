import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MenuItem, 
  Category, 
  Order, 
  Table, 
  DashboardStats, 
  Restaurant 
} from '@/types/restaurant';
import { loadConfig, RestaurantConfig } from '@/lib/config';
import { apiRequest } from '@/lib/queryClient';

export const useRestaurantData = () => {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [language, setLanguage] = useState('en');
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch menu items from API
  const { data: menuItemsData, isLoading: menuItemsLoading } = useQuery({
    queryKey: ['/api/menu/items'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch tables from API
  const { data: tablesData, isLoading: tablesLoading } = useQuery({
    queryKey: ['/api/tables'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch users from API
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loading = categoriesLoading || menuItemsLoading || tablesLoading || usersLoading;

  // Transform API data to app format
  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData.map((cat: any) => ({
    id: cat.id.toString(),
    name: cat.name,
    displayOrder: cat.sort_order,
    icon: cat.icon
  })) : [];

  const menuItems: MenuItem[] = Array.isArray(menuItemsData) ? menuItemsData.map((item: any) => ({
    id: item.id.toString(),
    name: item.name,
    description: item.description || '',
    price: parseFloat(item.price),
    category: item.category_name || 'uncategorized',
    available: item.is_available,
    imageUrl: item.image_url,
    ingredients: [],
    allergens: [],
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  })) : [];

  const tables: Table[] = Array.isArray(tablesData) ? tablesData.map((table: any) => ({
    id: table.id.toString(),
    number: table.number,
    capacity: table.capacity,
    status: table.status as Table['status'],
    floor: table.floor
  })) : [];

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

  // Load config from data.json on component mount
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
        
        // Helper function to get localized text
        const getLocalizedText = (textObj: any, lang: string = finalLanguage): string => {
          if (typeof textObj === 'string') return textObj;
          if (typeof textObj === 'object' && textObj !== null) {
            return textObj[lang] || textObj['en'] || textObj[Object.keys(textObj)[0]] || '';
          }
          return '';
        };

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

  // Menu management functions (will make API calls in the future)
  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Implement API call to create menu item
    console.log('Add menu item:', item);
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    // TODO: Implement API call to update menu item
    console.log('Update menu item:', id, updates);
  };

  const deleteMenuItem = async (id: string) => {
    // TODO: Implement API call to delete menu item
    console.log('Delete menu item:', id);
  };

  const toggleMenuItemAvailability = async (id: string) => {
    // TODO: Implement API call to toggle availability
    console.log('Toggle menu item availability:', id);
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
  const updateTableStatus = async (tableId: string, status: Table['status']) => {
    try {
      await apiRequest(`/api/tables/${tableId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      // Refresh tables data after update
      // In a real app, you'd invalidate the query to trigger a refetch
      console.log('Table status updated successfully');
    } catch (error) {
      console.error('Failed to update table status:', error);
    }
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