import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RestaurantConfig, Order, loadConfig } from '@/lib/config';

interface RestaurantContextType {
  config: RestaurantConfig | null;
  loading: boolean;
  error: string | null;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  currentUser: number | null;
  login: (staffId: number, pin: string) => boolean;
  logout: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
}

interface RestaurantProviderProps {
  children: ReactNode;
}

export function RestaurantProvider({ children }: RestaurantProviderProps) {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<number | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const restaurantConfig = await loadConfig();
        setConfig(restaurantConfig);
        
        // Load saved orders from localStorage
        const savedOrders = localStorage.getItem('restaurant-orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
        
        // Check for saved user session
        const savedUser = localStorage.getItem('restaurant-current-user');
        if (savedUser) {
          setCurrentUser(parseInt(savedUser));
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize app');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Save orders to localStorage whenever they change
    localStorage.setItem('restaurant-orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `ORD${String(orders.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id 
        ? { ...order, ...updates, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const login = (staffId: number, pin: string): boolean => {
    const staff = config?.staff.find(s => s.id === staffId && s.active);
    if (staff && staff.pin === pin) {
      setCurrentUser(staffId);
      localStorage.setItem('restaurant-current-user', staffId.toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('restaurant-current-user');
  };

  const value: RestaurantContextType = {
    config,
    loading,
    error,
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    currentUser,
    login,
    logout,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}