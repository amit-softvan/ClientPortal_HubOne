import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/components/auth/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Key, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MobileNavTrigger } from "./sidebar";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleChangePassword = () => {
    setShowChangePassword(false);
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated.",
    });
  };

  return (
    <>
      <header className="bg-white border-b border-border px-4 md:px-6 py-4 sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {isMobile && <MobileNavTrigger />}
            <h2 className="text-lg md:text-xl font-semibold text-foreground" data-testid="page-title">
              {title}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {!isMobile && (
              <span className="text-muted-foreground text-sm">
                Welcome back, <span className="font-semibold text-foreground" data-testid="user-name">{user?.firstName} {user?.lastName}</span>
              </span>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  data-testid="user-menu-trigger"
                >
                  <User className="h-4 w-4" />
                  <span data-testid="user-role">{user?.role === 'admin' ? 'Admin' : 'Staff'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/user-profile" className="flex items-center w-full" data-testid="menu-user-profile">
                    <User className="h-4 w-4 mr-2" />
                    User Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setShowChangePassword(true)} data-testid="menu-change-password">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                  data-testid="menu-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" data-testid="input-current-password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" data-testid="input-new-password" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" data-testid="input-confirm-password" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePassword(false)} data-testid="button-cancel-password">
              Cancel
            </Button>
            <Button onClick={handleChangePassword} data-testid="button-update-password">
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
