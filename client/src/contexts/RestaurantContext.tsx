import { createContext, useContext, ReactNode } from 'react';
import { MenuItem, Category, Order, Table, Restaurant, DashboardStats } from '@/types/restaurant';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { RestaurantConfig } from '@/lib/config';

// Define context type
interface RestaurantContextType {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  dashboardStats: DashboardStats;
  tableOrders: Record<string, Order[]>;
  loading: boolean;
  config: RestaurantConfig | null;
  language: string;
  // Actions
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleMenuItemAvailability: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTableStatus: (tableId: string, status: Table['status']) => Promise<void>;
  setLanguage: (language: string) => void;
}

// Create context
const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Create a hook to use the restaurant context
export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
}

// Provider component
interface RestaurantProviderProps {
  children: ReactNode;
}

export function RestaurantProvider({ children }: RestaurantProviderProps) {
  const restaurantData = useRestaurantData();
  
  return (
    <RestaurantContext.Provider value={restaurantData}>
      {children}
    </RestaurantContext.Provider>
  );
}