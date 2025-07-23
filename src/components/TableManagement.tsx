import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus,
  RotateCcw,
  Clock,
  CheckCircle,
  Utensils,
  MapPin
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
  const [selectedArea, setSelectedArea] = useState<string>('Main Dining');
  
  // Define areas similar to the reference image
  const areas = ['Main Dining', 'Terrace', 'Outdoor'];
  const filteredTables = tables.filter(t => t.floor === selectedArea || (selectedArea === 'Main Dining' && !t.floor));

  const getTableStats = () => {
    const available = tables.filter(t => t.status === 'available').length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    
    return { available, occupied, reserved, total: tables.length };
  };

  const stats = getTableStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Tables</h2>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>On Dine</span>
        </div>
      </div>

      {/* Area Selection */}
      <div className="flex gap-2">
        {areas.map(area => (
          <Button
            key={area}
            variant={selectedArea === area ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedArea(area)}
            className="min-w-[100px]"
          >
            {area}
          </Button>
        ))}
      </div>

      {/* Floor Plan View */}
      <Card className="p-8 min-h-[500px] bg-gradient-to-br from-background/50 to-muted/30">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Simulate floor plan layout */}
          {filteredTables.map((table, index) => {
            // Create a pseudo floor plan layout
            const positions = [
              { col: 2, row: 2 }, { col: 4, row: 2 }, { col: 6, row: 2 }, { col: 8, row: 2 }, { col: 10, row: 2 },
              { col: 2, row: 4 }, { col: 4, row: 4 }, { col: 6, row: 4 }, { col: 8, row: 4 }, { col: 10, row: 4 },
              { col: 2, row: 6 }, { col: 4, row: 6 }, { col: 6, row: 6 }, { col: 8, row: 6 }, { col: 10, row: 6 },
            ];
            
            const position = positions[index] || { col: 2 + (index % 5) * 2, row: 2 + Math.floor(index / 5) * 2 };
            
            return (
              <TableIcon
                key={table.id}
                table={table}
                orders={tableOrders[table.id] || []}
                onSelect={() => onSelectTable(table)}
                onAddOrder={() => onAddOrder(table.id)}
                onClean={() => onCleanTable(table.id)}
                onViewOrders={() => onViewTableOrders(table.id)}
                style={{
                  gridColumn: `${position.col} / span 1`,
                  gridRow: `${position.row} / span 1`,
                }}
              />
            );
          })}
        </div>
      </Card>
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

interface TableIconProps {
  table: Table;
  orders: Order[];
  onSelect: () => void;
  onAddOrder: () => void;
  onClean: () => void;
  onViewOrders: () => void;
  style?: React.CSSProperties;
}

const TableIcon: React.FC<TableIconProps> = ({
  table,
  orders,
  onSelect,
  onAddOrder,
  onClean,
  onViewOrders,
  style
}) => {
  const getStatusColor = (status: Table['status']) => {
    const colors = {
      available: 'bg-emerald-500 hover:bg-emerald-600',
      occupied: 'bg-red-500 hover:bg-red-600',
      reserved: 'bg-orange-500 hover:bg-orange-600',
      cleaning: 'bg-gray-400 hover:bg-gray-500'
    };
    return colors[status];
  };

  const activeOrders = orders.filter(order => ['pending', 'preparing', 'ready'].includes(order.status));

  return (
    <div style={style} className="flex flex-col items-center space-y-1">
      {/* Table Icon */}
      <div
        className={`w-16 h-16 rounded-lg ${getStatusColor(table.status)} cursor-pointer transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center text-white shadow-lg relative`}
        onClick={onSelect}
      >
        {/* Table Number */}
        <div className="text-sm font-bold">#{table.number}</div>
        
        {/* Capacity */}
        <div className="flex items-center text-xs">
          <Users className="w-3 h-3 mr-1" />
          {table.capacity}
        </div>

        {/* Active Orders Badge */}
        {activeOrders.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {activeOrders.length}
          </div>
        )}
      </div>

      {/* Table Label */}
      <div className="text-xs text-center">
        <div className="font-medium">Table #{table.number}</div>
        {table.status === 'occupied' && activeOrders.length > 0 && (
          <div className="text-orange-600 font-medium">
            {activeOrders.length} order{activeOrders.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableManagement;