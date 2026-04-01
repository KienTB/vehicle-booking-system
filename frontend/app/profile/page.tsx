"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/lib/services/auth-service";
import { toast } from "sonner";
import { User, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setIsUpdatingProfile(true);

    try {
      const updated = await authService.updateProfile({
        fullName: profileData.fullName,
        phone: profileData.phone || undefined,
        address: profileData.address || undefined,
      });
      updateUser(updated);
      toast.success("Profile updated successfully");
    } catch {
      setProfileError("Failed to update profile. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);

    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setPasswordError("Failed to change password. Please check your current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto max-w-3xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.fullName || user?.username}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  Role: <span className="font-medium">{user?.role}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="profile" className="flex-1 gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="flex-1 gap-2">
                <Lock className="h-4 w-4" />
                Password
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{profileError}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleProfileUpdate}>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                          id="username"
                          value={user?.username || ""}
                          disabled
                          className="bg-muted"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Username cannot be changed
                        </p>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-muted"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, fullName: e.target.value }))
                          }
                          disabled={isUpdatingProfile}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          disabled={isUpdatingProfile}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="address">Address</FieldLabel>
                        <Input
                          id="address"
                          placeholder="123 Main St, City, Country"
                          value={profileData.address}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, address: e.target.value }))
                          }
                          disabled={isUpdatingProfile}
                        />
                      </Field>

                      <Button type="submit" disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {passwordError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handlePasswordChange}>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          disabled={isChangingPassword}
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="At least 6 characters"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          disabled={isChangingPassword}
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          disabled={isChangingPassword}
                          required
                        />
                      </Field>

                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
