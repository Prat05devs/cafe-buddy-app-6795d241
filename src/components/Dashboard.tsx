import React, { useState, useEffect } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopSellingItems from '@/components/dashboard/TopSellingItems';
import { getLocalizedText } from '@/lib/helpers';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { config, orders, menuItems } = useRestaurant();
  
  const restaurantName = config ? getLocalizedText(config.restaurantName, config.language || 'en') : 'Restaurant';
  
  // Create fallback config if none exists
  const fallbackConfig: any = {
    restaurantName: 'Cafe Buddy',
    logo: '',
    address: '123 Main Street',
    phone: '+1-234-567-8900',
    email: 'info@cafebuddy.com',
    currency: '$',
    language: 'en',
    gstRate: 18,
    theme: 'light' as const,
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
  
  const activeConfig = config || fallbackConfig;

  // Calculate real-time stats from actual data
  const today = new Date();
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const paidTodayOrders = todayOrders.filter(order => order.paymentStatus === 'paid');
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing');
  const completedOrders = orders.filter(order => order.status === 'served');

  const todaySales = paidTodayOrders.reduce((sum, order) => sum + order.total, 0);
  
  // Calculate weekly sales (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= weekAgo && order.paymentStatus === 'paid';
  });
  const weekSales = weeklyOrders.reduce((sum, order) => sum + order.total, 0);

  // Real-time stats from actual orders data
  const stats = {
    todaySales: todaySales,
    weekSales: weekSales,
    pendingOrders: pendingOrders.length,
    completedOrders: completedOrders.length,
    availableTables: 8, // This would come from table management
    totalTables: 12
  };

  // Calculate top selling items from real order data
  const topSellingItems = (() => {
    const itemStats = new Map();

    // Process all completed orders to calculate top selling items
    const completedPaidOrders = orders.filter(order => 
      order.status === 'served' && order.paymentStatus === 'paid'
    );

    completedPaidOrders.forEach(order => {
      order.items.forEach(item => {
        const key = item.menuItemId;
        const current = itemStats.get(key) || { 
          item: item.menuItem, 
          quantity: 0, 
          revenue: 0 
        };
        itemStats.set(key, {
          ...current,
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + item.totalPrice
        });
      });
    });

    return Array.from(itemStats.values())
      .sort((a, b) => b.quantity - a.quantity) // Sort by quantity sold
      .slice(0, 3); // Top 3 items
  })();

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to {restaurantName} management system
          </p>
        </div>
        
        {/* Stats */}
        <DashboardStats config={activeConfig} stats={stats} />
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders 
            config={activeConfig} 
            orders={orders.slice(0, 5)} 
            onViewAll={() => onNavigate('orders')} 
          />
          
          <TopSellingItems config={activeConfig} items={topSellingItems} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;