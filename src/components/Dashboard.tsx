import React from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopSellingItems from '@/components/dashboard/TopSellingItems';
import { getLocalizedText } from '@/lib/helpers';

export const Dashboard = () => {
  const { config, orders, menuItems } = useRestaurant();
  
  const restaurantName = config ? getLocalizedText(config.restaurantName, config.language || 'en') : 'Restaurant';
  
  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we set up your restaurant</p>
        </div>
      </div>
    );
  }

  // Mock data for demo
  const stats = {
    todaySales: 12460.75,
    weekSales: 68250.50,
    pendingOrders: 3,
    completedOrders: 42,
    availableTables: 8,
    totalTables: 12
  };

  const topSellingItems = menuItems.length >= 3 ? [
    { 
      item: menuItems[0], 
      quantity: 24, 
      revenue: menuItems[0].price * 24 
    },
    { 
      item: menuItems[1], 
      quantity: 18, 
      revenue: menuItems[1].price * 18 
    },
    { 
      item: menuItems[2], 
      quantity: 15, 
      revenue: menuItems[2].price * 15 
    }
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to {restaurantName} management system
        </p>
      </div>
      
      {/* Stats */}
      <DashboardStats config={config} stats={stats} />
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders 
          config={config} 
          orders={orders.slice(0, 5)} 
          onViewAll={() => {}} 
        />
        
        <TopSellingItems config={config} items={topSellingItems} />
      </div>
    </div>
  );
};

export default Dashboard;