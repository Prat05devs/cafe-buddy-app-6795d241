import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Utensils, 
  ShoppingCart, 
  Users, 
  BarChart, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RestaurantConfig } from '@/lib/config';
import { getLocalizedText } from '@/lib/helpers';

interface SidebarProps {
  config: RestaurantConfig;
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
}

export const Sidebar = ({ 
  config, 
  activePage, 
  onNavigate,
  collapsed = false,
  onToggleCollapse
}: SidebarProps) => {
  const restaurantName = getLocalizedText(config.restaurantName, config.language || 'en');
  // Define navigation items based on config features
  const navItems: NavItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      enabled: true 
    },
    { 
      id: 'menu', 
      label: 'Menu', 
      icon: Utensils, 
      enabled: true 
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: ShoppingCart, 
      enabled: true 
    },
    { 
      id: 'tables', 
      label: 'Tables', 
      icon: Users, 
      enabled: !!config.features.tableManagement 
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart, 
      enabled: !!config.features.analyticsReports 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      enabled: true 
    },
  ];
  
  const enabledNavItems = navItems.filter(item => item.enabled);
  
  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 left-0 z-30 flex flex-col",
        "border-r border-glass-border bg-gradient-glass backdrop-blur-md",
        "transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-glass-border">
        {!collapsed && (
          <h2 className="text-lg font-bold">{restaurantName}</h2>
        )}
        
        {onToggleCollapse && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleCollapse}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {enabledNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size={collapsed ? "icon" : "default"}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full justify-start",
                    isActive && "shadow-glow"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && (
                    <span className="ml-2">{item.label}</span>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-3 mt-auto border-t border-glass-border">
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          {collapsed ? (
            <span>v{config.version || '1.0'}</span>
          ) : (
            <span>Version {config.version || '1.0'}</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;