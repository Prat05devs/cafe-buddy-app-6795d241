import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, ShoppingCart, X, Menu } from 'lucide-react';
import { MenuItem, Category, Table, OrderItem } from '@/types/restaurant';
import { getLocalizedText } from '@/lib/helpers';
import { useToast } from '@/hooks/use-toast';

interface OrderCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: {
    tableId?: string;
    type: 'dine-in' | 'takeaway' | 'delivery';
    items: OrderItem[];
    customerName?: string;
    customerPhone?: string;
  }) => void;
  menuItems: MenuItem[];
  categories: Category[];
  tables: Table[];
  selectedTable?: Table;
  language: string;
}

export const OrderCreation: React.FC<OrderCreationProps> = ({
  isOpen,
  onClose,
  onSubmit,
  menuItems,
  categories,
  tables,
  selectedTable,
  language = 'en'
}) => {
  const { toast } = useToast();
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [selectedTableId, setSelectedTableId] = useState<string>(selectedTable?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentView, setCurrentView] = useState<'menu' | 'cart'>('menu');

  useEffect(() => {
    if (selectedTable) {
      setSelectedTableId(selectedTable.id);
      setOrderType('dine-in');
    }
  }, [selectedTable]);

  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.menuItemId === menuItem.id 
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      const newOrderItem: OrderItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItemId: menuItem.id,
        menuItem,
        quantity: 1,
        price: menuItem.price,
        totalPrice: menuItem.price,
      };
      setCart([...cart, newOrderItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price }
          : item
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleSubmit = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to create an order",
        variant: "destructive",
      });
      return;
    }

    if (orderType === 'dine-in' && !selectedTableId) {
      toast({
        title: "Table Required",
        description: "Please select a table for dine-in orders",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      tableId: orderType === 'dine-in' ? selectedTableId : undefined,
      type: orderType,
      items: cart,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
    });

    // Reset form
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    onClose();
  };

  const handleClose = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] w-full p-0 overflow-hidden">
        <DialogHeader className="p-3 sm:p-6 pb-0">
          <div className="flex flex-col gap-3">
            <DialogTitle className="text-lg sm:text-2xl">
              {language === 'hi' ? 'नया ऑर्डर बनाएं' : 'Create New Order'}
            </DialogTitle>
            
            {/* Mobile Toggle Buttons */}
            <div className="flex gap-2 lg:hidden">
              <Button
                variant={currentView === 'menu' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('menu')}
                className="flex-1"
              >
                <Menu className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'मेन्यू' : 'Menu'}
              </Button>
              <Button
                variant={currentView === 'cart' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('cart')}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'कार्ट' : 'Cart'}
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Menu Section */}
          <div className={`flex-1 p-3 sm:p-6 ${currentView === 'cart' ? 'hidden lg:block' : 'block'}`}>
            <div className="space-y-4">
              {/* Order Type & Table Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-sm">{language === 'hi' ? 'ऑर्डर प्रकार' : 'Order Type'}</Label>
                  <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dine-in">{language === 'hi' ? 'डाइन-इन' : 'Dine-in'}</SelectItem>
                      <SelectItem value="takeaway">{language === 'hi' ? 'टेकअवे' : 'Takeaway'}</SelectItem>
                      <SelectItem value="delivery">{language === 'hi' ? 'डिलीवरी' : 'Delivery'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orderType === 'dine-in' && (
                  <div>
                    <Label className="text-sm">{language === 'hi' ? 'टेबल चुनें' : 'Select Table'}</Label>
                    <Select value={selectedTableId} onValueChange={setSelectedTableId}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder={language === 'hi' ? 'टेबल चुनें' : 'Choose table'} />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.filter(t => t.status === 'available').map((table) => (
                          <SelectItem key={table.id} value={table.id}>
                            {language === 'hi' ? 'टेबल' : 'Table'} {table.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Customer Info for non-dine-in orders */}
              {orderType !== 'dine-in' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm">{language === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}</Label>
                    <Input 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={language === 'hi' ? 'नाम दर्ज करें' : 'Enter name'}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">{language === 'hi' ? 'फोन नंबर' : 'Phone Number'}</Label>
                    <Input 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={language === 'hi' ? 'फोन नंबर दर्ज करें' : 'Enter phone number'}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <div className="overflow-x-auto">
                  <TabsList className="grid w-full min-w-max" style={{ gridTemplateColumns: `repeat(${categories.length + 1}, 1fr)` }}>
                    <TabsTrigger value="" className="text-xs sm:text-sm whitespace-nowrap">{language === 'hi' ? 'सभी' : 'All'}</TabsTrigger>
                    {categories.map((category) => (
                      <TabsTrigger key={category.id} value={category.name} className="text-xs sm:text-sm whitespace-nowrap">
                        {getLocalizedText(category.name, language)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value={selectedCategory} className="mt-4">
                  <ScrollArea className="h-60 sm:h-96">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pr-2">
                      {filteredMenuItems.filter(item => item.available).map((item) => (
                        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow w-full">
                          <CardContent className="p-3">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-medium text-sm flex-1 line-clamp-2">{getLocalizedText(item.name, language)}</h4>
                                <Badge variant="secondary" className="text-xs shrink-0">₹{item.price}</Badge>
                              </div>
                              
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {getLocalizedText(item.description, language)}
                                </p>
                              )}
                              
                              <Button 
                                onClick={() => addToCart(item)}
                                size="sm" 
                                className="w-full text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {language === 'hi' ? 'जोड़ें' : 'Add'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Cart Section */}
          <div className={`w-full lg:w-80 border-t lg:border-l lg:border-t-0 bg-muted/20 p-3 sm:p-6 ${currentView === 'menu' ? 'hidden lg:block' : 'block'}`}>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <h3 className="font-semibold text-sm sm:text-base">
                  {language === 'hi' ? 'ऑर्डर सारांश' : 'Order Summary'}
                </h3>
                <Badge variant="secondary" className="text-xs">{cart.length}</Badge>
              </div>

              <Separator />

              <ScrollArea className="h-48 sm:h-96">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4 sm:py-8 text-sm">
                    {language === 'hi' ? 'कार्ट खाली है' : 'Cart is empty'}
                  </p>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {cart.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-2 sm:p-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h5 className="font-medium text-xs sm:text-sm">
                                {getLocalizedText(item.menuItem.name, language)}
                              </h5>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="h-6 w-6 sm:h-8 sm:w-8"
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 sm:w-8 text-center text-xs sm:text-sm">{item.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="font-medium text-xs sm:text-sm">₹{item.totalPrice}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {cart.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between font-semibold text-base sm:text-lg">
                      <span>{language === 'hi' ? 'कुल' : 'Total'}</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-3 sm:p-6 pt-0">
          <Button variant="outline" onClick={handleClose} className="text-sm">
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmit} disabled={cart.length === 0} className="text-sm">
            {language === 'hi' ? 'ऑर्डर बनाएं' : 'Create Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};