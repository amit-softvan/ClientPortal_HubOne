import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/components/auth/auth-context";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  LayoutDashboard,
  ListTodo,
  Users,
  Menu,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Queue Management", href: "/queue-management", icon: ListTodo },
  { name: "PA Tracker", href: "/pa-tracker", icon: ClipboardCheck },
  { name: "EV Tracker", href: "/ev-tracker", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

const adminNavigation = [
  { name: "User Management", href: "/user-management", icon: Users },
];

function SidebarContent() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav 
      className={cn(
        "sidebar-gradient h-full text-white transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "w-72 p-6" : "w-16 p-2"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={cn(
        "flex items-center mb-8 transition-all duration-300",
        isExpanded ? "justify-start" : "justify-center"
      )}>
        <CheckSquare className="h-8 w-8 flex-shrink-0" />
        <h1 
          className={cn(
            "text-2xl font-bold ml-3 transition-all duration-300 whitespace-nowrap",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 ml-0"
          )} 
          data-testid="app-title"
        >
          mySage
        </h1>
      </div>

      <ul className="space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-all duration-200 font-medium relative group",
                  isActive && "text-white bg-white/15",
                  isExpanded ? "px-5 py-3 mx-3" : "px-3 py-3 mx-1 justify-center"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span 
                  className={cn(
                    "ml-3 transition-all duration-300 whitespace-nowrap",
                    isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 ml-0"
                  )}
                >
                  {item.name}
                </span>
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            </li>
          );
        })}

        {user?.role === "admin" && (
          <>
            <li className={cn(
              "border-t border-white/20 my-4 transition-all duration-300",
              isExpanded ? "mx-3" : "mx-1"
            )}></li>
            {adminNavigation.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-all duration-200 font-medium relative group",
                      isActive && "text-white bg-white/15",
                      isExpanded ? "px-5 py-3 mx-3" : "px-3 py-3 mx-1 justify-center"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span 
                      className={cn(
                        "ml-3 transition-all duration-300 whitespace-nowrap",
                        isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 ml-0"
                      )}
                    >
                      {item.name}
                    </span>
                    {/* Tooltip for collapsed state */}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </>
        )}
      </ul>
    </nav>
  );
}

export function Sidebar() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null; // Mobile sidebar is handled by MobileNavTrigger in Header
  }

  return (
    <div className="fixed left-0 top-0 h-screen z-50">
      <SidebarContent />
    </div>
  );
}

export function MobileNavTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <MobileSidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function MobileSidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <nav className="sidebar-gradient h-full p-6 text-white">
      <div className="flex items-center mb-8">
        <CheckSquare className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold" data-testid="app-title">mySage</h1>
      </div>

      <ul className="space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center px-5 py-3 mx-3 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-all duration-200 font-medium",
                  isActive && "text-white bg-white/15"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            </li>
          );
        })}

        {user?.role === "admin" && (
          <>
            <li className="border-t border-white/20 my-4 mx-3"></li>
            {adminNavigation.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center px-5 py-3 mx-3 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-all duration-200 font-medium",
                      isActive && "text-white bg-white/15"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </>
        )}
      </ul>
    </nav>
  );
}
