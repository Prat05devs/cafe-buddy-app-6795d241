import React, { createContext, useContext, ReactNode } from 'react';
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
  // Actions
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateTableStatus: (tableId: string, status: Table['status']) => void;
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