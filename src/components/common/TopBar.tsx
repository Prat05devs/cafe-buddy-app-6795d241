import React from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';
import { RestaurantConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { getLocalizedText } from '@/lib/helpers';

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
  
  const restaurantName = getLocalizedText(config.restaurantName, config.language || 'en');
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };
  
  return (
    <header className="w-full bg-gradient-glass backdrop-blur-md border-b border-glass-border shadow-sm py-2 sm:py-3 px-2 sm:px-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar} 
              className="lg:hidden flex-shrink-0"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
             {config.logo ? (
               <img 
                 src={config.logo} 
                 alt={restaurantName} 
                 className="h-6 w-6 sm:h-8 sm:w-8 object-contain flex-shrink-0"
               />
             ) : (
               <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                 <span className="text-xs sm:text-sm font-bold text-primary-foreground">
                   {restaurantName.charAt(0)}
                 </span>
               </div>
             )}
             
             <h1 className="text-sm sm:text-lg font-bold truncate min-w-0">{restaurantName}</h1>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
          
          {currentUser && (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold">{currentUser}</p>
                {userRole && (
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                )}
              </div>
              
              <div className={cn(
                "h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-sm",
                "text-xs sm:text-sm font-bold text-primary-foreground"
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