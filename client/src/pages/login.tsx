import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckSquare, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both username and password.",
      });
      return;
    }

    const success = await login(formData.username, formData.password);
    
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome to mySage Client Portal!",
      });
      setLocation("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
      });
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    toast({
      title: "Reset link sent",
      description: "If an account with that email exists, we've sent a reset link.",
    });
  };

  return (
    <div className="login-gradient min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <CheckSquare className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-dark mb-2" data-testid="login-title">
              mySage Client Portal
            </h1>
            <p className="text-muted-foreground">
              Secure access for healthcare professionals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-sm font-semibold">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mt-1"
                required
                data-testid="input-username"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, remember: checked as boolean })
                }
                data-testid="checkbox-remember"
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-primary hover:underline text-sm"
                onClick={() => setShowForgotPassword(true)}
                data-testid="link-forgot-password"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <div>
            <Label htmlFor="reset-email">Email Address</Label>
            <Input
              id="reset-email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="mt-1"
              required
              data-testid="input-reset-email"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowForgotPassword(false)}
              data-testid="button-cancel-reset"
            >
              Cancel
            </Button>
            <Button onClick={handleForgotPassword} data-testid="button-send-reset">
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
