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
import { RestaurantConfig } from '@/lib/config';
import { getLocalizedText } from '@/lib/helpers';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  className?: string;
  config?: RestaurantConfig;
}

// Base navigation items - always available
const baseNavigationItems = [
  { id: 'dashboard', label: 'Home', icon: Home, alwaysShown: true },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed, alwaysShown: true },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, alwaysShown: true },
  { id: 'tables', label: 'Tables', icon: Users, featureFlag: 'tableManagement' },
  { id: 'reports', label: 'Reports', icon: BarChart3, featureFlag: 'analyticsReports' },
  { id: 'settings', label: 'Settings', icon: Settings, alwaysShown: true },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  className,
  config
}) => {
  // Filter navigation items based on feature flags from config
  const navigationItems = baseNavigationItems.filter(item => {
    if (item.alwaysShown) return true;
    if (!item.featureFlag) return true;
    if (!config) return true; // Show all items if config is not available
    
    return config.features[item.featureFlag as keyof typeof config.features];
  });

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
  config: RestaurantConfig;
  currentUser: string;
  userRole: string;
}> = ({ config, currentUser, userRole }) => {
  const restaurantName = getLocalizedText(config.restaurantName, config.language || 'en');
  
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
              {new Date().toLocaleDateString(config.language === 'en' ? 'en-US' : 'hi-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Search and notifications only shown if those features are enabled */}
          <Button variant="glass" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          {config.features.multiLanguage && (
            <Button variant="glass" size="icon">
              <span className="text-sm font-medium">{config.language.toUpperCase()}</span>
            </Button>
          )}
          <Button variant="glass" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 bg-destructive h-3 w-3 rounded-full"></div>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{currentUser}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
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