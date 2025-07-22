import React from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';
import { RestaurantConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

interface TopBarProps {
  config: RestaurantConfig;
  onToggleSidebar?: () => void;
  currentUser?: string;
  userRole?: string;
}

export const TopBar = ({ 
  config, 
  onToggleSidebar,
  currentUser,
  userRole
}: TopBarProps) => {
  const { theme, setTheme, isDarkMode } = useTheme();
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };
  
  return (
    <header className="w-full bg-gradient-glass backdrop-blur-md border-b border-glass-border shadow-sm py-3 px-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar} 
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            {config.logo ? (
              <img 
                src={config.logo} 
                alt={config.restaurantName} 
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-sm font-bold text-primary-foreground">
                  {config.restaurantName.charAt(0)}
                </span>
              </div>
            )}
            
            <h1 className="text-lg font-bold">{config.restaurantName}</h1>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {currentUser && (
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold">{currentUser}</p>
                {userRole && (
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                )}
              </div>
              
              <div className={cn(
                "h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-sm",
                "text-sm font-bold text-primary-foreground"
              )}>
                {currentUser.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;