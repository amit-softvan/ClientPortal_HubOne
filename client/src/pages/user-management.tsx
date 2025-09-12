import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Edit, 
  UserX, 
  UserCheck 
} from "lucide-react";
import { mockUsers, filterOptions } from "@/data/static-data";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    position: "",
    password: "",
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "All Roles" || 
      user.role.toLowerCase() === roleFilter.toLowerCase();
    
    const matchesStatus = statusFilter === "All Status" || 
      (statusFilter === "Active" && user.isActive) ||
      (statusFilter === "Inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role || !newUser.password) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const user: User = {
      id: `u${users.length + 1}`,
      username: newUser.email.split('@')[0],
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      position: newUser.position,
      role: newUser.role,
      password: "hashed_password",
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
    };

    setUsers([...users, user]);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      position: "",
      password: "",
    });
    setShowAddUser(false);

    toast({
      title: "User created",
      description: `${newUser.firstName} ${newUser.lastName} has been added successfully.`,
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: `User ${user?.isActive ? 'deactivated' : 'activated'}`,
      description: `${user?.firstName} ${user?.lastName} has been ${user?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-500';
      case 'staff': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <MainLayout title="User Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">
              Manage clinic staff access and permissions
            </p>
          </div>
          <Button onClick={() => setShowAddUser(true)} data-testid="button-add-user">
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* User Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-users"
                />
              </div>
              <div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger data-testid="filter-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger data-testid="filter-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.userStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full" data-testid="button-search-users">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="dashboard-card">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className={`h-10 w-10 ${getAvatarColor(user.role)}`}>
                            <AvatarFallback className="text-white font-semibold">
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.position}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Admin' : 'Staff'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin 
                          ? formatDistanceToNow(user.lastLogin, { addSuffix: true })
                          : "Never"
                        }
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.isActive ? "active" : "inactive"} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-edit-${user.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={user.isActive ? "text-red-600" : "text-green-600"}
                            onClick={() => handleToggleUserStatus(user.id)}
                            data-testid={`button-toggle-${user.id}`}
                          >
                            {user.isActive ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account for clinic staff.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                required
                data-testid="input-first-name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                required
                data-testid="input-last-name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
                data-testid="input-email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                data-testid="input-phone"
              />
            </div>
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger data-testid="select-role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newUser.position}
                onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                data-testid="input-position"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="password">Temporary Password *</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
                data-testid="input-password"
              />
              <p className="text-sm text-muted-foreground mt-1">
                User will be required to change this on first login
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddUser(false)}
              data-testid="button-cancel-user"
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser} data-testid="button-create-user">
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
