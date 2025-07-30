import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { RestaurantConfig } from '@/lib/config';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: string | number;
    positive: boolean;
  };
  description?: string;
  status?: 'default' | 'success' | 'warning' | 'destructive';
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  status = 'default'
}: StatCardProps) => {
  const statusClasses = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive'
  };
  
  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            
            {trend && (
              <div className="flex items-center mt-2">
                {trend.positive ? (
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                )}
                <span className={trend.positive ? 'text-success' : 'text-destructive'}>
                  {trend.value}
                </span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          <div className={`rounded-full p-3 ${statusClasses[status]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  config: RestaurantConfig;
  stats: {
    todaySales: number;
    weekSales: number;
    pendingOrders: number;
    completedOrders: number;
    availableTables?: number;
    totalTables?: number;
  };
}

export const DashboardStats = ({ config, stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
      <StatCard
        title="Today's Sales"
        value={formatCurrency(stats.todaySales, config)}
        icon={DollarSign}
        trend={{
          value: '+12%',
          positive: true
        }}
        description="Compared to yesterday"
        status="success"
      />
      
      <StatCard
        title="This Week"
        value={formatCurrency(stats.weekSales, config)}
        icon={Calendar}
        trend={{
          value: '+5%',
          positive: true
        }}
        description="Compared to last week"
        status="default"
      />
      
      <StatCard
        title="Pending Orders"
        value={stats.pendingOrders}
        icon={Clock}
        status={stats.pendingOrders > 5 ? 'warning' : 'default'}
        description={stats.pendingOrders > 5 ? 'Attention needed' : 'On track'}
      />
      
      {config.features.tableManagement && stats.availableTables !== undefined && (
        <StatCard
          title="Available Tables"
          value={`${stats.availableTables}/${stats.totalTables}`}
          icon={Users}
          status={stats.availableTables < 3 ? 'warning' : 'success'}
          description={stats.availableTables < 3 ? 'Running low' : 'Good availability'}
        />
      )}
      
      {!config.features.tableManagement && (
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={ShoppingBag}
          trend={{
            value: stats.completedOrders > 10 ? '+15%' : '-5%',
            positive: stats.completedOrders > 10
          }}
          description="Compared to yesterday"
          status={stats.completedOrders > 10 ? 'success' : 'default'}
        />
      )}
    </div>
  );
};

export default DashboardStats;