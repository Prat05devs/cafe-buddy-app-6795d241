import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus,
  RotateCcw,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Utensils
} from 'lucide-react';
import { Table, Order } from '@/types/restaurant';

interface TableManagementProps {
  tables: Table[];
  tableOrders: Record<string, Order[]>;
  onSelectTable: (table: Table) => void;
  onAddOrder: (tableId: string) => void;
  onCleanTable: (tableId: string) => void;
  onViewTableOrders: (tableId: string) => void;
}

export const TableManagement: React.FC<TableManagementProps> = ({
  tables,
  tableOrders,
  onSelectTable,
  onAddOrder,
  onCleanTable,
  onViewTableOrders
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  
  const floors = Array.from(new Set(tables.map(t => t.floor).filter(Boolean)));
  const filteredTables = selectedFloor === 'all' 
    ? tables 
    : tables.filter(t => t.floor === selectedFloor);

  const getTableStats = () => {
    const available = tables.filter(t => t.status === 'available').length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    const cleaning = tables.filter(t => t.status === 'cleaning').length;

    return { available, occupied, reserved, cleaning, total: tables.length };
  };

  const stats = getTableStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Table Management</h2>
          <p className="text-muted-foreground">Monitor and manage restaurant tables</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Tables"
          value={stats.total}
          icon={Users}
          color="default"
        />
        <StatCard
          title="Available"
          value={stats.available}
          icon={CheckCircle}
          color="success"
        />
        <StatCard
          title="Occupied"
          value={stats.occupied}
          icon={Utensils}
          color="warning"
        />
        <StatCard
          title="Reserved"
          value={stats.reserved}
          icon={Clock}
          color="default"
        />
        <StatCard
          title="Cleaning"
          value={stats.cleaning}
          icon={RotateCcw}
          color="secondary"
        />
      </div>

      {/* Floor Filter */}
      {floors.length > 0 && (
        <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFloor === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedFloor('all')}
            >
              All Floors
            </Button>
            {floors.map(floor => (
              <Button
                key={floor}
                variant={selectedFloor === floor ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFloor(floor)}
              >
                {floor}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredTables.map(table => (
          <TableCard
            key={table.id}
            table={table}
            orders={tableOrders[table.id] || []}
            onSelect={() => onSelectTable(table)}
            onAddOrder={() => onAddOrder(table.id)}
            onClean={() => onCleanTable(table.id)}
            onViewOrders={() => onViewTableOrders(table.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: 'default' | 'success' | 'warning' | 'secondary' | 'destructive';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    secondary: 'bg-secondary/10 text-secondary-foreground',
    destructive: 'bg-destructive/10 text-destructive'
  };

  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </div>
    </Card>
  );
};

interface TableCardProps {
  table: Table;
  orders: Order[];
  onSelect: () => void;
  onAddOrder: () => void;
  onClean: () => void;
  onViewOrders: () => void;
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  orders,
  onSelect,
  onAddOrder,
  onClean,
  onViewOrders
}) => {
  const getStatusColor = (status: Table['status']) => {
    const colors = {
      available: 'success',
      occupied: 'warning',
      reserved: 'default',
      cleaning: 'secondary'
    };
    return colors[status] as 'success' | 'warning' | 'default' | 'secondary';
  };

  const getStatusIcon = (status: Table['status']) => {
    const icons = {
      available: CheckCircle,
      occupied: Utensils,
      reserved: Clock,
      cleaning: RotateCcw
    };
    return icons[status];
  };

  const StatusIcon = getStatusIcon(table.status);
  const activeOrders = orders.filter(order => ['pending', 'preparing', 'ready'].includes(order.status));
  const totalAmount = activeOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <Card 
      className={`bg-gradient-glass backdrop-blur-md border-glass-border p-4 cursor-pointer hover:shadow-medium transition-all duration-300 ${
        table.status === 'occupied' ? 'ring-2 ring-primary/50' : ''
      }`}
      onClick={onSelect}
    >
      <div className="text-center space-y-3">
        {/* Table Number */}
        <div className="relative">
          <div className="bg-gradient-primary p-3 rounded-xl mx-auto w-fit text-primary-foreground">
            <span className="text-lg font-bold">T{table.number}</span>
          </div>
          <Badge 
            variant={getStatusColor(table.status)} 
            className="absolute -top-1 -right-1 text-xs"
          >
            <StatusIcon className="h-3 w-3" />
          </Badge>
        </div>

        {/* Table Info */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Capacity: {table.capacity} guests
          </p>
          {table.status === 'occupied' && activeOrders.length > 0 && (
            <>
              <p className="text-xs font-medium text-primary">
                {activeOrders.length} active order{activeOrders.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm font-bold">₹{totalAmount}</p>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1 justify-center">
          {table.status === 'available' && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddOrder();
              }}
              className="text-xs px-2 py-1 h-auto"
            >
              <Plus className="h-3 w-3 mr-1" />
              Order
            </Button>
          )}
          
          {table.status === 'occupied' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewOrders();
                }}
                className="text-xs px-2 py-1 h-auto"
              >
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onClean();
                }}
                className="text-xs px-2 py-1 h-auto"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </>
          )}
          
          {table.status === 'cleaning' && (
            <Button
              size="sm"
              variant="success"
              onClick={(e) => {
                e.stopPropagation();
                onClean();
              }}
              className="text-xs px-2 py-1 h-auto"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Done
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TableManagement;