import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    position: user?.position || "",
  });

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditing(false);
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

  if (!user) {
    return <MainLayout title="User Profile">Loading...</MainLayout>;
  }

  return (
    <MainLayout title="User Profile">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div>
            <Card className="dashboard-card text-center">
              <CardContent className="p-6">
                <Avatar className={`h-24 w-24 mx-auto mb-4 ${getAvatarColor(user.role)}`}>
                  <AvatarFallback className="text-white font-semibold text-2xl">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-semibold mb-2" data-testid="profile-name">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-muted-foreground mb-3">{user.position}</p>
                
                <Badge 
                  variant={user.role === 'admin' ? 'default' : 'secondary'}
                  className="mb-4"
                  data-testid="profile-role"
                >
                  {user.role === 'admin' ? 'Admin' : 'Staff'}
                </Badge>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span data-testid="profile-email">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span data-testid="profile-phone">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span data-testid="profile-member-since">
                      Member since {format(user.createdAt, "MMM yyyy")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information Form */}
          <div className="lg:col-span-2">
            <Card className="dashboard-card">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    data-testid="button-edit-profile"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                      data-testid="input-first-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                      data-testid="input-last-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      data-testid="input-phone"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                      disabled={!isEditing}
                      data-testid="input-position"
                    />
                  </div>

                  {isEditing && (
                    <div className="md:col-span-2">
                      <Button onClick={handleSaveProfile} data-testid="button-save-profile">
                        <Save className="h-4 w-4 mr-2" />
                        Update Profile
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
