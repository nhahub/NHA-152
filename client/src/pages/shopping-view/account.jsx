import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { User, Package, MapPin, Camera, Settings } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { checkAuth } from "@/store/auth-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.profilePic) {
      setProfilePic(user.profilePic);
    }
  }, [user?.profilePic]);

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("my_file", file);

      const uploadResponse = await apiClient.post(
        API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PICTURE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data.success) {
        const imageUrl = uploadResponse.data.result.url;

        // Update user profile picture
        const updateResponse = await apiClient.put(
          API_ENDPOINTS.AUTH.UPDATE_PROFILE_PICTURE(user.id),
          { profilePicUrl: imageUrl }
        );

        if (updateResponse.data.success) {
          setProfilePic(imageUrl);
          
          // Refresh user data from server to update Redux store
          dispatch(checkAuth());

          toast({
            title: "Success",
            description: "Profile picture updated successfully",
          });
        } else {
          throw new Error("Failed to update profile picture");
        }
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF2FB] dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Account background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E0F75]/80 via-[#2f3fbd]/70 to-[#3785D8]/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div
              className="relative w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto border-2 border-white/30 cursor-pointer hover:bg-white/30 transition-all group overflow-hidden"
              onClick={handleProfilePicClick}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <h1 className="text-4xl font-bold">My Account</h1>
            <p className="text-white/90 text-lg">Manage your orders and addresses</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-lg p-6 md:p-8">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#EAF2FB] dark:bg-slate-700 rounded-2xl p-1">
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:bg-white data-[state=active]:text-[#1E0F75] data-[state=active]:shadow-md rounded-xl transition-all flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  className="data-[state=active]:bg-white data-[state=active]:text-[#1E0F75] data-[state=active]:shadow-md rounded-xl transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Address
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-white data-[state=active]:text-[#1E0F75] data-[state=active]:shadow-md rounded-xl transition-all flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
            </TabsList>
              <TabsContent value="orders" className="mt-6">
              <ShoppingOrders />
            </TabsContent>
              <TabsContent value="address" className="mt-6">
              <Address />
            </TabsContent>
              <TabsContent value="settings" className="mt-6">
                <AccountSettings />
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Account Settings Component
function AccountSettings() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password fields if new password is provided
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast({
          title: "Current password required",
          description: "Please enter your current password to change it",
          variant: "destructive",
        });
        return;
      }

      if (formData.newPassword.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "New password and confirm password must match",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const updateData = {
        userName: formData.userName,
        email: formData.email,
      };

      // Only include password fields if new password is provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await apiClient.put(
        API_ENDPOINTS.AUTH.UPDATE_ACCOUNT(user.id),
        updateData
      );

      if (response.data.success) {
        // Refresh user data
        dispatch(checkAuth());

        // Reset password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        toast({
          title: "Success",
          description: "Account details updated successfully",
        });
      } else {
        throw new Error(response.data.message || "Failed to update account");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update account details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </CardTitle>
        <p className="text-gray-600 dark:text-slate-300 mt-2">
          Update your account information and password
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-gray-900 dark:text-white">
              Username
            </Label>
            <Input
              id="userName"
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              className="text-gray-900 dark:text-white"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 dark:text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="text-gray-900 dark:text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
              Leave blank if you don't want to change your password
            </p>

            {/* Current Password */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="currentPassword"
                className="text-gray-900 dark:text-white"
              >
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="text-gray-900 dark:text-white"
                placeholder="Enter current password"
              />
            </div>

            {/* New Password */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="newPassword"
                className="text-gray-900 dark:text-white"
              >
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="text-gray-900 dark:text-white"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-900 dark:text-white"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="text-gray-900 dark:text-white"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white rounded-lg h-11 text-base font-medium"
          >
            {isUpdating ? "Updating..." : "Update Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ShoppingAccount;
