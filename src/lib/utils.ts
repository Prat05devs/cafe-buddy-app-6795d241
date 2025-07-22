import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RestaurantConfig } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, config?: RestaurantConfig | null): string {
  const currency = config?.currency || '₹';
  
  return `${currency}${amount.toFixed(2).replace(/\.00$/, '')}`;
}

export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return (subtotal * taxRate) / 100;
}

export function calculateTotal(subtotal: number, tax: number, discount: number = 0): number {
  return subtotal + tax - discount;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function generateOrderNumber(prefix: string = 'ORD', orderCount: number): string {
  return `${prefix}${String(orderCount + 1).padStart(4, '0')}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function getStatusColor(
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 
          'pending' | 'preparing' | 'ready' | 'served' | 'cancelled' | 
          'paid' | 'unpaid'
): string {
  const colors: Record<string, string> = {
    available: 'success',
    occupied: 'warning',
    reserved: 'default',
    cleaning: 'secondary',
    pending: 'warning',
    preparing: 'default',
    ready: 'success',
    served: 'secondary',
    cancelled: 'destructive',
    paid: 'success',
    unpaid: 'warning'
  };
  
  return colors[status] || 'default';
}

export function isLowStock(current: number, minimum: number): boolean {
  return current <= minimum;
}