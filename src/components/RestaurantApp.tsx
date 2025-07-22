import React, { useState } from 'react';
import { Navigation, TopBar } from './Navigation';
import { Dashboard } from './Dashboard';
import { MenuManagement } from './MenuManagement';
import OrderManagement from './OrderManagement';
import TableManagement from './TableManagement';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { useToast } from '@/hooks/use-toast';
import { MenuItem, Order, Table } from '@/types/restaurant';

type ViewType = 'dashboard' | 'menu' | 'orders' | 'tables' | 'reports' | 'settings';

export const RestaurantApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { toast } = useToast();
  
  const {
    restaurant,
    categories,
    menuItems,
    tables,
    orders,
    dashboardStats,
    tableOrders,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    updateOrderStatus,
    addOrder,
    updateTableStatus,
  } = useRestaurantData();

  // Menu Management Handlers
  const handleAddMenuItem = () => {
    toast({
      title: "Add Menu Item",
      description: "Menu item form would open here",
    });
  };

  const handleEditMenuItem = (item: MenuItem) => {
    toast({
      title: "Edit Menu Item",
      description: `Editing ${item.name}`,
    });
  };

  const handleDeleteMenuItem = (itemId: string) => {
    deleteMenuItem(itemId);
    toast({
      title: "Menu Item Deleted",
      description: "Menu item has been removed",
      variant: "destructive",
    });
  };

  const handleToggleItemAvailability = (itemId: string) => {
    toggleMenuItemAvailability(itemId);
    const item = menuItems.find(i => i.id === itemId);
    toast({
      title: `Item ${item?.available ? 'Disabled' : 'Enabled'}`,
      description: `${item?.name} is now ${item?.available ? 'unavailable' : 'available'}`,
    });
  };

  // Order Management Handlers
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    const order = orders.find(o => o.id === orderId);
    toast({
      title: "Order Updated",
      description: `Order #${order?.orderNumber} marked as ${status}`,
    });
  };

  const handleViewOrderDetails = (order: Order) => {
    toast({
      title: "Order Details",
      description: `Viewing details for order #${order.orderNumber}`,
    });
  };

  const handlePrintOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    toast({
      title: "Print Order",
      description: `Printing order #${order?.orderNumber}`,
    });
  };

  const handleRefreshOrders = () => {
    toast({
      title: "Orders Refreshed",
      description: "Order list has been updated",
    });
  };

  // Table Management Handlers
  const handleSelectTable = (table: Table) => {
    toast({
      title: "Table Selected",
      description: `Selected table ${table.number}`,
    });
  };

  const handleAddTableOrder = (tableId: string) => {
    updateTableStatus(tableId, 'occupied');
    toast({
      title: "New Order",
      description: "Order creation form would open here",
    });
  };

  const handleCleanTable = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    const newStatus = table?.status === 'cleaning' ? 'available' : 'cleaning';
    updateTableStatus(tableId, newStatus);
    toast({
      title: newStatus === 'cleaning' ? 'Cleaning Started' : 'Table Ready',
      description: `Table ${table?.number} ${newStatus === 'cleaning' ? 'is being cleaned' : 'is now available'}`,
    });
  };

  const handleViewTableOrders = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    toast({
      title: "Table Orders",
      description: `Viewing orders for table ${table?.number}`,
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard />
            recentOrders={orders.slice(0, 5)}
            onViewOrders={() => setCurrentView('orders')}
          />
        );
      
      case 'menu':
        return (
          <MenuManagement
            items={menuItems}
            categories={categories}
            onAddItem={handleAddMenuItem}
            onEditItem={handleEditMenuItem}
            onDeleteItem={handleDeleteMenuItem}
            onToggleAvailability={handleToggleItemAvailability}
          />
        );
      
      case 'orders':
        return (
          <OrderManagement
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
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
            onSelectTable={handleSelectTable}
            onAddOrder={handleAddTableOrder}
            onCleanTable={handleCleanTable}
            onViewTableOrders={handleViewTableOrders}
          />
        );
      
      case 'reports':
        return (
          <div className="bg-gradient-glass backdrop-blur-md border border-glass-border rounded-2xl p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Reports & Analytics</h3>
            <p className="text-muted-foreground">Coming soon - detailed sales reports and analytics</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-gradient-glass backdrop-blur-md border border-glass-border rounded-2xl p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-muted-foreground">Coming soon - restaurant settings and configuration</p>
          </div>
        );
      
      default:
        return <Dashboard stats={dashboardStats} recentOrders={orders.slice(0, 5)} onViewOrders={() => setCurrentView('orders')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <TopBar
          restaurantName={restaurant.name}
          currentUser="Jordan Smith"
        />
        
        <Navigation
          currentView={currentView}
          onViewChange={(view) => setCurrentView(view as ViewType)}
        />
        
        <main className="pb-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};