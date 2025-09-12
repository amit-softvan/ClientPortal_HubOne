import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/components/auth/auth-context";

import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import QueueManagement from "@/pages/queue-management";
import TaskDetail from "@/pages/task-detail";
import PaTracker from "@/pages/pa-tracker";
import EvTracker from "@/pages/ev-tracker";
import Reports from "@/pages/reports";
import UserManagement from "@/pages/user-management";
import UserProfile from "@/pages/user-profile";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/queue-management">
        <ProtectedRoute>
          <QueueManagement />
        </ProtectedRoute>
      </Route>
      
      <Route path="/task-detail/:id/:mode">
        <ProtectedRoute>
          <TaskDetail />
        </ProtectedRoute>
      </Route>
      
      <Route path="/pa-tracker">
        <ProtectedRoute>
          <PaTracker />
        </ProtectedRoute>
      </Route>
      
      <Route path="/ev-tracker">
        <ProtectedRoute>
          <EvTracker />
        </ProtectedRoute>
      </Route>
      
      <Route path="/reports">
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      </Route>
      
      <Route path="/user-management">
        <ProtectedRoute>
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        </ProtectedRoute>
      </Route>
      
      <Route path="/user-profile">
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      </Route>
      
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
