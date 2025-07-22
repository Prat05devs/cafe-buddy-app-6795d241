import React, { useState, useEffect } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TopBar } from '@/components/common/TopBar';
import { Sidebar } from '@/components/common/Sidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopSellingItems from '@/components/dashboard/TopSellingItems';

export const Dashboard = () => {
  const { config, orders } = useRestaurant();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  
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

  const topSellingItems = [
    { 
      item: config.menu[0], 
      quantity: 24, 
      revenue: config.menu[0].price * 24 
    },
    { 
      item: config.menu[1], 
      quantity: 18, 
      revenue: config.menu[1].price * 18 
    },
    { 
      item: config.menu[2], 
      quantity: 15, 
      revenue: config.menu[2].price * 15 
    }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  return (
    <div className="flex h-screen bg-gradient-background overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          config={config}
          activePage={activePage}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          config={config} 
          onToggleSidebar={toggleSidebar}
          currentUser={config.staff[0].name}
          userRole={config.staff[0].role}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to {config.restaurantName} management system
              </p>
            </div>
            
            {/* Stats */}
            <DashboardStats config={config} stats={stats} />
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders 
                config={config} 
                orders={orders.slice(0, 5)} 
                onViewAll={() => handleNavigate('orders')} 
              />
              
              <TopSellingItems config={config} items={topSellingItems} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;