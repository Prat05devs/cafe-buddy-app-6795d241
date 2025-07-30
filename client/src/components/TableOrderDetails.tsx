
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, DollarSign, User, Phone, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import { Table, Order, OrderItem } from '@/types/restaurant';
import { getLocalizedText } from '@/lib/helpers';

interface TableOrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  orders: Order[];
  language: string;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onAddOrder: (tableId: string) => void;
}

export const TableOrderDetails = ({
  isOpen,
  onClose,
  table,
  orders,
  language = 'en',
  onUpdateOrderStatus,
  onAddOrder
}) => {
  if (!table) return null;

  const tableOrders = orders.filter(order => order.tableId === table.id);
  const activeOrders = tableOrders.filter(order => order.status !== 'served' && order.status !== 'cancelled');
  const totalAmount = tableOrders.reduce((sum, order) => sum + order.total, 0);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Order['status']) => {
    if (language === 'hi') {
      switch (status) {
        case 'pending': return 'प्रतीक्षारत';
        case 'preparing': return 'तैयार हो रहा';
        case 'ready': return 'तैयार';
        case 'served': return 'परोसा गया';
        case 'cancelled': return 'रद्द';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {language === 'hi' ? 'टेबल' : 'Table'} {table.number}
            <Badge 
              variant="secondary" 
              className={`ml-2 ${
                table.status === 'available' ? 'bg-green-100 text-green-800' :
                table.status === 'occupied' ? 'bg-red-100 text-red-800' :
                table.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}
            >
              {language === 'hi' ? (
                table.status === 'available' ? 'उपलब्ध' :
                table.status === 'occupied' ? 'व्यस्त' :
                table.status === 'reserved' ? 'आरक्षित' : 'सफाई'
              ) : (
                table.status.charAt(0).toUpperCase() + table.status.slice(1)
              )}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Table Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {language === 'hi' ? 'क्षमता' : 'Capacity'}
                    </p>
                    <p className="text-2xl font-bold">{table.capacity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {language === 'hi' ? 'सक्रिय ऑर्डर' : 'Active Orders'}
                    </p>
                    <p className="text-2xl font-bold">{activeOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {language === 'hi' ? 'कुल राशि' : 'Total Amount'}
                    </p>
                    <p className="text-2xl font-bold">₹{totalAmount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={() => onAddOrder(table.id)}
              className="flex-1"
            >
              {language === 'hi' ? 'नया ऑर्डर जोड़ें' : 'Add New Order'}
            </Button>
          </div>

          <Separator />

          {/* Orders List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'hi' ? 'ऑर्डर' : 'Orders'}
            </h3>
            
            {tableOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {language === 'hi' ? 'कोई ऑर्डर नहीं मिला' : 'No orders found'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {tableOrders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {language === 'hi' ? 'ऑर्डर' : 'Order'} #{order.orderNumber}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatTime(order.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        {order.customerName && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {order.customerName}
                            {order.customerPhone && (
                              <>
                                <Phone className="h-4 w-4 ml-2" />
                                {order.customerPhone}
                              </>
                            )}
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          {/* Order Items */}
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <span>
                                  {item.quantity}x {getLocalizedText(item.menuItem.name, language)}
                                </span>
                                <span>₹{item.totalPrice}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Separator />
                          
                          {/* Order Total */}
                          <div className="flex justify-between font-semibold">
                            <span>{language === 'hi' ? 'कुल' : 'Total'}</span>
                            <span>₹{order.total}</span>
                          </div>
                          
                          {/* Status Actions */}
                          {order.status !== 'served' && order.status !== 'cancelled' && (
                            <div className="flex gap-2 mt-4">
                              {order.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                                  className="flex-1"
                                >
                                  <PlayCircle className="h-4 w-4 mr-1" />
                                  {language === 'hi' ? 'तैयार करना शुरू करें' : 'Start Preparing'}
                                </Button>
                              )}
                              
                              {order.status === 'preparing' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {language === 'hi' ? 'तैयार है' : 'Mark Ready'}
                                </Button>
                              )}
                              
                              {order.status === 'ready' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => onUpdateOrderStatus(order.id, 'served')}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {language === 'hi' ? 'परोस दिया' : 'Mark Served'}
                                </Button>
                              )}
                              
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};