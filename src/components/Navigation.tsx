import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  className?: string;
}

const navigationItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'tables', label: 'Tables', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  className
}) => {
  return (
    <nav className={cn(
      "bg-gradient-glass backdrop-blur-md border border-glass-border rounded-2xl p-4 shadow-medium",
      className
    )}>
      <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "glass"}
              size="default"
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex items-center justify-start lg:justify-center gap-3 lg:gap-2 w-full lg:w-auto",
                isActive && "shadow-glow"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="lg:hidden xl:inline">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export const TopBar: React.FC<{
  restaurantName: string;
  currentUser: string;
}> = ({ restaurantName, currentUser }) => {
  return (
    <div className="bg-gradient-glass backdrop-blur-md border border-glass-border rounded-2xl p-4 shadow-medium mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-primary p-3 rounded-xl shadow-glow">
            <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{restaurantName}</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="glass" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="glass" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 bg-destructive h-3 w-3 rounded-full"></div>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{currentUser}</p>
              <p className="text-xs text-muted-foreground">Manager</p>
            </div>
            <div className="h-10 w-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-semibold">
                {currentUser.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};