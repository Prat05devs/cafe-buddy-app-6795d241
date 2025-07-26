import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { TopBar } from '@/components/common/TopBar';
import { Sidebar } from '@/components/common/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { getLocalizedText } from '@/lib/helpers';

export const RestaurantApp = () => {
  const { config, loading } = useRestaurant();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  
  const restaurantName = config ? getLocalizedText(config.restaurantName, config.language || 'en') : 'Restaurant';
  
  // Show loading screen while data is being loaded
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Restaurant Data...</h2>
          <p className="text-muted-foreground">Please wait while we set up your restaurant</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-background overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed}
        activePage={activePage}
        onNavigate={handleNavigate}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          restaurantName={restaurantName}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};