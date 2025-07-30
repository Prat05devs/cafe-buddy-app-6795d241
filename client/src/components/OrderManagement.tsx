import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Eye,
  Printer,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { Order, OrderItem } from '@/types/restaurant';
import { getLocalizedText } from '@/lib/helpers';

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onViewOrderDetails: (order: Order) => void;
  onPrintOrder: (orderId: string) => void;
  onRefreshOrders: () => void;
  language?: string;
}

export const OrderManagement = ({
  orders,
  onUpdateOrderStatus,
  onViewOrderDetails,
  onPrintOrder,
  onRefreshOrders,
  language = 'en'
}) => {
  const [selectedTab, setSelectedTab] = useState('all');

  const getOrdersByStatus = (status?: Order['status']) => {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };

  const getStatusCount = (status?: Order['status']) => {
    return getOrdersByStatus(status).length;
  };

  const statusTabs = [
    { value: 'all', label: `All Orders (${orders.length})`, color: 'default' },
    { value: 'pending', label: `Pending (${getStatusCount('pending')})`, color: 'warning' },
    { value: 'preparing', label: `Preparing (${getStatusCount('preparing')})`, color: 'default' },
    { value: 'ready', label: `Ready (${getStatusCount('ready')})`, color: 'success' },
    { value: 'served', label: `Served (${getStatusCount('served')})`, color: 'secondary' },
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Order Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Track and manage all orders</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={onRefreshOrders} size="sm" className="flex-1 sm:flex-none">
            <RefreshCw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Order</span>
          </Button>
        </div>
      </div>

      {/* Order Status Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full min-w-max" style={{ gridTemplateColumns: `repeat(${statusTabs.length}, 1fr)` }}>
            {statusTabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-6">
          {statusTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <OrderList
                orders={tab.value === 'all' ? orders : getOrdersByStatus(tab.value as Order['status'])}
                onUpdateStatus={onUpdateOrderStatus}
                onViewDetails={onViewOrderDetails}
                onPrintOrder={onPrintOrder}
                language={language}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onViewDetails: (order: Order) => void;
  onPrintOrder: (orderId: string) => void;
  language: string;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onUpdateStatus,
  onViewDetails,
  onPrintOrder,
  language
}) => {
  if (orders.length === 0) {
    return (
      <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-12 text-center">
        <div className="text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No orders found</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map(order => (
        <OrderCard
          key={order.id}
          order={order}
          onUpdateStatus={onUpdateStatus}
          onViewDetails={onViewDetails}
          onPrintOrder={onPrintOrder}
          language={language}
        />
      ))}
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onViewDetails: (order: Order) => void;
  onPrintOrder: (orderId: string) => void;
  language: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  onViewDetails,
  onPrintOrder,
  language
}) => {
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    // Add safety check for undefined status
    if (!currentStatus) return 'pending';
    
    const statusFlow: Record<Order['status'], Order['status'] | null> = {
      'pending': 'preparing',
      'preparing': 'ready',
      'ready': 'served',
      'served': null,
      'cancelled': null
    };
    return statusFlow[currentStatus];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'warning',
      preparing: 'default',
      ready: 'success',
      served: 'secondary',
      cancelled: 'destructive'
    };
    return colors[status] as 'warning' | 'default' | 'success' | 'secondary' | 'destructive';
  };

  const nextStatus = getNextStatus(order.status);
  const timeSinceCreated = Date.now() - new Date(order.createdAt || new Date()).getTime();
  const minutesAgo = Math.floor(timeSinceCreated / 60000);

  // Safety checks for order data
  const safeOrder = {
    ...order,
    status: order.status || 'pending',
    customerName: order.customerName || 'Unknown',
    total: order.total || 0,
    paymentStatus: order.paymentStatus || 'pending',
    items: order.items || []
  };

  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-3 sm:p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Order Info */}
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-3">
            <div className="bg-gradient-primary p-2 rounded-lg text-primary-foreground font-bold text-sm">
              #{order.orderNumber || 'N/A'}
            </div>
            <Badge variant={getStatusColor(safeOrder.status)} className="text-xs">
              {safeOrder.status.charAt(0).toUpperCase() + safeOrder.status.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {order.type?.charAt(0).toUpperCase() + order.type?.slice(1) || 'Unknown'}
            </Badge>
            {order.table && (
              <Badge variant="secondary" className="text-xs">
                Table {order.table.number}
              </Badge>
            )}
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground mb-2">
            <span>{minutesAgo} minutes ago</span>
            {safeOrder.customerName && safeOrder.customerName !== 'Unknown' && <span> • {safeOrder.customerName}</span>}
            {order.customerPhone && <span className="hidden sm:inline"> • {order.customerPhone}</span>}
          </div>

          <div className="space-y-1">
            {safeOrder.items.slice(0, 3).map((item, index) => (
              <div key={item.id || index} className="flex items-center justify-between text-xs sm:text-sm">
                <span className="truncate">{item.quantity || 1}x {getLocalizedText(item.menuItem?.name || 'Unknown Item', language)}</span>
                <span className="text-muted-foreground">₹{item.totalPrice || 0}</span>
              </div>
            ))}
            {safeOrder.items.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{safeOrder.items.length - 3} more items
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="font-semibold text-sm sm:text-base">Total: ₹{safeOrder.total}</span>
            <Badge variant={safeOrder.paymentStatus === 'paid' ? 'success' : 'warning'} className="text-xs">
              {safeOrder.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          {nextStatus && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, nextStatus)}
              className="flex-1 text-xs sm:text-sm"
            >
              {nextStatus === 'preparing' && (language === 'hi' ? 'तैयारी शुरू करें' : 'Start Preparing')}
              {nextStatus === 'ready' && (language === 'hi' ? 'तैयार के रूप में चिह्नित करें' : 'Mark Ready')}
              {nextStatus === 'served' && (language === 'hi' ? 'परोसा के रूप में चिह्नित करें' : 'Mark Served')}
            </Button>
          )}
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order)}
              className="flex-1 sm:flex-none"
            >
              <Eye className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">{language === 'hi' ? 'देखें' : 'View'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrintOrder(order.id)}
              className="flex-1 sm:flex-none"
            >
              <Printer className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderManagement;