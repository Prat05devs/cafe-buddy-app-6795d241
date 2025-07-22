import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DashboardStats, Order } from '@/types/restaurant';

interface DashboardProps {
  stats: DashboardStats;
  recentOrders: Order[];
  onViewOrders: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentOrders,
  onViewOrders
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value={`₹${stats.todaysSales.toLocaleString()}`}
          icon={DollarSign}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Orders"
          value={stats.todaysOrders.toString()}
          icon={ShoppingCart}
          trend="+5"
          trendUp={true}
        />
        <StatCard
          title="Available Tables"
          value={`${stats.availableTables}/${stats.totalTables}`}
          icon={Users}
          trend={`${Math.round((stats.availableTables / stats.totalTables) * 100)}%`}
          trendUp={stats.availableTables > stats.totalTables / 2}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={Clock}
          trend={stats.pendingOrders > 5 ? "High" : "Normal"}
          trendUp={stats.pendingOrders <= 5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Selling Items</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-3">
            {stats.topSellingItems.slice(0, 5).map((item, index) => (
              <div key={item.item.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2 text-sm font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} sold • ₹{item.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <Button variant="outline" size="sm" onClick={onViewOrders}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-secondary rounded-lg p-2">
                    {order.type === 'dine-in' && <Users className="h-4 w-4" />}
                    {order.type === 'takeaway' && <ShoppingCart className="h-4 w-4" />}
                    {order.type === 'delivery' && <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.table?.number && `Table ${order.table.number} • `}
                      ₹{order.total}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <OrderStatusBadge status={order.status} />
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${trendUp ? 'text-success' : 'text-destructive'}`}>
              {trend}
            </span>
            <span className="text-xs text-muted-foreground ml-1">from yesterday</span>
          </div>
        </div>
        <div className="bg-primary/10 rounded-full p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'warning' as const, icon: Clock },
    preparing: { label: 'Preparing', variant: 'default' as const, icon: Clock },
    ready: { label: 'Ready', variant: 'success' as const, icon: CheckCircle },
    served: { label: 'Served', variant: 'secondary' as const, icon: CheckCircle },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: AlertCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};