import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { TopBar } from './common/TopBar';
import { Dashboard } from './Dashboard';
import { MenuManagement } from './MenuManagement';
import { OrderManagement } from './OrderManagement';
import { TableManagement } from './TableManagement';
import { OrderCreation } from './OrderCreation';
import { TableOrderDetails } from './TableOrderDetails';
import Reports from './Reports';
import { Settings } from './Settings';
import { useRestaurant } from '@/contexts/RestaurantContext';
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
    language,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    updateOrderStatus,
    addOrder,
    updateTableStatus,
    setLanguage
  } = useRestaurant();
  
  const restaurantName = config ? getLocalizedText(config.restaurantName, language) : 'Restaurant';
  
  // Show loading screen while data is being loaded
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">
            {language === 'hi' ? 'रेस्तरां डेटा लोड हो रहा है...' : 'Loading Restaurant Data...'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'hi' ? 'कृपया प्रतीक्षा करें जब तक हम आपका रेस्तरां सेटअप करते हैं' : 'Please wait while we set up your restaurant'}
          </p>
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
        title: language === 'hi' ? 'ऑर्डर बनाया गया' : 'Order Created',
        description: language === 'hi' ? 'नया ऑर्डर सफलतापूर्वक बनाया गया है।' : 'New order has been created successfully.',
      });
    } catch (error) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'ऑर्डर बनाने में विफल। कृपया पुनः प्रयास करें।' : 'Failed to create order. Please try again.',
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
      title: language === 'hi' ? 'ऑर्डर विवरण' : 'Order Details',
      description: language === 'hi' ? `ऑर्डर #${order.orderNumber} का विवरण देख रहे हैं` : `Viewing details for order #${order.orderNumber}`,
    });
  };

  const handlePrintOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Implement print functionality
      toast({
        title: language === 'hi' ? 'ऑर्डर प्रिंट करें' : 'Print Order',
        description: language === 'hi' ? `ऑर्डर #${order.orderNumber} प्रिंट हो रहा है` : `Printing order #${order.orderNumber}`,
      });
      // You can add actual print logic here
      window.print();
    }
  };

  const handleRefreshOrders = () => {
    toast({
      title: language === 'hi' ? 'ऑर्डर रीफ्रेश किए गए' : 'Orders Refreshed',
      description: language === 'hi' ? 'ऑर्डर सूची अपडेट हो गई है।' : 'Order list has been updated.',
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
                title: language === 'hi' ? 'आइटम जोड़ें' : 'Add Item',
                description: language === 'hi' ? 'आइटम जोड़ने की सुविधा यहाँ खुलेगी।' : 'Add item functionality would open here.',
              });
            }}
            onEditItem={(item) => {
              toast({
                title: language === 'hi' ? 'आइटम संपादित करें' : 'Edit Item',
                description: language === 'hi' ? `${item.name} संपादित करने की सुविधा यहाँ खुलेगी।` : `Edit ${item.name} functionality would open here.`,
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
            language={language}
            onLanguageChange={(newLanguage) => {
              setLanguage(newLanguage);
              toast({
                title: newLanguage === 'hi' ? 'भाषा बदली गई' : 'Language Changed',
                description: newLanguage === 'hi' ? `भाषा हिंदी में बदल दी गई` : `Language changed to English`,
              });
            }}
            onSettingsUpdate={(settings) => {
              toast({
                title: language === 'hi' ? 'सेटिंग्स अपडेट हुईं' : 'Settings Updated',
                description: language === 'hi' ? 'सेटिंग्स सफलतापूर्वक सेव हो गई हैं' : 'Settings have been saved successfully.',
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
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
          language={language}
        />
        
        <TableOrderDetails
          isOpen={showTableDetails}
          onClose={() => {
            setShowTableDetails(false);
            setSelectedTable(null);
          }}
          table={selectedTable}
          orders={selectedTable ? (tableOrders[selectedTable.id] || []) : []}
          language={language}
          onUpdateOrderStatus={updateOrderStatus}
          onAddOrder={handleCreateOrder}
        />
      </div>
    </div>
  );
};