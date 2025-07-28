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
    if (isOpen) {
      if (selectedTable) {
        setSelectedTableId(selectedTable.id);
        setOrderType('dine-in');
      } else {
        setSelectedTableId('');
        setOrderType('dine-in'); // Or your preferred default
      }
    } else {
      // Reset state when modal closes
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
    }
  }, [isOpen, selectedTable]);

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory)
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
        title: language === 'hi' ? 'खाली कार्ट' : 'Empty Cart', 
        description: language === 'hi' ? 'ऑर्डर बनाने के लिए कृपया आइटम जोड़ें' : 'Please add items to create an order', 
        variant: "destructive" 
      });
      return;
    }
    if (orderType === 'dine-in' && !selectedTableId) {
      toast({ 
        title: language === 'hi' ? 'टेबल आवश्यक' : 'Table Required', 
        description: language === 'hi' ? 'डाइन-इन ऑर्डर के लिए कृपया एक टेबल चुनें' : 'Please select a table for dine-in orders', 
        variant: "destructive" 
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[95vw] md:max-w-4xl lg:max-w-6xl h-[100vh] sm:h-auto sm:max-h-[95vh] w-full p-0 flex flex-col rounded-none sm:rounded-lg">
        <DialogHeader className="p-4 sm:p-6 pb-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <div className="flex flex-col gap-3">
            <DialogTitle className="text-xl sm:text-2xl font-semibold">
              {language === 'hi' ? 'नया ऑर्डर बनाएं' : 'Create New Order'}
            </DialogTitle>
            <div className="flex gap-2 lg:hidden">
              <Button variant={currentView === 'menu' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('menu')} className="flex-1 h-10">
                <Menu className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'मेन्यू' : 'Menu'}
              </Button>
              <Button variant={currentView === 'cart' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('cart')} className="flex-1 h-10 relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'कार्ट' : 'Cart'}
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs min-w-[20px] h-5">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Menu Section */}
          <div className={`flex-1 flex flex-col overflow-hidden ${currentView === 'cart' ? 'hidden lg:flex' : 'flex'}`}>
            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{language === 'hi' ? 'ऑर्डर प्रकार' : 'Order Type'}</Label>
                    <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                      <SelectTrigger className="text-sm h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dine-in">{language === 'hi' ? 'डाइन-इन' : 'Dine-in'}</SelectItem>
                        <SelectItem value="takeaway">{language === 'hi' ? 'टेकअवे' : 'Takeaway'}</SelectItem>
                        <SelectItem value="delivery">{language === 'hi' ? 'डिलीवरी' : 'Delivery'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {orderType === 'dine-in' && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">{language === 'hi' ? 'टेबल चुनें' : 'Select Table'}</Label>
                      <Select value={selectedTableId} onValueChange={setSelectedTableId}>
                        <SelectTrigger className="text-sm h-10"><SelectValue placeholder={language === 'hi' ? 'टेबल चुनें' : 'Choose table'} /></SelectTrigger>
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
                
                {orderType !== 'dine-in' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">{language === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}</Label>
                      <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={language === 'hi' ? 'नाम दर्ज करें' : 'Enter name'} className="text-sm h-10" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">{language === 'hi' ? 'फोन नंबर' : 'Phone Number'}</Label>
                      <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder={language === 'hi' ? 'फोन नंबर दर्ज करें' : 'Enter phone number'} className="text-sm h-10" />
                    </div>
                  </div>
                )}

                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex flex-col">
                  <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <TabsList className="h-10">
                      <TabsTrigger value="">{language === 'hi' ? 'सभी' : 'All'}</TabsTrigger>
                      {categories.map((category) => (
                        <TabsTrigger key={category.id} value={category.name.toLowerCase().replace(/\s+/g, '-')}>
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </ScrollArea>
                  
                  <TabsContent value={selectedCategory} className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                      {filteredMenuItems.filter(item => item.available).map((item) => (
                        <Card key={item.id} onClick={() => addToCart(item)} className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] w-full">
                          <CardContent className="p-3 sm:p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-medium text-sm sm:text-base flex-1 line-clamp-2 leading-snug">
                                  {getLocalizedText(item.name, language)}
                                </h4>
                                <Badge variant="secondary" className="text-xs font-semibold shrink-0 px-2 py-1">
                                  ₹{item.price}
                                </Badge>
                              </div>
                              {item.description && (
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                  {getLocalizedText(item.description, language)}
                                </p>
                              )}
                              <Button size="sm" className="w-full text-xs sm:text-sm h-8 sm:h-9 font-medium" tabIndex={-1}>
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                                {language === 'hi' ? 'जोड़ें' : 'Add'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </div>

          {/* Cart Section */}
          <div className={`w-full lg:w-80 xl:w-96 border-t lg:border-l lg:border-t-0 bg-muted/30 flex flex-col overflow-hidden ${currentView === 'menu' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 sm:p-6 flex items-center gap-2 border-b flex-shrink-0">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              <h3 className="font-semibold text-sm sm:text-base">{language === 'hi' ? 'ऑर्डर सारांश' : 'Order Summary'}</h3>
              <Badge variant="secondary" className="text-xs min-w-[20px] h-5">{cart.length}</Badge>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-sm sm:text-base">{language === 'hi' ? 'कार्ट खाली है' : 'Cart is empty'}</p>
                    <p className="text-muted-foreground/70 text-xs mt-1">{language === 'hi' ? 'आइटम जोड़ना शुरू करें' : 'Start adding items'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <Card key={item.id} className="transition-all duration-200 hover:shadow-sm">
                        <CardContent className="p-3 sm:p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <h5 className="font-medium text-sm sm:text-base line-clamp-2 flex-1">
                                {getLocalizedText(item.menuItem.name, language)}
                              </h5>
                              <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="h-7 w-7 shrink-0 hover:bg-destructive/10 hover:text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 hover:bg-muted">
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 hover:bg-muted">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="font-semibold text-sm sm:text-base">₹{item.totalPrice}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {cart.length > 0 && (
              <div className="p-4 sm:p-6 border-t bg-background/95 flex-shrink-0">
                <div className="flex justify-between items-center font-semibold text-base sm:text-lg">
                  <span>{language === 'hi' ? 'कुल' : 'Total'}</span>
                  <span className="text-lg sm:text-xl">₹{calculateTotal()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 pt-3 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <Button variant="outline" onClick={onClose} className="text-sm h-10 flex-1 sm:flex-none">{language === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
            <Button onClick={handleSubmit} disabled={cart.length === 0} className="text-sm h-10 flex-1 sm:flex-none">{language === 'hi' ? 'ऑर्डर बनाएं' : 'Create Order'}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};