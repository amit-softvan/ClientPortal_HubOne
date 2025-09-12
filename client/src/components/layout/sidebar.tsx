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

export function Sidebar() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null; // Mobile sidebar is handled by MobileNavTrigger in Header
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-72 z-50">
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
