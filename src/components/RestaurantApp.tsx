import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { TopBar } from '@/components/common/TopBar';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { MenuManagement } from '@/components/MenuManagement';
import { OrderManagement } from '@/components/OrderManagement';
import { TableManagement } from '@/components/TableManagement';
import { OrderCreation } from '@/components/OrderCreation';
import { TableOrderDetails } from '@/components/TableOrderDetails';
import Reports from '@/components/Reports';
import { Settings } from '@/components/Settings';
import { getLocalizedText } from '@/lib/helpers';
import { useToast } from '@/hooks/use-toast';
import { Table, Order, MenuItem } from '@/types/restaurant';

export const RestaurantApp = () => {
  const { config, loading } = useRestaurant();
  const [activePage, setActivePage] = useState('dashboard');
  const [showOrderCreation, setShowOrderCreation] = useState(false);
  const [showTableDetails, setShowTableDetails] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  
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

  const handleCreateOrder = (tableId?: string) => {
    if (tableId) {
      const table = tables.find(t => t.id === tableId);
      setSelectedTable(table || null);
    } else {
      setSelectedTable(null);
    }
    setShowOrderCreation(true);
  };

  const handleOrderSubmit = (orderData: any) => {
    try {
      addOrder(orderData);
      setShowOrderCreation(false);
      setSelectedTable(null);
      toast({
        title: "Order Created",
        description: "New order has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewTableOrders = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    setSelectedTable(table || null);
    setShowTableDetails(true);
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    // You can implement a separate order details modal here if needed
    toast({
      title: "Order Details",
      description: `Viewing details for order #${order.orderNumber}`,
    });
  };

  const handlePrintOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Implement print functionality
      toast({
        title: "Print Order",
        description: `Printing order #${order.orderNumber}`,
      });
      // You can add actual print logic here
      window.print();
    }
  };

  const handleRefreshOrders = () => {
    toast({
      title: "Orders Refreshed",
      description: "Order list has been updated.",
    });
    // The orders are already reactive from the context
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
            onAddItem={() => {
              toast({
                title: "Add Item",
                description: "Add item functionality would open here.",
              });
            }}
            onEditItem={(item) => {
              toast({
                title: "Edit Item",
                description: `Edit ${item.name} functionality would open here.`,
              });
            }}
            onDeleteItem={deleteMenuItem}
            onToggleAvailability={toggleMenuItemAvailability}
          />
        );
      
      case 'orders':
        return (
          <OrderManagement
            orders={orders}
            onUpdateOrderStatus={updateOrderStatus}
            onViewOrderDetails={handleViewOrderDetails}
            onPrintOrder={handlePrintOrder}
            onRefreshOrders={handleRefreshOrders}
          />
        );
      
      case 'tables':
        return (
          <TableManagement
            tables={tables}
            tableOrders={tableOrders}
            onSelectTable={(table) => handleViewTableOrders(table.id)}
            onAddOrder={handleCreateOrder}
            onCleanTable={(tableId) => updateTableStatus(tableId, 'available')}
            onViewTableOrders={handleViewTableOrders}
          />
        );
      
      case 'reports':
        return <Reports />;
      
      case 'settings':
        return (
          <Settings
            config={config}
            onLanguageChange={(language) => {
              toast({
                title: "Language Changed",
                description: `Language changed to ${language}`,
              });
            }}
            onSettingsUpdate={(settings) => {
              toast({
                title: "Settings Updated",
                description: "Settings have been saved successfully.",
              });
            }}
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
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
        
        {/* Modals */}
        <OrderCreation
          isOpen={showOrderCreation}
          onClose={() => {
            setShowOrderCreation(false);
            setSelectedTable(null);
          }}
          onSubmit={handleOrderSubmit}
          menuItems={menuItems}
          categories={categories}
          tables={tables}
          selectedTable={selectedTable}
          language={config?.language || 'en'}
        />
        
        <TableOrderDetails
          isOpen={showTableDetails}
          onClose={() => {
            setShowTableDetails(false);
            setSelectedTable(null);
          }}
          table={selectedTable}
          orders={selectedTable ? (tableOrders[selectedTable.id] || []) : []}
          language={config?.language || 'en'}
          onUpdateOrderStatus={updateOrderStatus}
          onAddOrder={handleCreateOrder}
        />
      </div>
    </div>
  );
};