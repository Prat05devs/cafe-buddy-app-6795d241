import { useState } from "react";
import { 
  Home, 
  Menu, 
  ShoppingCart, 
  Table, 
  BarChart3, 
  Settings,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Menu", url: "/menu", icon: Menu },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Tables", url: "/tables", icon: Table },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const isExpanded = navigationItems.some((item) => isActive(item.url));

  const getNavClasses = (itemPath: string) => {
    const active = isActive(itemPath);
    return active 
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" 
      : "text-muted-foreground hover:bg-muted hover:text-foreground";
  };

  return (
    <Sidebar
      className={`border-r transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarContent className="bg-card">
        {/* Restaurant branding */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CS</span>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-lg">Cafe Sunrise</h2>
                <p className="text-xs text-muted-foreground">Restaurant Management</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavClasses(item.url)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="mt-auto p-4 border-t">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground text-center">
              <p>&copy; 2024 Cafe Sunrise</p>
              <p>Management System</p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}