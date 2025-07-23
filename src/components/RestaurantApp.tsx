import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/AppSidebar';
import { TopBar } from './common/TopBar';
import { Dashboard } from './Dashboard';
import { MenuManagement } from './MenuManagement';
import OrderManagement from './OrderManagement';
import TableManagement from './TableManagement';
import { OrderCreation } from './OrderCreation';
import { TableOrderDetails } from './TableOrderDetails';
import { Settings } from './Settings';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { useToast } from '@/hooks/use-toast';
import { MenuItem, Order, Table, OrderItem } from '@/types/restaurant';
import { RestaurantConfig } from '@/lib/config';

export const RestaurantApp: React.FC = () => {
  const [language, setLanguage] = useState<string>('en');
  const [isOrderCreationOpen, setIsOrderCreationOpen] = useState(false);
  const [isTableDetailsOpen, setIsTableDetailsOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const { toast } = useToast();
  
  const {
    restaurant,
    categories,
    menuItems,
    tables,
    orders,
    dashboardStats,
    tableOrders,
    loading,
    config,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    updateOrderStatus,
    addOrder,
    updateTableStatus,
  } = useRestaurantData();
  
  // Show loading state if data is still being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading Restaurant Data...</h2>
        </div>
      </div>
    );
  }

  // Use the config loaded from data.json directly
  // If config wasn't loaded successfully, create a fallback
  const restaurantConfig = config || {
    restaurantName: restaurant.name,
    logo: '',
    address: restaurant.address,
    phone: restaurant.phone,
    email: restaurant.email,
    language: restaurant.settings.language,
    currency: restaurant.currency,
    gstRate: restaurant.taxRate,
    theme: restaurant.settings.theme as 'light' | 'dark' | 'auto',
    menu: menuItems.map(item => ({
      id: parseInt(item.id),
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      available: item.available,
      veg: true,
    })),
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '🍽️',
      order: cat.displayOrder,
    })),
    staff: [
      {
        id: 1,
        name: 'Jordan Smith',
        role: 'manager',
        pin: '1234',
        active: true,
      }
    ],
    tables: tables.map(table => ({
      id: parseInt(table.id.replace('table-', '')),
      name: table.number,
      capacity: table.capacity,
      floor: table.floor,
      status: table.status,
    })),
    features: {
      inventory: restaurant.settings.enableInventory,
      tableManagement: restaurant.settings.enableTableManagement,
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
      autoCalculateTax: restaurant.settings.autoCalculateTax,
      defaultPaymentMethod: restaurant.settings.defaultPaymentMethod,
      printBillAutomatically: false,
      soundNotifications: false,
      roundOffBills: true,
      showItemImages: true,
      compactMode: false,
      greeting: 'Welcome to ' + restaurant.name,
      footer: 'Thank you for your visit!',
    },
    inventory: [],
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  };

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
    setSelectedTable(table);
    setIsTableDetailsOpen(true);
  };

  const handleAddTableOrder = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    setSelectedTable(table || null);
    setIsOrderCreationOpen(true);
  };

  const handleCleanTable = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    const newStatus = table?.status === 'cleaning' ? 'available' : 'cleaning';
    updateTableStatus(tableId, newStatus);
    toast({
      title: newStatus === 'cleaning' ? (language === 'hi' ? 'सफाई शुरू की गई' : 'Cleaning Started') : (language === 'hi' ? 'टेबल तैयार' : 'Table Ready'),
      description: `${language === 'hi' ? 'टेबल' : 'Table'} ${table?.number} ${newStatus === 'cleaning' ? (language === 'hi' ? 'साफ की जा रही है' : 'is being cleaned') : (language === 'hi' ? 'अब उपलब्ध है' : 'is now available')}`,
    });
  };

  const handleViewTableOrders = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    setSelectedTable(table || null);
    setIsTableDetailsOpen(true);
  };

  // Order Creation Handler
  const handleCreateOrder = (orderData: {
    tableId?: string;
    type: 'dine-in' | 'takeaway' | 'delivery';
    items: OrderItem[];
    customerName?: string;
    customerPhone?: string;
  }) => {
    const newOrder = {
      ...orderData,
      status: 'pending' as const,
      subtotal: orderData.items.reduce((sum, item) => sum + item.totalPrice, 0),
      tax: 0,
      discount: 0,
      total: orderData.items.reduce((sum, item) => sum + item.totalPrice, 0),
      paymentStatus: 'pending' as const,
    };

    // Calculate tax if enabled
    if (restaurantConfig.settings?.autoCalculateTax) {
      newOrder.tax = (newOrder.subtotal * restaurantConfig.gstRate) / 100;
      newOrder.total = newOrder.subtotal + newOrder.tax;
    }

    addOrder(newOrder);

    // Update table status if it's a dine-in order
    if (orderData.tableId && orderData.type === 'dine-in') {
      updateTableStatus(orderData.tableId, 'occupied');
    }

    toast({
      title: language === 'hi' ? 'ऑर्डर बनाया गया' : 'Order Created',
      description: language === 'hi' ? 'नया ऑर्डर सफलतापूर्वक बनाया गया' : 'New order created successfully',
    });

    setIsOrderCreationOpen(false);
  };

  // Language change handler
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  // Settings update handler
  const handleSettingsUpdate = (settings: Partial<RestaurantConfig>) => {
    toast({
      title: language === 'hi' ? 'सेटिंग्स अपडेट हुईं' : 'Settings Updated',
      description: language === 'hi' ? 'सेटिंग्स सफलतापूर्वक अपडेट हो गईं' : 'Settings updated successfully',
    });
  };

  // Menu Management Component with handlers
  const MenuManagementPage = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{language === 'hi' ? 'मेन्यू प्रबंधन' : 'Menu Management'}</h2>
        <button
          onClick={() => setIsOrderCreationOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {language === 'hi' ? 'त्वरित ऑर्डर' : 'Quick Order'}
        </button>
      </div>
      <MenuManagement
        items={menuItems}
        categories={categories}
        onAddItem={handleAddMenuItem}
        onEditItem={handleEditMenuItem}
        onDeleteItem={handleDeleteMenuItem}
        onToggleAvailability={handleToggleItemAvailability}
      />
    </div>
  );

  // Order Management Component with handlers
  const OrderManagementPage = () => (
    <OrderManagement
      orders={orders}
      onUpdateOrderStatus={handleUpdateOrderStatus}
      onViewOrderDetails={handleViewOrderDetails}
      onPrintOrder={handlePrintOrder}
      onRefreshOrders={handleRefreshOrders}
    />
  );

  // Table Management Component with handlers
  const TableManagementPage = () => (
    <TableManagement
      tables={tables}
      tableOrders={tableOrders}
      onSelectTable={handleSelectTable}
      onAddOrder={handleAddTableOrder}
      onCleanTable={handleCleanTable}
      onViewTableOrders={handleViewTableOrders}
    />
  );

  // Reports Page
  const ReportsPage = () => (
    <div className="bg-gradient-glass backdrop-blur-md border border-glass-border rounded-2xl p-12 text-center">
      <h3 className="text-lg font-semibold mb-2">Reports & Analytics</h3>
      <p className="text-muted-foreground">Coming soon - detailed sales reports and analytics</p>
    </div>
  );

  // Settings Page with handlers
  const SettingsPage = () => (
    <Settings
      config={restaurantConfig}
      onLanguageChange={handleLanguageChange}
      onSettingsUpdate={handleSettingsUpdate}
    />
  );

  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopBar
              config={restaurantConfig}
              currentUser="Jordan Smith"
              userRole="Manager"
            />
            
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-4 max-w-7xl">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/menu" element={<MenuManagementPage />} />
                  <Route path="/orders" element={<OrderManagementPage />} />
                  <Route path="/tables" element={<TableManagementPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>

        {/* Order Creation Modal */}
        <OrderCreation
          isOpen={isOrderCreationOpen}
          onClose={() => {
            setIsOrderCreationOpen(false);
            setSelectedTable(null);
          }}
          onSubmit={handleCreateOrder}
          menuItems={menuItems}
          categories={categories}
          tables={tables}
          selectedTable={selectedTable}
          language={language}
        />

        {/* Table Order Details Modal */}
        <TableOrderDetails
          isOpen={isTableDetailsOpen}
          onClose={() => {
            setIsTableDetailsOpen(false);
            setSelectedTable(null);
          }}
          table={selectedTable}
          orders={orders}
          language={language}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddOrder={handleAddTableOrder}
        />
        
        <Toaster />
      </SidebarProvider>
    </Router>
  );
};