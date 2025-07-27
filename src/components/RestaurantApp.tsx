import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { TopBar } from '@/components/common/TopBar';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { MenuManagement } from '@/components/MenuManagement';
import { OrderManagement } from '@/components/OrderManagement';
import { TableManagement } from '@/components/TableManagement';
import Reports from '@/components/Reports';
import { Settings } from '@/components/Settings';
import { getLocalizedText } from '@/lib/helpers';

export const RestaurantApp = () => {
  const { config, loading } = useRestaurant();
  const [activePage, setActivePage] = useState('dashboard');
  
  // Move useRestaurant call to top level to avoid hooks order violation
  const { 
    menuItems, 
    categories, 
    orders, 
    tables, 
    tableOrders,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    updateOrderStatus,
    addOrder,
    updateTableStatus
  } = useRestaurant();
  
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

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      
      case 'menu':
        return (
          <MenuManagement
            items={menuItems}
            categories={categories}
            onAddItem={() => {/* TODO: Implement add item modal */}}
            onEditItem={(item) => {/* TODO: Implement edit item modal */}}
            onDeleteItem={deleteMenuItem}
            onToggleAvailability={toggleMenuItemAvailability}
          />
        );
      
      case 'orders':
        return (
          <OrderManagement
            orders={orders}
            onUpdateOrderStatus={updateOrderStatus}
            onViewOrderDetails={(order) => {/* TODO: Implement order details modal */}}
            onPrintOrder={(orderId) => {/* TODO: Implement print functionality */}}
            onRefreshOrders={() => {/* TODO: Implement refresh */}}
          />
        );
      
      case 'tables':
        return (
          <TableManagement
            tables={tables}
            tableOrders={tableOrders}
            onSelectTable={(table) => {/* TODO: Implement table selection */}}
            onAddOrder={(tableId) => {/* TODO: Implement add order for table */}}
            onCleanTable={(tableId) => updateTableStatus(tableId, 'available')}
            onViewTableOrders={(tableId) => {/* TODO: Implement table orders view */}}
          />
        );
      
      case 'reports':
        return <Reports />;
      
      case 'settings':
        return (
          <Settings
            config={config}
            onLanguageChange={(language) => {/* TODO: Implement language change */}}
            onSettingsUpdate={(settings) => {/* TODO: Implement settings update */}}
          />
        );
      
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="flex flex-col">
        <TopBar 
          config={config}
        />
        
        <Navigation 
          currentView={activePage}
          onViewChange={handleNavigate}
          config={config}
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
        />
        
        <main className="flex-1">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};