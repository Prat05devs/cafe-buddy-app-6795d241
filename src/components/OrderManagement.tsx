import React, { useState } from 'react';
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

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onViewOrderDetails: (order: Order) => void;
  onPrintOrder: (orderId: string) => void;
  onRefreshOrders: () => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  onUpdateOrderStatus,
  onViewOrderDetails,
  onPrintOrder,
  onRefreshOrders
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-muted-foreground">Track and manage all orders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onRefreshOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Order Status Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${statusTabs.length}, 1fr)` }}>
          {statusTabs.map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="text-xs sm:text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          {statusTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <OrderList
                orders={tab.value === 'all' ? orders : getOrdersByStatus(tab.value as Order['status'])}
                onUpdateStatus={onUpdateOrderStatus}
                onViewDetails={onViewOrderDetails}
                onPrintOrder={onPrintOrder}
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
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onUpdateStatus,
  onViewDetails,
  onPrintOrder
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
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  onViewDetails,
  onPrintOrder
}) => {
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
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
  const timeSinceCreated = Date.now() - new Date(order.createdAt).getTime();
  const minutesAgo = Math.floor(timeSinceCreated / 60000);

  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Order Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-primary p-2 rounded-lg text-primary-foreground font-bold">
              #{order.orderNumber}
            </div>
            <Badge variant={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <Badge variant="outline">
              {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
            </Badge>
            {order.table && (
              <Badge variant="secondary">
                Table {order.table.number}
              </Badge>
            )}
          </div>

          <div className="text-sm text-muted-foreground mb-2">
            <span>{minutesAgo} minutes ago</span>
            {order.customerName && <span> • {order.customerName}</span>}
            {order.customerPhone && <span> • {order.customerPhone}</span>}
          </div>

          <div className="space-y-1">
            {order.items.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>{item.quantity}x {item.menuItem.name}</span>
                <span className="text-muted-foreground">₹{item.totalPrice}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{order.items.length - 3} more items
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="font-semibold">Total: ₹{order.total}</span>
            <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row lg:flex-col gap-2 lg:w-32">
          {nextStatus && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, nextStatus)}
              className="flex-1 lg:flex-none"
            >
              {nextStatus === 'preparing' && 'Start Preparing'}
              {nextStatus === 'ready' && 'Mark Ready'}
              {nextStatus === 'served' && 'Mark Served'}
            </Button>
          )}
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onViewDetails(order)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPrintOrder(order.id)}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderManagement;