
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { RestaurantConfig } from '@/lib/config';
import { Order as AppOrder } from '@/types/restaurant';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { Clock, CheckCircle, AlertTriangle, Utensils, ShoppingBag } from 'lucide-react';

// Modified Order interface that accepts string dates for compatibility
interface Order extends Omit<AppOrder, 'createdAt' | 'updatedAt' | 'servedAt'> {
  createdAt: string | Date;
  updatedAt: string | Date;
  servedAt?: string | Date;
}

interface RecentOrdersProps {
  config: RestaurantConfig;
  orders: Order[];
  onViewAll: () => void;
}

export const RecentOrders = ({ config, orders, onViewAll }: RecentOrdersProps) => {
  if (!orders || orders.length === 0) {
    return (
      <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No recent orders</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <OrderItem 
              key={order.id} 
              order={order} 
              config={config} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface OrderItemProps {
  order: Order;
  config: RestaurantConfig;
}

const OrderItem = ({ order, config }: OrderItemProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'preparing':
        return <Utensils className="h-5 w-5 text-primary" />;
      case 'ready':
      case 'served':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'cancelled':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'preparing':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'ready':
      case 'served':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };
  
  return (
    <div className="flex items-center p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-colors">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">#{order.orderNumber}</span>
            {order.tableId && (
              <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded">
                Table {order.tableId}
              </span>
            )}
          </div>
          <div className={`text-xs px-2 py-0.5 rounded border ${getStatusClass(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>{formatTime(order.createdAt)}</span>
            <span>•</span>
            <span>{order.items.length} items</span>
          </div>
          <span className="font-medium text-foreground">
            {formatCurrency(order.total, config)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;