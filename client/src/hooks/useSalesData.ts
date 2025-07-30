import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Order } from '@/types/restaurant';
import { 
  isToday, 
  isThisWeek, 
  isThisMonth, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  subDays,
  format,
  eachDayOfInterval
} from 'date-fns';

export interface SalesMetrics {
  revenue: number;
  orders: number;
  items: number;
  averageOrderValue: number;
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  items: number;
}

export interface SalesData {
  today: SalesMetrics;
  week: SalesMetrics;
  month: SalesMetrics;
  dailyTrend: DailySales[];
  lastRefresh: Date;
}

export interface PaymentMethodStats {
  method: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface TopSellingItem {
  menuItem: any;
  quantity: number;
  revenue: number;
}

export interface PeakHour {
  hour: number;
  orders: number;
  revenue: number;
}

export function useSalesData(orders: Order[]) {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch comprehensive analytics from API
  const { data: analyticsResponse, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics'],
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes
  });

  // Update analytics data when API response changes
  useEffect(() => {
    if (analyticsResponse) {
      setAnalyticsData(analyticsResponse);
    }
  }, [analyticsResponse]);

  // Filter only paid and served orders for fallback calculations
  const paidOrders = useMemo(() => {
    return orders.filter(order => 
      order.paymentStatus === 'paid' && 
      order.status === 'served'
    );
  }, [orders]);

  // Calculate sales metrics for a date range
  const calculateMetrics = (ordersInRange: Order[]): SalesMetrics => {
    const revenue = ordersInRange.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = ordersInRange.length;
    const totalItems = ordersInRange.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

    return { revenue, orders: totalOrders, items: totalItems, averageOrderValue };
  };

  // Calculate daily trend for the last 7 days
  const calculateDailyTrend = (): DailySales[] => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    return last7Days.map(date => {
      const dayOrders = paidOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return format(orderDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      const metrics = calculateMetrics(dayOrders);
      return {
        date: format(date, 'yyyy-MM-dd'),
        revenue: metrics.revenue,
        orders: metrics.orders,
        items: metrics.items
      };
    });
  };

  // Generate sales data
  const generateSalesData = (): SalesData => {
    const todayOrders = paidOrders.filter(order => isToday(new Date(order.createdAt)));
    const weekOrders = paidOrders.filter(order => isThisWeek(new Date(order.createdAt)));
    const monthOrders = paidOrders.filter(order => isThisMonth(new Date(order.createdAt)));

    return {
      today: calculateMetrics(todayOrders),
      week: calculateMetrics(weekOrders),
      month: calculateMetrics(monthOrders),
      dailyTrend: calculateDailyTrend(),
      lastRefresh: new Date()
    };
  };

  // Get top selling items
  const getTopSellingItems = (limit: number = 5): TopSellingItem[] => {
    const itemStats = new Map();

    paidOrders.forEach(order => {
      order.items.forEach(item => {
        const key = item.menuItemId;
        const current = itemStats.get(key) || { 
          menuItem: item.menuItem, 
          quantity: 0, 
          revenue: 0 
        };
        itemStats.set(key, {
          ...current,
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + item.totalPrice
        });
      });
    });

    return Array.from(itemStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  };

  // Get payment method statistics
  const getPaymentMethodStats = (): PaymentMethodStats[] => {
    const stats = paidOrders.reduce((acc, order) => {
      const method = order.paymentMethod || 'cash';
      if (!acc[method]) {
        acc[method] = { amount: 0, count: 0 };
      }
      acc[method].amount += order.total;
      acc[method].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const totalAmount = Object.values(stats).reduce((sum, stat) => sum + stat.amount, 0);

    return Object.entries(stats).map(([method, data]) => ({
      method: method.charAt(0).toUpperCase() + method.slice(1),
      amount: data.amount,
      count: data.count,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
    }));
  };

  // Get peak hours analysis
  const getPeakHours = (limit: number = 5): PeakHour[] => {
    const hourlyStats = new Array(24).fill(0).map((_, hour) => ({
      hour,
      orders: 0,
      revenue: 0
    }));

    paidOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourlyStats[hour].orders += 1;
      hourlyStats[hour].revenue += order.total;
    });

    return hourlyStats
      .filter(stat => stat.orders > 0)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, limit);
  };

  // Refresh sales data function
  const refreshSalesData = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newSalesData = generateSalesData();
    setSalesData(newSalesData);
    
    setIsRefreshing(false);
    
    // Save to localStorage for persistence
    localStorage.setItem('salesData', JSON.stringify({
      ...newSalesData,
      lastRefresh: newSalesData.lastRefresh.toISOString()
    }));
  };

  // Load initial data
  useEffect(() => {
    // Try to load from localStorage first
    const savedData = localStorage.getItem('salesData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSalesData({
          ...parsed,
          lastRefresh: new Date(parsed.lastRefresh)
        });
      } catch (error) {
        console.error('Error parsing saved sales data:', error);
      }
    }
    
    // Generate fresh data
    const newSalesData = generateSalesData();
    setSalesData(newSalesData);
  }, [paidOrders]);

  // Auto-refresh at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      refreshSalesData();
      
      // Set up daily interval
      const dailyInterval = setInterval(refreshSalesData, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, []);

  return {
    salesData: analyticsData || salesData,
    analyticsData,
    isRefreshing: isRefreshing || analyticsLoading,
    refreshSalesData,
    getTopSellingItems,
    getPaymentMethodStats,
    getPeakHours,
    paidOrders
  };
}
