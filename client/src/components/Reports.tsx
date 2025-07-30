import { useState } from 'react';
import { Calendar, RefreshCw, DollarSign, TrendingUp, Users, Clock, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useSalesData } from '@/hooks/useSalesData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Reports() {
  const { orders, restaurant } = useRestaurant();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  
  const {
    salesData,
    analyticsData,
    isRefreshing,
    refreshSalesData,
    getTopSellingItems,
    getPaymentMethodStats,
    getPeakHours
  } = useSalesData(orders);

  const handleRefresh = async () => {
    await refreshSalesData();
    toast({
      title: "Data Refreshed",
      description: "Sales data has been updated successfully.",
    });
  };

  if (!salesData && !analyticsData) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading sales data...</p>
        </div>
      </div>
    );
  }

  // Use analytics data if available, otherwise fallback to salesData
  const currentSales = analyticsData ? 
    (selectedPeriod === 'today' ? analyticsData.summary.today : 
     selectedPeriod === 'week' ? analyticsData.summary.week : analyticsData.summary.month) :
    (selectedPeriod === 'today' ? salesData?.today : 
     selectedPeriod === 'week' ? salesData?.week : salesData?.month);

  const topSellingItems = analyticsData?.topSellingItems || getTopSellingItems(5);
  const paymentMethodStats = getPaymentMethodStats();
  const peakHours = analyticsData?.peakHours || getPeakHours(5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <p className="text-muted-foreground">
            Real-time analytics and sales insights from completed orders
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="min-w-[120px]"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Sales Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {restaurant.currency}{currentSales.revenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 'today' ? 'Today' : 
               selectedPeriod === 'week' ? 'This week' : 'This month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSales.orders}</div>
            <p className="text-xs text-muted-foreground">
              Completed & paid orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {restaurant.currency}{currentSales.averageOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSales.items}</div>
            <p className="text-xs text-muted-foreground">
              Total items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Sales Trends</TabsTrigger>
          <TabsTrigger value="items">Top Items</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="hours">Peak Hours</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Trend (Last 7 Days)</CardTitle>
              <CardDescription>
                Revenue and order count from paid orders over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.dailyTrend.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium">
                        {format(new Date(day.date), 'MMM dd')}
                      </div>
                      <Badge variant="secondary">
                        {format(new Date(day.date), 'EEE')}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-right">
                      <div>
                        <div className="text-sm font-medium">
                          {restaurant.currency}{day.revenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{day.orders}</div>
                        <div className="text-xs text-muted-foreground">Orders</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <CardDescription>
                Best performing menu items by revenue from paid orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingItems.length > 0 ? (
                  topSellingItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{item.menuItem.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} units sold
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {restaurant.currency}{item.revenue.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {restaurant.currency}{item.menuItem.price} each
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No sales data available yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Breakdown</CardTitle>
              <CardDescription>
                Revenue distribution by payment method for completed orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodStats.length > 0 ? (
                  paymentMethodStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium">{stat.method}</div>
                        <Badge variant="outline">
                          {stat.percentage.toFixed(1)}%
                        </Badge>
                        <Badge variant="secondary">
                          {stat.count} orders
                        </Badge>
                      </div>
                      <div className="font-medium">
                        {restaurant.currency}{stat.amount.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment data available yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
              <CardDescription>
                Busiest hours by order volume from completed orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {peakHours.length > 0 ? (
                  peakHours.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium">
                          {hour.hour}:00 - {hour.hour + 1}:00
                        </div>
                        <Badge variant="secondary">
                          #{index + 1} Busiest
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6 text-right">
                        <div>
                          <div className="text-sm font-medium">{hour.orders}</div>
                          <div className="text-xs text-muted-foreground">Orders</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {restaurant.currency}{hour.revenue.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No peak hours data available yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Refresh Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Last refreshed: {format(salesData.lastRefresh, 'PPpp')}
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Owner-only refresh controls • Auto-refresh at midnight</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
