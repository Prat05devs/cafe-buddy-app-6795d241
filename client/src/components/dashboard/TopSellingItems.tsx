
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantConfig } from '@/lib/config';
import { MenuItem } from '@/types/restaurant';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Award } from 'lucide-react';

interface TopSellingItemsProps {
  config: RestaurantConfig;
  items: Array<{
    item: MenuItem;
    quantity: number;
    revenue: number;
  }>;
}

export const TopSellingItems = ({ config, items }: TopSellingItemsProps) => {
  if (!items || items.length === 0) {
    return (
      <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Award className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No sales data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Top Selling Items</CardTitle>
        <TrendingUp className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.slice(0, 5).map((item, index) => (
            <div 
              key={item.item.id}
              className="flex items-center p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-colors"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  #{index + 1}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium truncate">{item.item.name}</h4>
                  <span className="text-sm font-semibold">
                    {formatCurrency(item.item.price, config)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{item.quantity} sold</span>
                  <span>{formatCurrency(item.revenue, config)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSellingItems;