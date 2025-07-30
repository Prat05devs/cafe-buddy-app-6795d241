// src/components/Navigation.tsx (Updated Code)

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  UtensilsCrossed, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RestaurantConfig } from '@/lib/config';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  className?: string;
  config?: RestaurantConfig;
}

// This data structure remains exactly the same
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
  // Your feature flag logic remains untouched - it's perfect.
  const navigationItems = baseNavigationItems.filter(item => {
    if (item.alwaysShown) return true;
    if (!item.featureFlag) return true;
    if (!config) return true;
    
    return config.features[item.featureFlag as keyof typeof config.features];
  });

  return (
    <nav className={cn("flex justify-center py-4", className)}>
      <ul className="flex items-center gap-1 p-2 bg-background/95 backdrop-blur-sm rounded-full shadow-lg">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <li
              key={item.id}
              onClick={() => {
                console.log('Navigation clicked:', item.id);
                onViewChange(item.id);
              }}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-full px-3 sm:px-4 py-2 cursor-pointer transition-colors duration-300",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Framer Motion animated pill background */}
              {isActive && (
                <motion.div
                  layoutId="active-navigation-pill"
                  className="absolute inset-0 bg-primary rounded-full"
                  style={{ borderRadius: 9999 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                />
              )}

              {/* Icon and text with relative z-index to appear above the animated pill */}
              <Icon className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="relative z-10 hidden sm:inline truncate">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};