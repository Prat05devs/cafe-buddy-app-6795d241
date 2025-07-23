// src/components/Navigation.tsx (Updated Code)

import React from 'react';
import { motion } from 'framer-motion'; // Import motion
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
    // The outer nav container can keep its original styling
    <nav className={cn("flex justify-center", className)}>
      {/* We create a new container for the tabs to get the "pill" shape */}
      <ul className="flex items-center gap-1 p-2 bg-gradient-glass backdrop-blur-md border border-glass-border rounded-full shadow-medium">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            // Each item is now an `li` element for better semantics
            <li
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-full px-3 sm:px-4 py-2 cursor-pointer transition-colors duration-300",
                // Change text color based on active state for better contrast
                // Add a hover effect for inactive items
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* This is the magic! The animated pill. */}
              {/* It only renders for the active item, and `layoutId` tells Framer Motion to animate it between items. */}
              {isActive && (
                <motion.div
                  layoutId="active-navigation-pill"
                  className="absolute inset-0 bg-primary rounded-full"
                  style={{ borderRadius: 9999 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                />
              )}

              {/* The icon and text need a relative z-index to appear ON TOP of the animated pill */}
              <Icon className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
              
              {/* Your responsive label logic, simplified into one span */}
              <span className="relative z-10 hidden sm:inline truncate">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};